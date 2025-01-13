import express from 'express';
import {membershipPlanController} from "../controller/membershipPlanController.js";

const router = express.Router();

// Get all cart items by user
router.post('/add', membershipPlanController.save);

// Update an existing membership plan by ID
router.put('/update/:id', membershipPlanController.update);

// Get all membership plans
router.get('/', membershipPlanController.getAll);


export default router;
