import { paymentMethodService } from "../service/paymentMethodService.js";

export const paymentMethodController = {
    /**
     * Add payment method
     */
    addPaymentMethod: async (req, res) => {
        try {
            const { userId, cardHolderName, cardNumber, expiryDate, cardType, isDefault, cvv } = req.body;

            if (!userId || !cardHolderName || !cardNumber || !expiryDate || !cardType || !cvv) {
                return res.status(400).json({ success: false, message: 'All fields are required.' });
            }

            const paymentMethod = await paymentMethodService.addPaymentMethod({
                userId, cardHolderName, cardNumber, expiryDate, cardType, isDefault, cvv,
            });

            res.status(201).json({
                success: true,
                message: 'Payment method added successfully.',
                data: paymentMethod,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message || 'An error occurred while adding the payment method.',
            });
        }
    },

    /**
     * Get all payment methods
     */
    getPaymentMethod: async (req, res) => {
        try {
            const { userId } = req.params;

            if (!userId) {
                return res.status(400).json({ success: false, message: 'User ID is required.' });
            }

            const paymentMethods = await paymentMethodService.getPaymentMethod(userId);

            res.status(200).json({
                success: true,
                message: 'Payment methods retrieved successfully.',
                data: paymentMethods,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message || 'An error occurred while retrieving the payment methods.',
            });
        }
    },

    /**
     * Update a specific card
     */
    updateCard: async (req, res) => {
        try {
            const { userId, cardId } = req.params;
            const updateDetails = req.body;

            if (!userId || !cardId) {
                return res.status(400).json({ success: false, message: 'User ID and Card ID are required.' });
            }

            const updatedCards = await paymentMethodService.updateCard(userId, cardId, updateDetails);

            res.status(200).json({
                success: true,
                message: 'Card updated successfully.',
                data: updatedCards,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message || 'An error occurred while updating the card.',
            });
        }
    },

    /**
     * Delete a card
     */
    deleteCard: async (req, res) => {
        try {
            const { userId, cardId } = req.params;

            if (!userId || !cardId) {
                return res.status(400).json({ success: false, message: 'User ID and Card ID are required.' });
            }

            const updatedCards = await paymentMethodService.deleteCard(userId, cardId);

            res.status(200).json({
                success: true,
                message: 'Card deleted successfully.',
                data: updatedCards,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message || 'An error occurred while deleting the card.',
            });
        }
    },

    /**
     * Set a card as default
     */
    setDefaultCard: async (req, res) => {
        try {
            const { userId, cardId } = req.params;

            if (!userId || !cardId) {
                return res.status(400).json({ success: false, message: 'User ID and Card ID are required.' });
            }

            const updatedCards = await paymentMethodService.setDefaultCard(userId, cardId);

            res.status(200).json({
                success: true,
                message: 'Default card set successfully.',
                data: updatedCards,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message || 'An error occurred while setting the default card.',
            });
        }
    },
};
