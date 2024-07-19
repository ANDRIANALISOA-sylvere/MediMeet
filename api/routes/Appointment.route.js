const express = require("express");
const {
  AddAppointment,
  CanceleAppointment,
  CompleteAppointment,
  GetAppointmentByPatient,
  GetAppointmentByDoctor,
  GetDoctorPatients,
} = require("../controllers/Appointment.controller");
const router = express.Router();

router.get("/appointment/patient", GetAppointmentByPatient);
router.get("/appointment/doctor", GetAppointmentByDoctor);
router.get("/doctor/patients", GetDoctorPatients);
router.post("/appointment", AddAppointment);
router.post("/appointment/cancel", CanceleAppointment);
router.post("/appointment/complete", CompleteAppointment);

module.exports = router;
