import {favoriteService} from "../service/favouriteService.js";
import {successResponse, errorResponse} from "../util/responseUtil.js";

export const favoriteController = {
    // Get all favorites by user with pagination, sorting, and search
    getAllByUser: async (req, res) => {
        const {page = 1, perPage = 10, orderBy = 'addedAt', sort = 'desc', search = '', userId} = req.query;

        try {
            const {
                data: {
                    favorites,
                    totalPages,
                    totalItems
                }
            } = await favoriteService.getAllByUser(userId, page, perPage, orderBy, sort, search);
            const pagination = {
                page: parseInt(page),
                perPage: parseInt(perPage),
                totalItems,
                totalPages
            };
            return successResponse(res, "Favorites fetched successfully", {favorites, pagination}, 200);
        } catch (error) {
            return errorResponse(res, error.message, 500);
        }
    },

    // Add a product to favorites
    addToFavorite: async (req, res) => {
        const {userId, productId} = req.body;

        try {
            const favorite = await favoriteService.addToFavorite(userId, productId);
            return successResponse(res, "Product added to favorites successfully", favorite, 201);
        } catch (error) {
            return errorResponse(res, error.message, 500);
        }
    },

    // Remove a product from favorites
    removeFromFavorite: async (req, res) => {
        const {userId, productId} = req.body;

        try {
            const result = await favoriteService.removeFromFavorite(userId, productId);
            if (!result) {
                return errorResponse(res, "Favorite not found", 404);
            }
            return successResponse(res, "Product removed from favorites successfully", null, 200);
        } catch (error) {
            return errorResponse(res, error.message, 500);
        }
    },

    // Clear all Favorite items for a user
    clearFavorite: async (req, res) => {
        const {userId} = req.params;
        try {
            const result = await favoriteService.clearFavorite(userId);
            if (result.deletedCount === 0) {
                throw new Error('No items found in the favorite to clear');
            }
            return successResponse(res, `${result.deletedCount} Favorite cleared successfully`, result, 200);
        } catch (error) {
            return errorResponse(res, error.message, 500);
        }
    },
};
