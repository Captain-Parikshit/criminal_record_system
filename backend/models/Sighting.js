const mongoose = require('mongoose');

const sightingSchema = new mongoose.Schema({
  wanted_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Wanted' },
  civilian_name: { type: String, required: true },
  location: { type: String, required: true },
  note: { type: String },
  image: { type: String }, 
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Sighting', sightingSchema);
