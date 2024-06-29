const express = require("express");
const {
  AddAppointment,
  CanceleAppointment,
} = require("../controllers/Appointment.controller");
const router = express.Router();

router.post("/appointment", AddAppointment);
router.post("/appointment/cancel", CanceleAppointment);

module.exports = router;
