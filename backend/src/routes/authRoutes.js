const express = require('express');
const router = express.Router();
const { register, login, getProfile, registerSchema, loginSchema } = require('../controllers/authController');
const { authMiddleware, validateBody } = require('../middleware/authMiddleware');

router.post('/register', validateBody(registerSchema), register);
router.post('/login', validateBody(loginSchema), login);
router.get('/profile', authMiddleware, getProfile);

module.exports = router;
