import express from 'express';
import { registerUser, loginUser, logoutUser, checkUser } from '../controllers/auth.controllers.js';
import authMiddleware from '../middleware/auth.middleware.js';


const router = express.Router();

router.post("/register", registerUser) // Register a new user

router.post("/login", loginUser) // Login a user

router.post("/logout", authMiddleware, logoutUser) // Logout a user

router.post("/check", authMiddleware, checkUser) // Check the access token



export default router;