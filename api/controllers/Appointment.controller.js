const Appointment = require("../models/Appointment.model");

const AddAppointment = async (req, res) => {
  const { patientId, doctorId, appointmentDate, notes } = req.body;
  try {
    const appointment = await Appointment.create({
      patientId,
      doctorId,
      appointmentDate,
      notes,
    });

    if (!appointment) {
      return res.status(400).json("Error when creaint an appointment");
    }

    res.status(201).json({ appointment });
  } catch (error) {
    console.log(error);
    res.status(500).json("Error creating an appointment");
  }
};

const CanceleAppointment = async (req, res) => {
  const { id } = req.query;
  try {
    const appointment = await Appointment.findByIdAndUpdate(id, {
      status: "canceled",
    });

    if (!appointment) {
      return res.status(400).json("Error when updating an appointment");
    }

    res.status(200).json({ appointment });
  } catch (error) {
    console.log(error);
    res.status(500).json("Error when updating an appointment");
  }
};

module.exports = {
  AddAppointment,
  CanceleAppointment
};
