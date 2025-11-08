const mongoose = require('mongoose');

const violationSchema = new mongoose.Schema({
  vehicle_no: { type: String, required: true },
  violation_type: { type: String, required: true },
  fine_amount: { type: Number, required: true },
  status: { type: String, default: 'Unpaid' },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Violation', violationSchema);
