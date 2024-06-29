const express = require("express");
const {
  addDoctor,
  getDoctors,
  getDoctorById,
  updateDoctor,
  getDoctorAvailability,
  addDoctorAvailability,
} = require("../controllers/Doctor.controller");
const router = express.Router();

router.post("/doctor", addDoctor);
router.get("/doctors", getDoctors);
router.get("/doctor/:id", getDoctorById);
router.put("/doctor/:id", updateDoctor);
router.get("/doctor/:id/availability", getDoctorAvailability);
router.post("/doctor/:id/availability", addDoctorAvailability);

module.exports = router;
