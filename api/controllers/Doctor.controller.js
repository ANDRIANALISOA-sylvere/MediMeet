const Doctor = require("../models/Doctor.model");
const ReviewModel = require("../models/Review.model");

const addDoctor = async (req, res) => {
  const { _id, specialty, experience, price, availability } = req.body;

  try {
    const doctor = new Doctor({
      _id,
      specialty,
      experience,
      price,
      availability,
    });

    await doctor.save();

    const populatedDoctor = await Doctor.findById(doctor._id).populate(
      "_id",
      "name email role phone"
    );

    res.status(201).json({ doctor: populatedDoctor });
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

const getPopularDoctors = async (req, res) => {
  try {
    const popularDoctors = await ReviewModel.aggregate([
      {
        $group: {
          _id: "$doctorId",
          averageRating: { $avg: "$rating" },
          reviewCount: { $sum: 1 },
        },
      },
      { $sort: { averageRating: -1, reviewCount: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "doctors",
          localField: "_id",
          foreignField: "_id",
          as: "doctorInfo",
        },
      },
      { $unwind: "$doctorInfo" },
      {
        $lookup: {
          from: "users",
          localField: "doctorInfo._id",
          foreignField: "_id",
          as: "userInfo",
        },
      },
      { $unwind: "$userInfo" },
      {
        $project: {
          _id: "$doctorInfo._id",
          name: "$userInfo.name",
          specialty: "$doctorInfo.specialty",
          experience: "$doctorInfo.experience",
          price: "$doctorInfo.price",
          averageRating: 1,
          reviewCount: 1,
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: popularDoctors,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération des médecins populaires",
      error: error.message,
    });
  }
};

module.exports = {
  addDoctor,
  getDoctors,
  getDoctorById,
  updateDoctor,
  getDoctorAvailability,
  addDoctorAvailability,
  getPopularDoctors,
};
