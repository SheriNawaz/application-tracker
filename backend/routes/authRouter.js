const { Router } = require('express');
const router = Router();
const { loginUser, registerUser, getCurrentUser, getUserById, logoutUser } = require("../controllers/authController");
const { protect } = require('../middleware/authMiddleware');

router.post('/login', loginUser);
router.post('/register', registerUser);
router.get('/me', protect, getCurrentUser);
router.get('/user/:id', getUserById);
router.post('/logout', logoutUser);

module.exports = router;