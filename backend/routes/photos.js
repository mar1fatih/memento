import express from 'express';
import { uploadPhoto, getPhotos } from '../controllers/photos.js';
import { verifyToken } from '../middlewares/auth.js';
import multer from 'multer';

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/upload', verifyToken, upload.single('photo'), uploadPhoto);
router.get('/', verifyToken, getPhotos);

export default router;
