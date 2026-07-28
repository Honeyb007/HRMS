const express = require('express');
const router = express.Router();
const {
  createRecord,
  getRecordsByPatient,
  getRecordById,
  updateRecord,
  deleteRecord
} = require('../controllers/recordController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.route('/')
  .post(createRecord);

router.get('/patient/:patientId', getRecordsByPatient);

router.route('/:id')
  .get(getRecordById)
  .put(updateRecord)
  .delete(deleteRecord);

module.exports = router;