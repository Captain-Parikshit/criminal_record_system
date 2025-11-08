const express = require("express");
const router = express.Router();
const Police = require("../models/Police");
const Civilian = require("../models/civilian");

// POST /api/login
router.post("/login", async (req, res) => {
  const { role, id, password } = req.body;

  try {
    if (role === "civilian") {
      const user = await Civilian.findOne({ aadhar_no: id });
      if (!user || user.password !== password) {
        return res.status(401).json({ error: "Invalid Aadhaar or password" });
      }
      return res.json({ success: true, role: "civilian", user });
    }

    if (role === "police") {
      const user = await Police.findOne({ police_id: id });
      if (!user || user.password !== password) {
        return res.status(401).json({ error: "Invalid Police ID or password" });
      }
      return res.json({ success: true, role: "police", user });
    }

    res.status(400).json({ error: "Invalid role" });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/civilians", async (req, res) => {
  try {
    const { aadhar_no, password, name } = req.body;
    const civilian = new Civilian({ aadhar_no, password, name });
    await civilian.save();
    res.json({ success: true, message: "Civilian added successfully" });
  } catch (err) {
    console.error("Error adding civilian:", err);
    res.status(500).json({ error: "Failed to add civilian" });
  }
});

// TEMPORARY: Add Police manually
router.post("/police", async (req, res) => {
  try {
    const { police_id, password, name } = req.body;
    const police = new Police({ police_id, password, name });
    await police.save();
    res.json({ success: true, message: "Police added successfully" });
  } catch (err) {
    console.error("Error adding police:", err);
    res.status(500).json({ error: "Failed to add police" });
  }
});
module.exports = router;
