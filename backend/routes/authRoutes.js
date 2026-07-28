const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUsers, changePassword } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.post('/login', loginUser);
router.post('/register', protect, authorize('Admin'), registerUser);
router.get('/users', protect, authorize('Admin'), getUsers);
router.put('/change-password', protect, changePassword);

module.exports = router;