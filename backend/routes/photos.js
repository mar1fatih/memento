import express from 'express';
import { uploadPhoto, getPhotos, deletePhoto, uploadProfilePicture } from '../controllers/photos.js';
import { verifyToken } from '../middlewares/auth.js';
import multer from 'multer';

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/upload', verifyToken, upload.single('photo'), uploadPhoto);
router.get('/', verifyToken, getPhotos);
router.delete('/:id', verifyToken, deletePhoto);
router.post('/profile-picture', verifyToken, upload.single('profilePicture'), uploadProfilePicture);

export default router;
