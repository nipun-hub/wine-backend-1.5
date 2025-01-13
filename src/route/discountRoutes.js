import express from "express";
import discountController from "../controller/discountController.js";


const router = express.Router();

// Route to get all discounts
router.get('', discountController.getAllDiscounts);

// Route to get a discount by its ID
router.get('/:id', discountController.getDiscountById);

// Route to create a new discount
router.post('', discountController.createDiscount);

// Route to update an existing discount
router.put('/:id', discountController.updateDiscount);

// Route to delete a discount by ID
router.delete('/:id', discountController.deleteDiscount);

// Route to activate a discount
router.put('/:id/activate', discountController.activateDiscount);

// Route to deactivate a discount
router.put('/:id/deactivate', discountController.deactivateDiscount);

// Route to get discounts by productId and category discount type
router.get('/product/:productId', discountController.getDiscountForProduct);

export default router;
