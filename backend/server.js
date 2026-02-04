// backend/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Import routes
const civilianRoutes = require('./routes/civilianRoutes');
const policeRoutes = require('./routes/policeRoutes');
const crimeRoutes = require('./routes/crimeRoutes');
const trafficRoutes = require('./routes/trafficRoutes');
const wantedRoutes = require('./routes/wantedRoutes');
const newsRoutes = require('./routes/newsRoutes');
const Crime = require("./models/Crime");
const sightingRoutes = require("./routes/sightingRoutes");
const authRoutes = require("./routes/authRoutes");





const app = express();
app.use(cors());
app.use(express.json());

// Use routes
app.use("/api/traffic", trafficRoutes);
app.use("/api/civilian", civilianRoutes);
app.use("/api/police", policeRoutes);
app.use("/api/crime", crimeRoutes);
app.use("/api/news", newsRoutes);
app.use("/api/wanted", wantedRoutes);
app.use('/uploads', express.static('uploads'));
app.use("/api/sightings", sightingRoutes);
app.use('/api/sighting', require('./routes/sightingRoutes'));
app.use('/api/wanted', require('./routes/wantedRoutes'));
app.use("/api", authRoutes);
//Post routes
app.post("/api/crime/report", async (req, res) => {
  try {
    const { type, location, description, severity } = req.body;
    const newCrime = new Crime({ type, location, description, severity });
    await newCrime.save();
    res.status(201).json({ message: "Crime reported successfully!" });
  } catch (err) {
    res.status(500).json({ error: "Error saving crime" });
  }
});

//Put poutes
// ✅ Mark a crime as resolved
app.put("/api/crime/resolve/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const crime = await Crime.findByIdAndUpdate(
      id,
      { resolved: true },
      { new: true }
    );
    if (!crime) {
      return res.status(404).json({ message: "Crime not found" });
    }
    res.json({ message: "Crime marked as resolved", crime });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error resolving crime" });
  }
});

// MongoDB connection
mongoose.connect('mongodb://127.0.0.1:27017/criminalDB')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('Mongo Error:', err));

// Server start
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
