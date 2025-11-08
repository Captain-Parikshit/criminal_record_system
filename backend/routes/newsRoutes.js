// routes/newsRoutes.js
const express = require("express");
const router = express.Router();
const News = require("../models/News");

// Get all news
router.get("/all", async (req, res) => {
  try {
    const news = await News.find().sort({ createdAt: -1 });
    res.json(news);
  } catch (err) {
    res.status(500).json({ message: "Error fetching news" });
  }
});

// Add news
router.post("/add", async (req, res) => {
  try {
    const { title, content, author } = req.body;
    if (!title || !content || !author) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newNews = new News({ title, content, author });
    await newNews.save();
    res.status(201).json({ message: "News added successfully", news: newNews });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to add news" });
  }
});

// Update news
router.put("/update/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await News.findByIdAndUpdate(id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Error updating news" });
  }
});

// Delete news
router.delete("/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await News.findByIdAndDelete(id);
    res.json({ message: "News deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting news" });
  }
});

module.exports = router;
