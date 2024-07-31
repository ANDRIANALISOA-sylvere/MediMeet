const express = require("express");
const {
  addDoctor,
  getDoctors,
  getDoctorById,
  updateDoctor,
  getDoctorAvailability,
  addDoctorAvailability,
  getPopularDoctors,
  getUniqueSpecialties,
} = require("../controllers/Doctor.controller");
const router = express.Router();
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

router.post("/doctor", upload.single("avatar"), addDoctor);
router.get("/doctors", getDoctors);
router.get("/doctor/popular", getPopularDoctors);
router.get("/doctors/specialties", getUniqueSpecialties);
router.get("/doctor/:id", getDoctorById);
router.put("/doctor/:id", updateDoctor);
router.get("/doctor/:id/availability", getDoctorAvailability);
router.post("/doctor/:id/availability", addDoctorAvailability);

module.exports = router;
