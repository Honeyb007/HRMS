const mongoose = require('mongoose');

const medicalRecordSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },
  visitDate: {
    type: Date,
    default: Date.now
  },
  diagnosis: {
    type: String,
    required: true
  },
  symptoms: {
    type: String
  },
  treatment: {
    type: String
  },
  prescription: {
    type: String
  },
  recordedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: { createdAt: 'createdAt', updatedAt: false } });

module.exports = mongoose.model('MedicalRecord', medicalRecordSchema);