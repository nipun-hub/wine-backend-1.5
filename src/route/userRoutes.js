import express from 'express';
import {userController} from '../controller/userController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/:userId', userController.getUserById);
router.get('', userController.getAllUsers);

// Public routes
router.post('/signup', userController.signup);
router.post('/login', userController.login);

//change user details
router.post('/updateUserName/:userId', userController.changeUserName);

//check password is same
router.post('/check-password-same/:userId', userController.checkPasswordSame);

// Update password route
router.put('/:userId/password', userController.updatePassword);

// Route to check if user exists by email
router.post('/check-email', userController.checkUserExistByEmail);

export default router;