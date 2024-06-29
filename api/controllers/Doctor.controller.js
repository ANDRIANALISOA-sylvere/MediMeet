const Doctor = require("../models/Doctor.model");

const addDoctor = async (req, res) => {
  const { _id, specialty, experience, availability } = req.body;

  try {
    const doctor = new Doctor({
      _id,
      specialty,
      experience,
      availability,
    });

    await doctor.save();

    res.status(201).json({ doctor });
  } catch (error) {
    console.error(error);
    res.status(500).json("Error adding doctor");
  }
};

const getDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find().populate("_id");

    res.status(200).json({ doctors });
  } catch (error) {
    console.error(error);
    res.status(500).json("Error fetching doctors");
  }
};

const getDoctorById = async (req, res) => {
  const { id } = req.params;

  try {
    const doctor = await Doctor.findById(id).populate("_id");

    if (!doctor) {
      return res.status(404).json("Doctor not found");
    }

    res.status(200).json({ doctor });
  } catch (error) {
    console.error(error);
    res.status(500).json("Error fetching doctor");
  }
};

const updateDoctor = async (req, res) => {
  const { id } = req.params;
  const { specialty, experience, availability } = req.body;

  try {
    const doctor = await Doctor.findByIdAndUpdate(
      id,
      { specialty, experience, availability },
      { new: true }
    );

    if (!doctor) {
      return res.status(404).json("Doctor not found");
    }

    res.status(200).json({ doctor });
  } catch (error) {
    console.error(error);
    res.status(500).json("Error updating doctor");
  }
};

const getDoctorAvailability = async (req, res) => {
  const { id } = req.params;

  try {
    const doctor = await Doctor.findById(id).select("availability");

    if (!doctor) {
      return res.status(404).json("Doctor not found");
    }

    res.status(200).json({ availability: doctor.availability });
  } catch (error) {
    console.error(error);
    res.status(500).json("Error fetching doctor availability");
  }
};

const addDoctorAvailability = async (req, res) => {
  const { id } = req.params;
  const { day, startTime, endTime, location } = req.body;

  try {
    const doctor = await Doctor.findById(id);

    if (!doctor) {
      return res.status(404).json("Doctor not found");
    }

    doctor.availability.push({ day, startTime, endTime, location });
    await doctor.save();

    res.status(200).json({ availability: doctor.availability });
  } catch (error) {
    console.error(error);
    res.status(500).json("Error adding doctor availability");
  }
};

module.exports = {
  addDoctor,
  getDoctors,
  getDoctorById,
  updateDoctor,
  getDoctorAvailability,
  addDoctorAvailability,
};
