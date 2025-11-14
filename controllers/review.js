// controllers/review.js
const Listing = require("../models/listing");
const Review = require("../models/review");

// ===========================
// CREATE Review
// ===========================
module.exports.createReview = async (req, res) => {
  const listing = await Listing.findById(req.params.id);

  const newReview = new Review(req.body.review);
  newReview.owner = req.user._id; // ✅ Assign logged-in user as review owner
  await newReview.save();

  listing.reviews.push(newReview);
  await listing.save();

  req.flash("success", "Review added successfully!");
  res.redirect(`/listings/${listing._id}`);
};

// ===========================
// DELETE Review
// ===========================
module.exports.deleteReview = async (req, res) => {
  const { id, reviewId } = req.params;

  // Remove review reference from listing
  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });

  // Delete actual review
  await Review.findByIdAndDelete(reviewId);

  req.flash("success", "Review deleted successfully!");
  res.redirect(`/listings/${id}`);
};
