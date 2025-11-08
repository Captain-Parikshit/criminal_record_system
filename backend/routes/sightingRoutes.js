const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const Sighting = require("../models/Sighting");

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

// POST — add a new sighting
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { wanted_id, civilian_name, location, note } = req.body;

    if (!wanted_id || !civilian_name || !location) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const newSighting = new Sighting({
      wanted_id,
      civilian_name,
      location,
      note,
      image: req.file ? req.file.filename : null,
    });

    await newSighting.save();
    res.json({ success: true, message: "Sighting submitted successfully!" });
  } catch (err) {
    console.error("Error saving sighting:", err);
    res.status(500).json({ error: "Failed to save sighting" });
  }
});

// GET — list all sightings
router.get("/", async (req, res) => {
  try {
    const sightings = await Sighting.find().populate("wanted_id", "name image");
    res.json(sightings);
  } catch (err) {
    console.error("Error fetching sightings:", err);
    res.status(500).json({ error: "Failed to fetch sightings" });
  }
});


module.exports = router;
