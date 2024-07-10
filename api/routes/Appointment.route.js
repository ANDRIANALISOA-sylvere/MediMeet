const express = require("express");
const {
  AddAppointment,
  CanceleAppointment,
  CompleteAppointment,
  GetAppointmentByPatient,
} = require("../controllers/Appointment.controller");
const router = express.Router();

router.get("/appointment/patient", GetAppointmentByPatient);
router.post("/appointment", AddAppointment);
router.post("/appointment/cancel", CanceleAppointment);
router.post("/appointment/complete", CompleteAppointment);

module.exports = router;
