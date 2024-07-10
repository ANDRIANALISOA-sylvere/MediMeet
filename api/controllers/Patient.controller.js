const Patient = require("../models/Patient.model");

const addPatient = async (req, res) => {
  const { _id, dateOfBirth, gender, address } = req.body;

  try {
    const patient = new Patient({
      _id,
      dateOfBirth,
      gender,
      address,
    });

    await patient.save();

    const populatedPatient = await Patient.findById(patient._id).populate(
      "_id",
      "name email role phone"
    );

    res.status(201).json({ patient : populatedPatient });
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
  const { dateOfBirth, gender, address } = req.body;

  try {
    const patient = await Patient.findByIdAndUpdate(
      id,
      { dateOfBirth, gender, address },
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


module.exports = {
  addPatient,
  getPatients,
  getPatientById,
  updatePatient,
  deletePatient,
};
