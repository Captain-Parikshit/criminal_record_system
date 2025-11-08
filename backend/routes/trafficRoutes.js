// backend/routes/trafficRoutes.js
const express = require("express");
const router = express.Router();
const Traffic = require("../models/Traffic");

// 📌 Add a new traffic fine
// Example: routes/trafficRoutes.js
router.post("/add", async (req, res) => {
  try {
    const { vehicleNumber, offense, fineAmount } = req.body;

    // Validate required fields
    if (!vehicleNumber || !offense || !fineAmount) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const newTraffic = new Traffic({
      vehicleNumber,
      offense,
      fineAmount: Number(fineAmount),
    });

    await newTraffic.save();
    res.json({ message: "Traffic record added successfully" });
  } catch (err) {
    console.error("Traffic POST Error:", err.message);
    res.status(500).json({ error: err.message });
  }
});




// 📋 Get all traffic fines
router.get("/all", async (req, res) => {
  try {
    const fines = await Traffic.find();
    res.json(fines);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🚗 Get fines by vehicle number
router.get("/:vehicleNumber", async (req, res) => {
  try {
    const fines = await Traffic.find({ vehicleNumber: req.params.vehicleNumber });
    res.json(fines);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// detete afte getting excl file 
router.delete("/clear", async (req, res) => {
  try {
    await Traffic.deleteMany({});
    res.json({ success: true, message: "All traffic records deleted." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to clear traffic records" });
  }
});

module.exports = router;
