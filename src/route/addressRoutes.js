import express from "express";
import {userAddressController} from "../controller/addressController.js";

const router = express.Router();

// Add a new address for a user.
router.post('/add', userAddressController.addAddress);

// Get all addresses for a user.
router.get('/:userId', userAddressController.getAddresses);

// Update a specific address for a user.
router.put('/:userId/:addressId', userAddressController.updateAddress);

// Delete a specific address for a user.
router.delete('/:userId/:addressId', userAddressController.deleteAddress);

// Set a specific address as the default for a user.
router.patch('/:userId/:addressId/default', userAddressController.setDefaultAddress);

export default router;
