const mongoose = require("mongoose");

const wantedSchema = new mongoose.Schema({
  name: { type: String, required: true },
  crime: { type: String, required: true },
  last_seen: { type: String, required: true },
  image: { type: String }, // This is needed to store the image path
  status: { type: String, default: "Active" } // values: "Active" or "Resolved"

});

module.exports = mongoose.model("Wanted", wantedSchema);
