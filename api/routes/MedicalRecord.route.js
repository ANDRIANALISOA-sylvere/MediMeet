const express = require("express");
const {
  addMedicalRecord,
  getMedicalRecords,
  getMedicalRecordById,
  updateMedicalRecord,
  deleteMedicalRecord,
} = require("../controllers/MedicalRecord.model");
const router = express.Router();

router.post("/medicalrecord", addMedicalRecord);
router.get("/medicalrecords", getMedicalRecords);
router.get("/medicalrecord/:id", getMedicalRecordById);
router.put("/medicalrecord/:id", updateMedicalRecord);
router.delete("/medicalrecord/:id", deleteMedicalRecord);

module.exports = router;
