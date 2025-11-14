// routes/review.js
const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync");
const { isLoggedIn } = require("../middleware");
const reviewController = require("../controllers/review.js");

// ===========================
// CREATE + DELETE Review
// ===========================
router
  .route("/")
  .post(isLoggedIn, wrapAsync(reviewController.createReview)); // POST /listings/:id/reviews → add review

router
  .route("/:reviewId")
  .delete(isLoggedIn, wrapAsync(reviewController.deleteReview)); // DELETE /listings/:id/reviews/:reviewId → delete review

module.exports = router;
