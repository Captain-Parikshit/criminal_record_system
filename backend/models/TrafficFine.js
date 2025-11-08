const mongoose = require('mongoose');

const trafficFineSchema = new mongoose.Schema({
  vehicle_number: { type: String, required: true },
  owner_name: { type: String, required: true },
  violation: { type: String, required: true },
  fine_amount: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  status: { type: String, default: 'Unpaid' }
});

module.exports = mongoose.model('TrafficFine', trafficFineSchema);
