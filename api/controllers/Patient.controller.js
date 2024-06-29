const Patient = require("../models/Patient.model");

const addPatient = async (req, res) => {
  const { _id, personalInfo, dateOfBirth, gender, address, medicalHistory } = req.body;

  try {
    const patient = new Patient({
      _id,
      personalInfo,
      dateOfBirth,
      gender,
      address,
      medicalHistory,
    });

    await patient.save();

    res.status(201).json({ patient });
  } catch (error) {
    console.error(error);
    res.status(500).json("Error adding patient");
  }
};

const getPatients = async (req, res) => {
  try {
    const patients = await Patient.find().populate('_id');

    res.status(200).json({ patients });
  } catch (error) {
    console.error(error);
    res.status(500).json("Error fetching patients");
  }
};

const getPatientById = async (req, res) => {
  const { id } = req.params;

  try {
    const patient = await Patient.findById(id).populate('_id');

    if (!patient) {
      return res.status(404).json("Patient not found");
    }

    res.status(200).json({ patient });
  } catch (error) {
    console.error(error);
    res.status(500).json("Error fetching patient");
  }
};

const updatePatient = async (req, res) => {
  const { id } = req.params;
  const { personalInfo, dateOfBirth, gender, address, medicalHistory } = req.body;

  try {
    const patient = await Patient.findByIdAndUpdate(
      id,
      { personalInfo, dateOfBirth, gender, address, medicalHistory },
      { new: true }
    );

    if (!patient) {
      return res.status(404).json("Patient not found");
    }

    res.status(200).json({ patient });
  } catch (error) {
    console.error(error);
    res.status(500).json("Error updating patient");
  }
};

const deletePatient = async (req, res) => {
  const { id } = req.params;

  try {
    const patient = await Patient.findByIdAndDelete(id);

    if (!patient) {
      return res.status(404).json("Patient not found");
    }

    res.status(200).json({ message: "Patient deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json("Error deleting patient");
  }
};

const addMedicalHistory = async (req, res) => {
  const { id } = req.params;
  const { condition, diagnosisDate, notes } = req.body;

  try {
    const patient = await Patient.findById(id);

    if (!patient) {
      return res.status(404).json("Patient not found");
    }

    patient.medicalHistory.push({ condition, diagnosisDate, notes });
    await patient.save();

    res.status(200).json({ medicalHistory: patient.medicalHistory });
  } catch (error) {
    console.error(error);
    res.status(500).json("Error adding medical history");
  }
};

const getMedicalHistory = async (req, res) => {
  const { id } = req.params;

  try {
    const patient = await Patient.findById(id).select('medicalHistory');

    if (!patient) {
      return res.status(404).json("Patient not found");
    }

    res.status(200).json({ medicalHistory: patient.medicalHistory });
  } catch (error) {
    console.error(error);
    res.status(500).json("Error fetching medical history");
  }
};

module.exports = {
  addPatient,
  getPatients,
  getPatientById,
  updatePatient,
  deletePatient,
  addMedicalHistory,
  getMedicalHistory
};
