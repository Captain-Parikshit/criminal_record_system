const mongoose = require("mongoose");

const civilianSchema = new mongoose.Schema({
  aadhar_no: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String },
});

module.exports = mongoose.model("Civilian", civilianSchema);
