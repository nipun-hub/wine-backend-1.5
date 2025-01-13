import express from 'express';
import {favoriteController} from '../controller/favouriteController.js';

const router = express.Router();

router.get('/all-favorites', favoriteController.getAllByUser);

// Add a product to favorites
router.post('/add-favorite', favoriteController.addToFavorite);

// Remove a product from favorites
router.post('/remove-favorite', favoriteController.removeFromFavorite);

// Clear all favorites for a user
router.delete('/clear-favorites/:userId', favoriteController.clearFavorite);


export default router;