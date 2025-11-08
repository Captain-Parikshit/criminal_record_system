const mongoose = require("mongoose");

const policeSchema = new mongoose.Schema({
  police_id: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String },
});

module.exports = mongoose.model("Police", policeSchema);
