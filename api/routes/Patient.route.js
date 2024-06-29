const express = require("express");
const {
  addPatient,
  getPatients,
  getPatientById,
  updatePatient,
  deletePatient,
  addMedicalHistory,
  getMedicalHistory
} = require("../controllers/Patient.controller");
const router = express.Router();

router.post("/patient", addPatient);
router.get("/patients", getPatients);
router.get("/patient/:id", getPatientById);
router.put("/patient/:id", updatePatient);
router.delete("/patient/:id", deletePatient);
router.post("/patient/:id/medical-history", addMedicalHistory);
router.get("/patient/:id/medical-history", getMedicalHistory);

module.exports = router;
