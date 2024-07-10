const express = require("express");
const {
  addPatient,
  getPatients,
  getPatientById,
  updatePatient,
  deletePatient,
} = require("../controllers/Patient.controller");
const router = express.Router();

router.post("/patient", addPatient);
router.get("/patients", getPatients);
router.get("/patient/:id", getPatientById);
router.put("/patient/:id", updatePatient);
router.delete("/patient/:id", deletePatient);

module.exports = router;
