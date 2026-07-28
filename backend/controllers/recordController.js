const MedicalRecord = require('../models/MedicalRecord');

// @desc Create a medical record for a patient
// @route POST /api/records
exports.createRecord = async (req, res) => {
  try {
    const record = await MedicalRecord.create({
      ...req.body,
      recordedBy: req.user._id
    });
    res.status(201).json(record);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get all records for a specific patient
// @route GET /api/records/patient/:patientId
exports.getRecordsByPatient = async (req, res) => {
  try {
    const records = await MedicalRecord.find({ patientId: req.params.patientId })
      .populate('recordedBy', 'fullName role')
      .sort({ visitDate: -1 });
    res.json(records);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get single record by ID
// @route GET /api/records/:id
exports.getRecordById = async (req, res) => {
  try {
    const record = await MedicalRecord.findById(req.params.id)
      .populate('patientId', 'fullName gender dateOfBirth')
      .populate('recordedBy', 'fullName role');
    if (!record) {
      return res.status(404).json({ message: 'Record not found' });
    }
    res.json(record);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Update a medical record
// @route PUT /api/records/:id
exports.updateRecord = async (req, res) => {
  try {
    const record = await MedicalRecord.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
      returnDocument: 'after'
    });
    if (!record) {
      return res.status(404).json({ message: 'Record not found' });
    }
    res.json(record);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Delete a medical record
// @route DELETE /api/records/:id
exports.deleteRecord = async (req, res) => {
  try {
    const record = await MedicalRecord.findByIdAndDelete(req.params.id);
    if (!record) {
      return res.status(404).json({ message: 'Record not found' });
    }
    res.json({ message: 'Record removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};