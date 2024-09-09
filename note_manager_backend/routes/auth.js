const express = require('express');
const router = express.Router();
const { signIn, login, getUserInformation, signOut, refreshToken } = require('../controllers/authController');
const authenticateToken = require('../middleware/authMiddleware');

router.post('/sign-in', signIn);
router.post('/login', login);
router.get('/user-information', authenticateToken, getUserInformation);
router.put('/sign-out', signOut);
router.put('/refresh-token', refreshToken);

module.exports = router;
