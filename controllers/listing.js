const Listing = require("../models/listing");
const { cloudinary } = require("../cloudConfig");
const axios = require("axios");

// ==============================
// SHOW ALL LISTINGS (with Search)
// ==============================
module.exports.index = async (req, res) => {
  const { search } = req.query;

  let query = {};

  if (search && search.trim() !== "") {
    query = {
      $or: [
        { title: new RegExp(search, "i") },
        { location: new RegExp(search, "i") },
        { country: new RegExp(search, "i") },
      ],
    };
  }

  const listings = await Listing.find(query);

  res.render("listings/index", { listings, search });
};

// ==============================
// RENDER NEW FORM
// ==============================
module.exports.renderNewForm = (req, res) => {
  res.render("listings/new");
};

// ==============================
// CREATE NEW LISTING (with MapTiler geocoding)
// ==============================
module.exports.createListing = async (req, res) => {
  const listing = new Listing(req.body.listing);
  listing.owner = req.user._id;

  try {
    const locationQuery = `${req.body.listing.location}, ${req.body.listing.country}`;

    const geoRes = await axios.get(
      `https://api.maptiler.com/geocoding/${encodeURIComponent(locationQuery)}.json?key=${process.env.MAPTILER_KEY}`
    );

    if (geoRes.data.features && geoRes.data.features.length > 0) {
      listing.geometry = {
        type: "Point",
        coordinates: geoRes.data.features[0].geometry.coordinates,
      };
    } else {
      // fallback coordinates
      listing.geometry = { type: "Point", coordinates: [0, 0] };
    }
  } catch (err) {
    console.error("Geocoding error:", err.message);
    listing.geometry = { type: "Point", coordinates: [0, 0] };
  }

  // Image upload (Cloudinary + Multer)
  if (req.file) {
    listing.image = {
      url: req.file.path,
      filename: req.file.filename,
    };
  }

  await listing.save();
  req.flash("success", "New listing created successfully!");
  res.redirect(`/listings/${listing._id}`);
};

// ==============================
// SHOW SINGLE LISTING
// ==============================
module.exports.showListing = async (req, res) => {
  const { id } = req.params;

  const listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: { path: "owner" },
    })
    .populate("owner");

  if (!listing) {
    req.flash("error", "Listing not found!");
    return res.redirect("/listings");
  }

  res.render("listings/show", { listing });
};

// ==============================
// RENDER EDIT FORM
// ==============================
module.exports.renderEditForm = async (req, res) => {
  const { id } = req.params;

  const listing = await Listing.findById(id);

  if (!listing) {
    req.flash("error", "Listing not found!");
    return res.redirect("/listings");
  }

  res.render("listings/edit", { listing });
};

// ==============================
// UPDATE LISTING
// ==============================
module.exports.updateListing = async (req, res) => {
  const { id } = req.params;

  const listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

  if (req.file) {
    // remove old image
    if (listing.image && listing.image.filename) {
      await cloudinary.uploader.destroy(listing.image.filename);
    }

    listing.image = {
      url: req.file.path,
      filename: req.file.filename,
    };
  }

  await listing.save();

  req.flash("success", "Listing updated successfully!");
  res.redirect(`/listings/${listing._id}`);
};

// ==============================
// DELETE LISTING
// ==============================
module.exports.deleteListing = async (req, res) => {
  const { id } = req.params;

  const listing = await Listing.findById(id);

  if (!listing) {
    req.flash("error", "Listing not found!");
    return res.redirect("/listings");
  }

  if (listing.image && listing.image.filename) {
    await cloudinary.uploader.destroy(listing.image.filename);
  }

  await Listing.findByIdAndDelete(id);

  req.flash("success", "Listing deleted successfully!");
  res.redirect("/listings");
};

