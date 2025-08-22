import express from 'express';
import {
  register,
  login,
  logout,
  getMe,
  updateProfile
} from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import { validateRegistration, validateLogin } from '../middleware/validation.js';

const router = express.Router();

// Public routes
router.post('/register', validateRegistration, register);
router.post('/login', validateLogin, login);

// Protected routes
router.use(protect); // All routes after this middleware are protected

router.get('/me', getMe);
router.post('/logout', logout);
router.put('/profile', updateProfile);

export default router;
