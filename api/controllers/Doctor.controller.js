const Doctor = require("../models/Doctor.model");
const ReviewModel = require("../models/Review.model");
const mongoose = require("mongoose");

const addDoctor = async (req, res) => {
  const { _id, specialty, experience, price, about, location } = req.body;
  let avatar = "";

  if (req.file) {
    avatar = `http://192.168.43.149:8800/${req.file.path}`;
  }

  console.log(_id, specialty, experience, price, about, location, avatar);

  try {
    let doctor = await Doctor.findById(_id);

    if (doctor) {
      doctor.specialty = specialty;
      doctor.experience = experience;
      doctor.price = price;
      doctor.about = about;
      doctor.location = location;
      if (avatar) {
        doctor.avatar = avatar;
      }

      await doctor.save();
    } else {
      doctor = new Doctor({
        _id,
        specialty,
        experience,
        price,
        about,
        location,
        avatar,
      });

      await doctor.save();
    }

    const populatedDoctor = await Doctor.findById(doctor._id).populate(
      "_id",
      "name email role phone"
    );

    res.status(200).json({ doctor: populatedDoctor });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error adding or updating doctor" });
  }
};

const getDoctors = async (req, res) => {
  try {
    const { name, specialty } = req.query;

    let query = Doctor.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "userInfo",
        },
      },
      { $unwind: "$userInfo" },
      {
        $lookup: {
          from: "reviews",
          localField: "_id",
          foreignField: "doctorId",
          as: "reviews",
        },
      },
      {
        $addFields: {
          averageRating: { $avg: "$reviews.rating" },
          reviewCount: { $size: "$reviews" },
        },
      },
    ]);

    if (name) {
      query.match({ "userInfo.name": { $regex: name, $options: "i" } });
    }

    if (specialty) {
      query.match({ specialty: specialty });
    }

    query.project({
      _id: 1,
      name: "$userInfo.name",
      specialty: 1,
      experience: 1,
      price: 1,
      about: 1,
      location: 1,
      availability: 1,
      averageRating: 1,
      reviewCount: 1,
    });

    const doctors = await query.exec();

    res.status(200).json({
      success: true,
      data: doctors,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error fetching doctors",
      error: error.message,
    });
  }
};

const getDoctorById = async (req, res) => {
  const { id } = req.params;

  try {
    const doctorWithRatings = await Doctor.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(id) } },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "userInfo",
        },
      },
      { $unwind: "$userInfo" },
      {
        $lookup: {
          from: "reviews",
          localField: "_id",
          foreignField: "doctorId",
          as: "reviews",
        },
      },
      {
        $addFields: {
          averageRating: { $avg: "$reviews.rating" },
          reviewCount: { $size: "$reviews" },
        },
      },
      {
        $project: {
          _id: 1,
          name: "$userInfo.name",
          specialty: 1,
          experience: 1,
          price: 1,
          about: 1,
          location: 1,
          availability: 1,
          averageRating: 1,
          reviewCount: 1,
        },
      },
    ]);

    if (doctorWithRatings.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Doctor not found" });
    }

    res.status(200).json({
      success: true,
      data: doctorWithRatings[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error fetching doctor",
      error: error.message,
    });
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
  const { day, startTime } = req.body;

  try {
    const doctor = await Doctor.findById(id);

    if (!doctor) {
      return res.status(404).json("Doctor not found");
    }

    doctor.availability.push({ day, startTime });
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
          about: "$doctorInfo.about",
          location: "$doctorInfo.location",
          availability: "$doctorInfo.availability",
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

const getUniqueSpecialties = async (req, res) => {
  try {
    const specialties = await Doctor.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "userInfo",
        },
      },
      { $unwind: "$userInfo" },
      {
        $group: {
          _id: "$specialty",
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          specialty: "$_id",
          count: 1,
        },
      },
      { $sort: { specialty: 1 } },
    ]);

    res.status(200).json({
      success: true,
      data: specialties,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error fetching specialties",
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
  getUniqueSpecialties,
};
