import Discount from "../model/Discount.js";
import Product from "../model/Product.js";

const discountService = {
    // Get all discounts
    getAll: async () => {
        try {
            const discounts = await Discount.find().populate('categoryId').populate('productId');
            return discounts;
        } catch (error) {
            throw new Error(`Error fetching discounts: ${error.message}`);
        }
    },

    // Get a discount by its ID
    getById: async (id) => {
        try {
            const discount = await Discount.findById(id).populate('categoryId').populate('productId');
            if (!discount) {
                throw new Error(`Discount with ID ${id} not found.`);
            }
            return discount;
        } catch (error) {
            throw new Error(`Error fetching discount: ${error.message}`);
        }
    },

    // Create a new discount
    create: async (discountData) => {
        // Check if the discount name already exists
        const existingDiscount = await Discount.findOne({discountName: discountData.discountName});
        if (existingDiscount) {
            throw new Error(`Discount with name ${discountData.discountName} already exists.`);
        }
        try {
            const discount = new Discount(discountData);
            await discount.save();
            return discount;
        } catch (error) {
            console.log(error);
            throw new Error(`Error creating discount: ${error.message}`);
        }
    },

    // Update an existing discount
    update: async (id, updateData) => {
        try {

            const existingDiscount = await Discount.findOne({discountName: updateData.discountName});
            if (existingDiscount && existingDiscount._id.toString() !== id) {
                throw new Error(`Discount with name ${updateData.discountName} already exists.`);
            }

            const updatedDiscount = await Discount.findByIdAndUpdate(id, updateData, {new: true, runValidators: true});
            if (!updatedDiscount) {
                throw new Error(`Discount with ID ${id} not found.`);
            }
            return updatedDiscount;
        } catch (error) {
            throw new Error(`Error updating discount: ${error.message}`);
        }
    },

    // Delete a discount by ID
    delete: async (id) => {
        try {
            const deletedDiscount = await Discount.findByIdAndDelete(id);
            if (!deletedDiscount) {
                throw new Error(`Discount not found.`);
            }
            return {message: `Discount deleted successfully.`};
        } catch (error) {
            throw new Error(`Error deleting discount: ${error.message}`);
        }
    },

    // Activate a discount
    activate: async (id) => {
        try {
            const updatedDiscount = await Discount.findByIdAndUpdate(id, {isActive: true}, {new: true});
            if (!updatedDiscount) {
                throw new Error(`Discount with ID ${id} not found.`);
            }
            return {
                message: `Discount activated successfully.`,
                discount: updatedDiscount,
            };
        } catch (error) {
            throw new Error(`Error activating discount: ${error.message}`);
        }
    },

    // Deactivate a discount
    deactivate: async (id) => {
        try {
            const updatedDiscount = await Discount.findByIdAndUpdate(id, {isActive: false}, {new: true});
            if (!updatedDiscount) {
                throw new Error(`Discount with ID ${id} not found.`);
            }
            return {
                message: `Discount deactivated successfully.`,
                discount: updatedDiscount,
            };
        } catch (error) {
            throw new Error(`Error deactivating discount: ${error.message}`);
        }
    },

    getDiscountForProduct: async (productId) => {
        try {
            // Initialize an empty array to hold all discounts
            const discounts = [];

            // Step 1: Search for a product-specific discount
            const productDiscounts = await Discount.find({
                discountType: 'product',
                productId: productId,
                isActive: true,
            }).sort({unitDiscount: -1, packDiscount: -1});

            if (productDiscounts) {
                discounts.push(...productDiscounts); // Add product discounts to the list
            }

            // Step 2: Find the product's categories
            const product = await Product.findById(productId).select('categories');
            if (!product) {
                throw new Error(`Product with ID ${productId} not found.`);
            }

            if (product.categories && product.categories.length > 0) {
                // Step 3: Search for category-specific discounts
                const categoryDiscounts = await Discount.find({
                    discountType: 'category',
                    categoryId: {$in: product.categories},
                    isActive: true,
                });

                if (categoryDiscounts && categoryDiscounts.length > 0) {
                    discounts.push(...categoryDiscounts); // Add all category discounts to the list
                }
            }

            // Step 5: Return the single discount with the highest unit discount
            const highestUnitDiscount = discounts.reduce((prev, current) => {
                return prev.unitDiscount > current.unitDiscount ? prev : current;
            }, {unitDiscount: 0});

            return highestUnitDiscount;

            // Step 4: Return the aggregated discounts array
            // return discounts;
        } catch (error) {
            console.error(`Error fetching discounts for product ID ${productId}: ${error.message}`);
            throw new Error(`Error fetching discounts for product ID ${productId}: ${error.message}`);
        }
    },
};

export default discountService;