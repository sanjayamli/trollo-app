// backend/routes/userRoutes.js
import express from 'express'
import { register, login, googleLogin } from '../controllers/userControllers.js';
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/google-login', googleLogin);

export default router;