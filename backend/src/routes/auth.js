import express from 'express';
import { register, login, getProfile, updateProfile } from '../controllers/auth.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Register a new user
router.post('/register', register);

// Login user
router.post('/login', login);

// Get user profile (protected route)
router.get('/profile', protect, getProfile);

// Update user profile (protected route)
router.put('/profile', protect, updateProfile);

export default router;