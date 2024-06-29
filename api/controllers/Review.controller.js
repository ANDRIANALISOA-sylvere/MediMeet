const Review = require("../models/Review.model");

const addReview = async (req, res) => {
  const { doctorId, patientId, rating, comment } = req.body;

  try {
    const review = new Review({
      doctorId,
      patientId,
      rating,
      comment,
    });

    await review.save();

    res.status(201).json({ review });
  } catch (error) {
    console.error(error);
    res.status(500).json("Error adding review");
  }
};

const getReviews = async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate("doctorId", "specialty experience")
      .populate("patientId", "personalInfo");

    res.status(200).json({ reviews });
  } catch (error) {
    console.error(error);
    res.status(500).json("Error fetching reviews");
  }
};

const getReviewById = async (req, res) => {
  const { id } = req.params;

  try {
    const review = await Review.findById(id)
      .populate("doctorId", "specialty experience")
      .populate("patientId", "personalInfo");

    if (!review) {
      return res.status(404).json("Review not found");
    }

    res.status(200).json({ review });
  } catch (error) {
    console.error(error);
    res.status(500).json("Error fetching review");
  }
};

const updateReview = async (req, res) => {
  const { id } = req.params;
  const { rating, comment } = req.body;

  try {
    const review = await Review.findByIdAndUpdate(
      id,
      { rating, comment },
      { new: true }
    );

    if (!review) {
      return res.status(404).json("Review not found");
    }

    res.status(200).json({ review });
  } catch (error) {
    console.error(error);
    res.status(500).json("Error updating review");
  }
};

const deleteReview = async (req, res) => {
  const { id } = req.params;

  try {
    const review = await Review.findByIdAndDelete(id);

    if (!review) {
      return res.status(404).json("Review not found");
    }

    res.status(200).json({ message: "Review deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json("Error deleting review");
  }
};

module.exports = {
  addReview,
  getReviews,
  getReviewById,
  updateReview,
  deleteReview,
};
