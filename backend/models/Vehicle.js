const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
  number: { type: String, required: true, unique: true },
  owner_name: { type: String, required: true },
  contact: { type: String },
  address: { type: String }
});

module.exports = mongoose.model('Vehicle', vehicleSchema);
