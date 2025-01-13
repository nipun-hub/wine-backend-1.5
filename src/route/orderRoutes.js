import express from 'express';
import {orderController} from "../controller/orderController.js";
import {validateOrder} from "../middleware/validateOrder.js";

const router = express.Router();

// Create an order
router.post('/orders', validateOrder, orderController.createOrder);

// Get an order by ID
router.get('/orders/:id', orderController.getOrderById);

// Get all orders
router.get('/orders', orderController.getAllOrders);

// Route to accept or reject an order
router.put('/orders/:id/status', orderController.updateOrderStatus);

// Route to get user order history
router.get('/orders/userOrderHistory/:id', orderController.userOrderHistory);

// Update an order (add new product, delete product, change quantity, change price, or update mobile number)
router.put('/:orderId', orderController.updateOrder);

export default router;
