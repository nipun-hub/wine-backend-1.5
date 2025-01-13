import express from "express";
import { paymentMethodController } from "../controller/paymentMethodController.js";

const router = express.Router();

// Add payment method
router.post('/add', paymentMethodController.addPaymentMethod);

// Get all payment methods for a user
router.get('/:userId', paymentMethodController.getPaymentMethod);

// Update a specific card for a user
router.put('/:userId/:cardId', paymentMethodController.updateCard);

// Delete a specific card for a user
router.delete('/:userId/:cardId', paymentMethodController.deleteCard);

// Set a specific card as default for a user
router.patch('/:userId/:cardId/default', paymentMethodController.setDefaultCard);

export default router;
