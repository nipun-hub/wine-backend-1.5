import {wineCategoryService} from '../service/wineCategoryService.js';
import {successResponse, errorResponse} from '../util/responseUtil.js';

export const wineCategoryController = {
    getAll: async (req, res) => {
        try {
            const wineCategories = await wineCategoryService.getAll();
            return successResponse(res, "Wine Categories fetched successfully", wineCategories, 200);
        } catch (error) {
            return errorResponse(res, error.message, 500);
        }
    },

    save: async (req, res) => {
        try {
            const message = await wineCategoryService.save(req.body.wineCategoriesData);
            return successResponse(res, message, null, 200);
        } catch (error) {
            return errorResponse(res, error.message, 500);
        }
    },

    updateMargin: async (req, res) => {
        const {id} = req.params; // Extract category ID from request parameters
        const {margin} = req.body; // Extract new margin value from request body

        try {
            // Ensure margin is provided and valid
            if (margin === undefined) {
                return res.status(400).json({error: "Margin is required."});
            }

            // Update the margin using the service
            const result = await wineCategoryService.updateMargin(id, margin);

            // Send the updated category as a response
            return res.status(200).json({
                message: result.message, category: result.updatedCategory,
            });
        } catch (error) {
            // Handle errors and send appropriate response
            return res.status(500).json({error: error.message});
        }
    },

    addSubCategoryToCategory: async (req, res) => {
        const {categoryId} = req.params; // Extract category ID from request parameters
        const {subCategoryName} = req.body; // Extract subcategory name from request body

        try {
            // Validate request body
            if (!subCategoryName) {
                return res.status(400).json({error: "SubCategory name is required."});
            }

            // Call the service to add the subcategory
            const result = await wineCategoryService.addSubCategoryToCategory(categoryId, subCategoryName);

            // Send the response
            return res.status(200).json({
                message: result.message, subCategory: result.subCategory,
            });
        } catch (error) {
            // Handle errors and send an appropriate response
            return res.status(500).json({error: error.message});
        }
    },

    updateSubCategoryName: async (req, res) => {
        const { subCategoryId } = req.params; // Extract subcategory ID from URL
        const { name: newName } = req.body; // Extract new name from request body

        try {
            // Validate the input
            if (!newName) {
                return res.status(400).json({ error: "New name is required." });
            }

            // Call the service to update the subcategory name
            const updatedSubCategory = await wineCategoryService.updateSubCategoryName(
                subCategoryId,
                newName
            );

            // Send the response
            return res.status(200).json({
                message: "SubCategory name updated successfully.",
                subCategory: updatedSubCategory,
            });
        } catch (error) {
            // Handle errors
            return res.status(500).json({ error: error.message });
        }
    },
    deleteSubCategory: async (req, res) => {
        const { subCategoryId } = req.params; // Extract subcategory ID from URL

        try {
            // Validate the input
            if (!subCategoryId) {
                return res.status(400).json({ error: "Subcategory ID is required." });
            }

            // Call the service to delete the subcategory
            const deletedSubCategory = await wineCategoryService.deleteSubCategory(subCategoryId);

            // Send the response
            return res.status(200).json({
                message: "SubCategory deleted successfully.",
                subCategory: deletedSubCategory,
            });
        } catch (error) {
            // Handle errors
            return res.status(500).json({ error: error.message });
        }
    },
};
