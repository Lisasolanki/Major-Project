🌍 Travel Listings Platform

A full-stack web application where users can explore travel destinations, add their own listings, upload images, write reviews, and interact with an integrated map. Built with Node.js, Express, MongoDB, and Cloudinary.

🚀 Features
🔐 User Authentication & Authorization

Secure signup & login using Passport.js

Password hashing and session-based authentication

Only logged-in users can:

Add new listings

Write reviews

Delete their own reviews

Only listing owners can edit or delete their listings

🏡 Create & Manage Listings

Authenticated users can publish new listings with:

Title

Description

Price

Country & Location

Image Upload (Cloudinary)

Listings are validated using Joi

Listing data stored in MongoDB Atlas

🗺️ Interactive Map Integration

Each listing includes a map marker via MapTiler

Users can view the exact location of a place

Improves engagement and user experience

⭐ User Reviews

Logged-in users can add a review to any listing

Reviews include rating + text

Users can delete only their own reviews

Prevents spam through validation and permission checks

📸 Image Handling with Cloudinary

Multer + Cloudinary for seamless uploads

Secure storage of images

Images displayed responsively across the site

📃 Listings Explorer

Explore all listings in a clean grid layout

Responsive and mobile-friendly UI

Dedicated filter to show only listings with images

🎨 UI & UX

Built with EJS + Bootstrap

Flash messages for clear feedback

Intuitive navigation (Explore, Add Listing, Login, Signup)

Clean layout optimized for readability

🛠️ Tech Stack
Frontend

EJS Templates

Bootstrap

Backend

Node.js

Express

Database

MongoDB Atlas

Mongoose

Authentication

Passport.js

Passport Local Strategy

Other Tools

Cloudinary (Image Storage)

Multer (File Uploads)

Joi (Validation)

Express-Session

Connect-Mongo

MapTiler API
