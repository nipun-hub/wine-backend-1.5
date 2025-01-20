import WineCategory from '../model/WineCategory.js';
import SubCategory from "../model/SubCategory.js";

export const wineCategoryService = {
    getAll: async () => {
        try {
            const wineCategories = await WineCategory.find();
            return wineCategories;
        } catch (error) {
            throw new Error(`Error fetching Wine Categories: ${error.message}`);
        }
    },

    save: async (wineCategoriesData) => {
        try {
            const count = await WineCategory.countDocuments();
            if (count === 0) {
                await WineCategory.insertMany(wineCategoriesData);
                return "Wine Categories seeded successfully.";
            }
            return "Wine Categories already have data. Skipping seeding.";
        } catch (error) {
            throw new Error(`Error saving Wine Categories: ${error.message}`);
        }
    },
    updateMargin: async (id, newMargin) => {
        try {
            // Validate newMargin
            if (newMargin < 0) {
                throw new Error("Margin cannot be negative.");
            }

            // Find the category and update the margin
            const updatedCategory = await WineCategory.findByIdAndUpdate(
                id,
                { margin: newMargin },
                { new: true, runValidators: true } // Return updated document and apply validators
            );

            if (!updatedCategory) {
                throw new Error(`WineCategory with id ${id} not found.`);
            }

            return {
                message: "Margin updated successfully.",
                updatedCategory,
            };
        } catch (error) {
            throw new Error(`Error updating margin: ${error.message}`);
        }
    },
    addSubCategoryToCategory: async (categoryId, subCategoryName) => {
        console.log("hello")
        try {
            // Validate the input
            if (!categoryId || !subCategoryName) {
                throw new Error("Both categoryId and subCategoryName are required.");
            }

            // Check if the wine category exists
            const wineCategory = await WineCategory.findById(categoryId);
            if (!wineCategory) {
                throw new Error(`WineCategory with id ${categoryId} not found.`);
            }

            // Check if the subcategory already exists under the category
            const existingSubCategory = await SubCategory.findOne({
                name: subCategoryName.trim(),
                mainCategoryId: categoryId,
            });

            if (existingSubCategory) {
                return {
                    message: "SubCategory already exists under this category.",
                    subCategory: existingSubCategory,
                };
            }

            // Create a new subcategory
            const newSubCategory = await SubCategory.create({
                name: subCategoryName.trim(),
                mainCategoryId: categoryId,
            });

            // Update the wine category with the new subcategory
            wineCategory.subCategories.push(newSubCategory._id);
            await wineCategory.save();

            return {
                message: "SubCategory added successfully.",
                subCategory: newSubCategory,
            };
        } catch (error) {
            throw new Error(`Error adding SubCategory: ${error.message}`);
        }
    },
    updateSubCategoryName: async (subCategoryId, newName) => {
        try {
            // Validate inputs
            if (!subCategoryId || !newName) {
                throw new Error("SubCategory ID and new name are required.");
            }

            // Find and update the subcategory name
            const updatedSubCategory = await SubCategory.findByIdAndUpdate(
                subCategoryId,
                { $set: { name: newName } },
                { new: true, runValidators: true }
            );

            if (!updatedSubCategory) {
                throw new Error(`SubCategory with ID ${subCategoryId} not found.`);
            }

            return updatedSubCategory;
        } catch (error) {
            throw new Error(`Error updating SubCategory name: ${error.message}`);
        }
    },
    deleteSubCategory: async (subCategoryId) => {
        try {
            // Validate input
            if (!subCategoryId) {
                throw new Error("SubCategory ID is required.");
            }

            // Find and delete the subcategory
            const deletedSubCategory = await SubCategory.findByIdAndDelete(subCategoryId);

            if (!deletedSubCategory) {
                throw new Error(`SubCategory with ID ${subCategoryId} not found.`);
            }

            // Remove the subcategory from the wine category
            const wineCategory = await WineCategory.findByIdAndUpdate(
                deletedSubCategory.mainCategoryId,
                { $pull: { subCategories: deletedSubCategory._id } },
                { new: true }
            );

            return deletedSubCategory;
        } catch (error) {
            throw new Error(`Error deleting SubCategory: ${error.message}`);
        }
    },
};
