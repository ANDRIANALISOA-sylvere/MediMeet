const Appointment = require("../models/Appointment.model");
const Patient = require("../models/Patient.model");

const AddAppointment = async (req, res) => {
  const { patientId, doctorId, appointmentDate } = req.body;
  console.log(patientId, doctorId, appointmentDate);
  try {
    const date = new Date(appointmentDate + "Z");
    let appointment = await Appointment.create({
      patientId,
      doctorId,
      appointmentDate: date,
    });

    if (!appointment) {
      return res.status(400).json("Error when creating an appointment");
    }

    appointment = await Appointment.findById(appointment._id)
      .populate("patientId")
      .populate("doctorId");

    res.status(201).json({ appointment });
  } catch (error) {
    console.log(error);
    res.status(500).json("Error creating an appointment");
  }
};

const CanceleAppointment = async (req, res) => {
  const { id } = req.query;
  try {
    let appointment = await Appointment.findByIdAndUpdate(id, {
      status: "cancelled",
    });

    if (!appointment) {
      return res.status(400).json("Appointment not found or error occurred");
    }

    appointment = await Appointment.findById(appointment._id)
      .populate("patientId")
      .populate("doctorId");

    res.status(200).json({ appointment });
  } catch (error) {
    console.log(error);
    res.status(500).json("Error when updating an appointment");
  }
};

const CompleteAppointment = async (req, res) => {
  const { id } = req.query;
  try {
    let appointment = await Appointment.findByIdAndUpdate(id, {
      status: "completed",
    });

    if (!appointment) {
      return res.status(400).json("Appointment not found or error occurred");
    }

    appointment = await Appointment.findById(appointment._id)
      .populate("patientId")
      .populate("doctorId");

    res.status(200).json({ appointment });
  } catch (error) {
    console.log(error);
    res.status(500).json("Error when updating an appointment");
  }
};

const GetAppointmentByPatient = async (req, res) => {
  const { patientId, status } = req.query;

  try {
    if (!patientId) {
      return res.status(400).json({ message: "L'ID du patient est requis" });
    }

    let query = { patientId };

    if (status && status !== "null") {
      query.status = status;
    }

    const appointments = await Appointment.find(query)
      .populate({
        path: "doctorId",
        populate: {
          path: "_id",
          model: "User",
          select: "name",
        },
      })
      .sort({ appointmentDate: 1 });

    if (appointments.length === 0) {
      return res.status(404).json({
        message: status
          ? `Aucun rendez-vous avec le statut "${status}" trouvé pour ce patient`
          : "Aucun rendez-vous trouvé pour ce patient",
      });
    }

    res.status(200).json({
      message: "Rendez-vous récupérés avec succès",
      count: appointments.length,
      appointments: appointments,
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des rendez-vous:", error);
    res.status(500).json({
      message: "Erreur lors de la récupération des rendez-vous",
      error: error.message,
    });
  }
};

const GetAppointmentByDoctor = async (req, res) => {
  const { doctorId, status } = req.query;

  try {
    if (!doctorId) {
      return res.status(400).json({ message: "L'ID du docteur est requis" });
    }

    let query = { doctorId };

    if (status && status !== "null") {
      query.status = status;
    }

    let appointments = await Appointment.find(query)
      .populate({
        path: "patientId",
        model: "User",
        select: "name",
      })
      .sort({ appointmentDate: 1 })
      .lean();

    if (appointments.length === 0) {
      return res.status(404).json({
        message: status
          ? `Aucun rendez-vous avec le statut "${status}" trouvé pour ce docteur`
          : "Aucun rendez-vous trouvé pour ce docteur",
      });
    }

    // Récupérer les avatars des patients
    const patientIds = appointments.map(
      (appointment) => appointment.patientId._id
    );
    const patients = await Patient.find(
      { _id: { $in: patientIds } },
      "avatar"
    ).lean();

    // Créer un map pour un accès rapide aux avatars
    const avatarMap = new Map(
      patients.map((p) => [p._id.toString(), p.avatar])
    );

    // Ajouter les avatars aux données des rendez-vous
    appointments = appointments.map((appointment) => {
      if (appointment.patientId) {
        return {
          ...appointment,
          patientId: {
            _id: appointment.patientId._id,
            name: appointment.patientId.name,
            avatar: avatarMap.get(appointment.patientId._id.toString()),
          },
        };
      }
      return appointment;
    });

    res.status(200).json({
      message: "Rendez-vous récupérés avec succès",
      count: appointments.length,
      appointments: appointments,
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des rendez-vous:", error);
    res.status(500).json({
      message: "Erreur lors de la récupération des rendez-vous",
      error: error.message,
    });
  }
};

const GetPatientDoctors = async (req, res) => {
  const { patientId } = req.query;

  try {
    if (!patientId) {
      return res.status(400).json({ message: "L'ID du patient est requis" });
    }

    const appointments = await Appointment.find({
      patientId: patientId,
      status: "completed",
    }).populate({
      path: "doctorId",
      model: "Doctor",
      populate: {
        path: "_id",
        model: "User",
        select: "name email",
      },
    });

    if (appointments.length === 0) {
      return res.status(404).json({
        message:
          "Aucun docteur avec rendez-vous complété trouvé pour ce patient",
      });
    }

    const uniqueDoctors = appointments.reduce((acc, appointment) => {
      const doctorExists = acc.find(
        (doctor) =>
          doctor._id._id.toString() === appointment.doctorId._id._id.toString()
      );
      if (!doctorExists) {
        acc.push(appointment.doctorId);
      }
      return acc;
    }, []);

    res.status(200).json({
      message:
        "Liste des docteurs avec rendez-vous complétés récupérée avec succès",
      count: uniqueDoctors.length,
      doctors: uniqueDoctors,
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des docteurs:", error);
    res.status(500).json({
      message: "Erreur lors de la récupération des docteurs",
      error: error.message,
    });
  }
};

const GetDoctorPatients = async (req, res) => {
  const { doctorId } = req.query;

  try {
    if (!doctorId) {
      return res.status(400).json({ message: "L'ID du docteur est requis" });
    }

    const appointments = await Appointment.find({
      doctorId: doctorId,
      status: "completed",
    }).populate({
      path: "patientId",
      model: "Patient",
      populate: {
        path: "_id",
        model: "User",
        select: "name email",
      },
      select:"avatar gender address dateOfBirth"
    });

    if (appointments.length === 0) {
      return res.status(404).json({
        message:
          "Aucun patient avec rendez-vous complété trouvé pour ce docteur",
      });
    }

    const uniquePatients = appointments.reduce((acc, appointment) => {
      const patientExists = acc.find(
        (patient) =>
          patient._id._id.toString() ===
          appointment.patientId._id._id.toString()
      );
      if (!patientExists) {
        acc.push(appointment.patientId);
      }
      return acc;
    }, []);

    res.status(200).json({
      message:
        "Liste des patients avec rendez-vous complétés récupérée avec succès",
      count: uniquePatients.length,
      patients: uniquePatients,
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des patients:", error);
    res.status(500).json({
      message: "Erreur lors de la récupération des patients",
      error: error.message,
    });
  }
};

const GetDoctorAppointmentStats = async (req, res) => {
  const { doctorId } = req.query;

  try {
    if (!doctorId) {
      return res.status(400).json({ message: "L'ID du docteur est requis" });
    }

    const appointments = await Appointment.find({ doctorId });

    if (appointments.length === 0) {
      return res.status(404).json({
        message: "Aucun rendez-vous trouvé pour ce docteur",
      });
    }

    const totalAppointments = appointments.length;
    const stats = {
      pending: { count: 0, percentage: 0 },
      cancelled: { count: 0, percentage: 0 },
      completed: { count: 0, percentage: 0 },
    };

    appointments.forEach((appointment) => {
      stats[appointment.status].count++;
    });

    for (let status in stats) {
      stats[status].percentage = (
        (stats[status].count / totalAppointments) *
        100
      ).toFixed(2);
    }

    res.status(200).json({
      message: "Statistiques des rendez-vous récupérées avec succès",
      totalAppointments,
      stats,
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des statistiques:", error);
    res.status(500).json({
      message: "Erreur lors de la récupération des statistiques",
      error: error.message,
    });
  }
};

module.exports = {
  AddAppointment,
  CanceleAppointment,
  CompleteAppointment,
  GetAppointmentByPatient,
  GetAppointmentByDoctor,
  GetDoctorPatients,
  GetDoctorAppointmentStats,
  GetPatientDoctors,
};
