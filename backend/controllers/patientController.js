const Patient = require('../models/Patient');

// @desc Register a new patient
// @route POST /api/patients
exports.createPatient = async (req, res) => {
  try {
    const patient = await Patient.create(req.body);
    res.status(201).json(patient);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get all patients (with optional search by name)
// @route GET /api/patients?search=
exports.getPatients = async (req, res) => {
  try {
    const search = req.query.search;
    const filter = search
      ? { fullName: { $regex: search, $options: 'i' } }
      : {};

    const patients = await Patient.find(filter).sort({ registeredAt: -1 });
    res.json(patients);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get single patient by ID
// @route GET /api/patients/:id
exports.getPatientById = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    res.json(patient);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Update patient
// @route PUT /api/patients/:id
exports.updatePatient = async (req, res) => {
  try {
    const patient = await Patient.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
      returnDocument: 'after'
    });
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    res.json(patient);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Delete patient
// @route DELETE /api/patients/:id
exports.deletePatient = async (req, res) => {
  try {
    const patient = await Patient.findByIdAndDelete(req.params.id);
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    res.json({ message: 'Patient removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};