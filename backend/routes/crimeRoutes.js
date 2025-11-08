const express = require("express");
const router = express.Router();
const Crime = require("../models/Crime");

// Report a new crime
router.post("/report", async (req, res) => {
  try {
    const { location, type, severity, description, reported_by, lat, lon } = req.body;
    const crime = new Crime({ location, type, severity, description, reported_by, lat, lon });
    await crime.save();
    res.json({ message: "Crime reported successfully!" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all crimes
// GET /api/crime/all
router.get("/all", async (req, res) => {
  try {
    const crimes = await Crime.find({ resolved: false }); // only unresolved
    res.json(crimes);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});


module.exports = router;
