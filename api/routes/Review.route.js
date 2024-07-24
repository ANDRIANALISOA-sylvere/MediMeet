const express = require("express");
const {
  addReview,
  getReviews,
  getReviewById,
  updateReview,
  deleteReview,
  getReviewsByDoctor,
} = require("../controllers/Review.controller");
const router = express.Router();

router.post("/review", addReview);
router.get("/reviews", getReviews);
router.get("/review/:id", getReviewById);
router.put("/review/:id", updateReview);
router.delete("/review/:id", deleteReview);

module.exports = router;
