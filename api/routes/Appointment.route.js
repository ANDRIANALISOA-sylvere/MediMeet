const express = require("express");
const { AddAppointment } = require("../controllers/Appointment.controller");
const router = express.Router();


router.post("/appointment",AddAppointment);


module.exports = router