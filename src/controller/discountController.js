// controllers/discountController.js


// Controller method to get all discounts
import discountService from "../service/DiscountService.js";

const getAllDiscounts = async (req, res) => {
    try {
        const discounts = await discountService.getAll();
        if (discounts.length === 0) {
            return res.status(404).json({ message: 'No discounts found.' });
        }
        return res.status(200).json(discounts);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: error.message });
    }
};

// Controller method to get a discount by its ID
const getDiscountById = async (req, res) => {
    const { id } = req.params;
    try {
        const discount = await discountService.getById(id);
        return res.status(200).json(discount);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: error.message });
    }
};

// Controller method to create a new discount
const createDiscount = async (req, res) => {
    const discountData = req.body;
    try {
        const discount = await discountService.create(discountData);
        return res.status(201).json(discount);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: error.message });
    }
};

// Controller method to update an existing discount
const updateDiscount = async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;
    try {
        const updatedDiscount = await discountService.update(id, updateData);
        return res.status(200).json(updatedDiscount);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: error.message });
    }
};

// Controller method to delete a discount by ID
const deleteDiscount = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedDiscount = await discountService.delete(id);
        return res.status(200).json(deletedDiscount);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: error.message });
    }
};

// Controller method to activate a discount
const activateDiscount = async (req, res) => {
    const { id } = req.params;
    try {
        const updatedDiscount = await discountService.activate(id);
        return res.status(200).json(updatedDiscount);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: error.message });
    }
};

// Controller method to deactivate a discount
const deactivateDiscount = async (req, res) => {
    const { id } = req.params;
    try {
        const updatedDiscount = await discountService.deactivate(id);
        return res.status(200).json(updatedDiscount);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: error.message });
    }
};

// Controller method to get discounts by productId and category discount type
const getDiscountForProduct = async (req, res) => {
    const { productId } = req.params;
    try {
        const discounts = await discountService.getDiscountForProduct(productId);
        if (discounts.length === 0) {
            return res.status(404).json({ message: 'No active discounts found for this product.' });
        }
        return res.status(200).json(discounts);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: error.message });
    }
};

export default {
    getAllDiscounts,
    getDiscountById,
    createDiscount,
    updateDiscount,
    deleteDiscount,
    activateDiscount,
    deactivateDiscount,
    getDiscountForProduct,
};
