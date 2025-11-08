const mongoose = require("mongoose");

const crimeSchema = new mongoose.Schema({
  location: String,
  type: String,
  severity: Number,
  description: String,
  reported_by: String,
  date: { type: Date, default: Date.now },
  lat: Number,
  lon: Number,
  resolved: { type: Boolean, default: false },
});

module.exports = mongoose.model("Crime", crimeSchema);
