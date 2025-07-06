// User routes
// export user informations first name, last name, email, profile picture
import express from 'express';
import { getUserInfo } from '../controllers/user.js';
import { verifyToken } from '../middlewares/auth.js';

const router = express.Router();

router.get('/user', verifyToken, getUserInfo);

export default router;