import express from 'express';
import { imageController } from '../controller/imageController.js';
import multer from 'multer';

// Set up Multer
const upload = multer({ dest: 'uploads/' }); // Files will be uploaded to the 'uploads' directory

const router = express.Router();

// Route to upload a new image
router.post('/upload-image', upload.single('image'), imageController.uploadImage);

// Route to get all images
router.get('/get-images', imageController.getImages);

// Route to update an existing image
router.put('/update-image', upload.single('image'), imageController.updateImage);

export default router;
