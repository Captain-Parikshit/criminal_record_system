const express = require("express");
const router = express.Router();
const Wanted = require("../models/Wanted");
const multer = require("multer");
const path = require("path");
const Sighting = require("../models/Sighting");

// Create uploads folder if not exists
const fs = require("fs");
const uploadDir = "uploads";
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

// Multer storage setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});

const upload = multer({ storage });

// Add wanted person route
router.post("/add", upload.single("image"), async (req, res) => {
  try {
    const { name, crime, last_seen } = req.body;
    const image = req.file ? req.file.path : null; // save path to DB

    const newWanted = new Wanted({ name, crime, last_seen, image });
    await newWanted.save();

    res.status(201).json({ message: "Wanted person added successfully!" });
  } catch (err) {
    console.error("Error adding wanted person:", err);
    res.status(500).json({ message: "Failed to add wanted person." });
  }
});
// Get all wanted persons
router.get("/all", async (req, res) => {
  try {
    const wanted = await Wanted.find();
    res.json(wanted);
  } catch (err) {
    console.error("Error fetching wanted persons:", err);
    res.status(500).json({ message: "Failed to fetch wanted persons." });
  }
});
router.get("/active", async (req, res) => {
  try {
    const activeWanted = await Wanted.find({ status: "Active" });
    res.json(activeWanted);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// Get only active (unresolved) wanted persons
router.get("/active", async (req, res) => {
  try {
    const activeWanted = await Wanted.find({ resolved: false });
    res.json(activeWanted);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch active wanted list" });
  }
});
// In wantedRoutes.js
router.get("/active", async (req, res) => {
  const activeWanted = await Wanted.find({ resolved: { $ne: true } });
  res.json(activeWanted);
});

// ✅ Mark wanted person as resolved / remove from list
router.delete("/resolve/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Delete the wanted person
    await Wanted.findByIdAndDelete(id);

    // Also delete all sightings linked to that wanted person
    await Sighting.deleteMany({ wanted_id: id });

    res.json({ success: true, message: "Wanted person resolved and related sightings deleted." });
  } catch (err) {
    console.error("Error resolving wanted person:", err);
    res.status(500).json({ error: "Failed to resolve wanted person" });
  }
});
router.put("/resolve/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Mark wanted as resolved
    const wanted = await Wanted.findByIdAndUpdate(id, { resolved: true }, { new: true });
    if (!wanted) return res.status(404).json({ message: "Wanted person not found" });

    // Delete all sightings related to that criminal
    await Sighting.deleteMany({ wanted_id: id });

    res.json({ message: "Criminal resolved and all sightings removed", wanted });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error resolving wanted person" });
  }
});


module.exports = router;
