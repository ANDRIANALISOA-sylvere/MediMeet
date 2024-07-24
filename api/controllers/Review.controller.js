const Review = require("../models/Review.model");

const addReview = async (req, res) => {
  const { doctorId, patientId, rating, comment } = req.body;

  try {
    let review = new Review({
      doctorId,
      patientId,
      rating,
      comment,
    });

    review = await review.save();

    review = await Review.findById(review._id)
      .populate("doctorId")
      .populate({
        path: "patientId",
        populate: {
          path: "_id",
          model: "User",
          select: "name",
        },
      })
      .exec();

    const restructuredReview = {
      ...review.toObject(),
      patientId: {
        _id: review.patientId._id._id,
        name: review.patientId._id.name,
        ...review.patientId.toObject(),
      },
    };

    delete restructuredReview.patientId._id;

    res.status(201).json({ success: true, data: restructuredReview });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error adding review",
      error: error.message,
    });
  }
};

const getReviews = async (req, res) => {
  try {
    const { doctorId } = req.query;
    let query = {};

    if (doctorId) {
      query.doctorId = doctorId;
    }

    let reviews = await Review.find(query)
      .populate("doctorId")
      .populate({
        path: "patientId",
        model: "User",
        select: "name",
      })
      .lean();

    reviews = reviews.map((review) => {
      if (review.patientId) {
        return {
          ...review,
          patientId: {
            _id: review.patientId._id,
            name: review.patientId.name,
          },
        };
      }
      return review;
    });

    res.status(200).json({ success: true, data: reviews });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error fetching reviews",
      error: error.message,
    });
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
  updateReview,
  deleteReview,
  getReviewById
};
