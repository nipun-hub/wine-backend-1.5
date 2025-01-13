import express from 'express';
import {cartController} from '../controller/cartController.js';

const router = express.Router();

// Get all cart items by user
router.get('/all-carts', cartController.getAllByUser);

// Add product to cart
router.post('/add-cart', cartController.addToCart);

router.post('/update-qty', cartController.updateQty);

// Remove product from cart
router.post('/remove-cart', cartController.removeFromCart);

router.post('/bulk-remove-cart', cartController.bulkRemoveFromCart);

router.delete('/clear/:userId', cartController.clearCart);


export default router;
