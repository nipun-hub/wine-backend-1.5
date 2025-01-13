import {cartService} from '../service/cartService.js';
import {successResponse, errorResponse} from '../util/responseUtil.js';

export const cartController = {
    // Get all cart items by user with pagination
    getAllByUser: async (req, res) => {
        const {page = 1, perPage = 10, orderBy = 'addedAt', sort = 'desc', search = '', userId} = req.query;

        try {
            const response = await cartService.getAllByUser(userId, parseInt(page), parseInt(perPage));
            return successResponse(res, "Cart items fetched successfully", response, 200);
        } catch (error) {
            return errorResponse(res, error.message, 500);
        }
    },

    // Add product to cart
    addToCart: async (req, res) => {
        const {userId, productId, quantity} = req.body;

        try {
            const cartItem = await cartService.addToCart(userId, productId, quantity);
            return successResponse(res, "Product added to cart successfully", cartItem, 201);
        } catch (error) {
            return errorResponse(res, error.message, 500);
        }
    },

    // Remove product from cart
    removeFromCart: async (req, res) => {
        const {userId, productId} = req.body;

        try {
            const result = await cartService.removeFromCart(userId, productId);
            return successResponse(res, "Product removed from cart successfully", result, 200);
        } catch (error) {
            return errorResponse(res, error.message, 500);
        }
    },

    // Remove product from cart
    updateQty: async (req, res) => {
        const {userId, productId, quantity} = req.body;

        try {
            const result = await cartService.updateQty(userId, productId, parseInt(quantity));
            return successResponse(res, "Quantity updated successfully", result, 200);
        } catch (error) {
            return errorResponse(res, error.message, 500);
        }
    },

    bulkRemoveFromCart: async (req, res) => {
        const {userId, productIds} = req.body;

        if (!Array.isArray(productIds) || productIds.length === 0) {
            return errorResponse(res, "Please provide a list of product IDs", 400);
        }

        try {
            const result = await cartService.bulkRemoveFromCart(userId);
            return successResponse(res, `${result.deletedCount} cart items removed successfully`, result, 200);
        } catch (error) {
            return errorResponse(res, error.message, 500);
        }
    },

    // Clear all cart items for a user
    clearCart: async (req, res) => {
        const {userId} = req.params;
        try {
            const result = await cartService.clearCart(userId);
            if (result.deletedCount === 0) {
                throw new Error('No items found in the cart to clear');
            }
            return successResponse(res, `${result.deletedCount} Cart cleared successfully`, result, 200);
        } catch (error) {
            return errorResponse(res, error.message, 500);
        }
    },

};
