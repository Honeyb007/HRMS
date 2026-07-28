const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true
  },
  gender: {
    type: String,
    enum: ['Male', 'Female'],
    required: true
  },
  dateOfBirth: {
    type: Date,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  bloodGroup: {
    type: String
  }
}, { timestamps: { createdAt: 'registeredAt', updatedAt: false } });

module.exports = mongoose.model('Patient', patientSchema);