const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const { isLoggedIn, isOwner } = require("../middleware");
const listingController = require("../controllers/listing"); // ✅ or ../controllers/listings
const { storage } = require("../cloudConfig");
const multer = require("multer");
const upload = multer({ storage });

// INDEX + CREATE
router
  .route("/")
  .get(wrapAsync(listingController.index))
  .post(isLoggedIn, upload.single("image"), wrapAsync(listingController.createListing));

// NEW (form)
router.get("/new", isLoggedIn, listingController.renderNewForm); // ✅ Must exist

// SHOW + UPDATE + DELETE
router
  .route("/:id")
  .get(wrapAsync(listingController.showListing))
  .put(isLoggedIn, isOwner, upload.single("image"), wrapAsync(listingController.updateListing))
  .delete(isLoggedIn, isOwner, wrapAsync(listingController.deleteListing));

// EDIT (form)
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));

module.exports = router;
