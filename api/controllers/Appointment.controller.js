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

    if (appointment) {
      return res.status(201).json({ appointment });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json("Error creating an appointment");
  }
};

module.exports = {
  AddAppointment,
};