const MedicalRecord = require("../models/MedicalRecord.model");

const addMedicalRecord = async (req, res) => {
  const { patientId, doctorId, records } = req.body;

  try {
    const medicalRecord = new MedicalRecord({
      patientId,
      doctorId,
      records,
    });

    await medicalRecord.save();

    res.status(201).json({ medicalRecord });
  } catch (error) {
    console.error(error);
    res.status(500).json("Error adding medical record");
  }
};

const getMedicalRecords = async (req, res) => {
  try {
    const medicalRecords = await MedicalRecord.find()
      .populate("patientId", "personalInfo")
      .populate("doctorId", "specialty experience");

    res.status(200).json({ medicalRecords });
  } catch (error) {
    console.error(error);
    res.status(500).json("Error fetching medical records");
  }
};

const getMedicalRecordById = async (req, res) => {
  const { id } = req.params;

  try {
    const medicalRecord = await MedicalRecord.findById(id)
      .populate("patientId", "personalInfo")
      .populate("doctorId", "specialty experience");

    if (!medicalRecord) {
      return res.status(404).json("Medical record not found");
    }

    res.status(200).json({ medicalRecord });
  } catch (error) {
    console.error(error);
    res.status(500).json("Error fetching medical record");
  }
};

const updateMedicalRecord = async (req, res) => {
  const { id } = req.params;
  const { records } = req.body;

  try {
    const medicalRecord = await MedicalRecord.findByIdAndUpdate(
      id,
      { records },
      { new: true }
    );

    if (!medicalRecord) {
      return res.status(404).json("Medical record not found");
    }

    res.status(200).json({ medicalRecord });
  } catch (error) {
    console.error(error);
    res.status(500).json("Error updating medical record");
  }
};

const deleteMedicalRecord = async (req, res) => {
  const { id } = req.params;

  try {
    const medicalRecord = await MedicalRecord.findByIdAndDelete(id);

    if (!medicalRecord) {
      return res.status(404).json("Medical record not found");
    }

    res.status(200).json({ message: "Medical record deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json("Error deleting medical record");
  }
};

module.exports = {
  addMedicalRecord,
  getMedicalRecords,
  getMedicalRecordById,
  updateMedicalRecord,
  deleteMedicalRecord,
};
