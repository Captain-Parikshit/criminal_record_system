const mongoose = require("mongoose");

const trafficSchema = new mongoose.Schema({
  vehicleNumber: { type: String, required: true },
  fineAmount: { type: Number, required: true },
  offense: { type: String, required: true },
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Traffic", trafficSchema);
