const Appointment = require("../models/Appointment.model");

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
      status: "canceled",
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

module.exports = {
  AddAppointment,
  CanceleAppointment,
  CompleteAppointment,
  GetAppointmentByPatient,
};
