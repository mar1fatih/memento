// User routes
// export user informations first name, last name, email, profile picture
import express from 'express';
import { getUserInfo, updateUserInfo, deleteUser } from '../controllers/user.js';
import { verifyToken } from '../middlewares/auth.js';

const router = express.Router();

router.get('/user', verifyToken, getUserInfo);
router.put('/user', verifyToken, updateUserInfo);
router.delete('/user', verifyToken, deleteUser);

export default router;