const express = require('express');
const { register, login, getMe, logout, googleLogin } = require('../controllers/authController');

const router = express.Router();

const { protect } = require('../middleware/authMiddleware');

router.post('/register', register);
router.post('/login', login);
router.post('/google', googleLogin);
router.get('/me', protect, getMe);
router.get('/logout', logout);

module.exports = router;
