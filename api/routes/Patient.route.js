const express = require("express");
const {
  addPatient,
  getPatients,
  getPatientById,
  updatePatient,
  deletePatient,
} = require("../controllers/Patient.controller");
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

router.post("/patient", upload.single("avatar"), addPatient);
router.get("/patients", getPatients);
router.get("/patient/:id", getPatientById);
router.put("/patient/:id", updatePatient);
router.delete("/patient/:id", deletePatient);

module.exports = router;
