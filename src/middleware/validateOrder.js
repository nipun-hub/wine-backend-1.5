import { body, validationResult } from 'express-validator';

export const validateOrder = [
    body('userId').notEmpty().withMessage('User ID is required'),
    body('products')
        .isArray({ min: 1 })
        .withMessage('At least one product is required in the order'),
    body('products.*.product')
        .notEmpty()
        .withMessage('Product ID is required for each item'),
    body('products.*.quantity')
        .isInt({ min: 1 })
        .withMessage('Quantity must be a positive integer for each item'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    },
];