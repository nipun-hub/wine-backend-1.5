import PaymentMethod from "../model/PaymentMethos.js";

export const paymentMethodService = {
    /**
     * Add a new card to the user's payment methods.
     */
    addPaymentMethod: async ({userId, cardHolderName, cardNumber, expiryDate, cardType, isDefault, cvv}) => {
        try {
            // Check if the user has a payment record
            let paymentMethod = await PaymentMethod.findOne({ user: userId });

            // Check if card number already exists for the user
            if (paymentMethod && paymentMethod.cards.some(card => card.cardNumber === cardNumber)) {
                throw new Error('This card number is already associated with your account.');
            }

            // Create a new UserPayment document if it doesn't exist
            if (!paymentMethod) {
                paymentMethod = new PaymentMethod({ user: userId, cards: [] });
            }

            // Add the new card using cardDetails directly
            paymentMethod.cards.push({
                cardHolderName: cardHolderName,
                cardNumber: cardNumber,
                expiryDate: expiryDate,
                cardType: cardType,
                cvv: cvv,
                isDefault: isDefault,
            });

            // Save the updated payment record
            await paymentMethod.save();

            return {
                success: true,
                message: 'Card added successfully.',
                data: paymentMethod,
            };
        } catch (error) {
            throw new Error(error.message || 'Failed to add card.');
        }
    },

    /**
     * Get all cards for a user.
     */
    getPaymentMethod: async (userId) => {
        try {
            const userPayment = await PaymentMethod.findOne({ user: userId }).populate('user', 'name email');

            if (!userPayment || userPayment.cards.length === 0) {
                return { success: true, message: 'No cards found.', data: [] };
            }

            return {
                success: true,
                message: 'Cards retrieved successfully.',
                data: userPayment.cards,
            };
        } catch (error) {
            throw new Error(error.message || 'Failed to retrieve cards.');
        }
    },

    /**
     * Update a specific card's details.
     */
    updateCard: async (userId, cardId, updateDetails) => {
        try {
            const userPayment = await PaymentMethod.findOne({ user: userId });

            if (!userPayment) throw new Error('User not found.');

            const card = userPayment.cards.id(cardId);
            if (!card) throw new Error('Card not found.');

            // Update card details
            Object.assign(card, updateDetails);

            // Save changes
            await userPayment.save();

            return {
                success: true,
                message: 'Card updated successfully.',
                data: userPayment.cards,
            };
        } catch (error) {
            throw new Error(error.message || 'Failed to update card.');
        }
    },

    /**
     * Delete a card from the user's payment methods.
     */
    deleteCard: async (userId, cardId) => {
        try {
            const userPayment = await PaymentMethod.findOne({ user: userId });

            if (!userPayment) throw new Error('User not found.');

            const cardIndex = userPayment.cards.findIndex(card => card._id.toString() === cardId);
            if (cardIndex === -1) throw new Error('Card not found.');

            // Remove card
            userPayment.cards.splice(cardIndex, 1);

            // Save changes
            await userPayment.save();

            return {
                success: true,
                message: 'Card deleted successfully.',
                data: userPayment.cards,
            };
        } catch (error) {
            throw new Error(error.message || 'Failed to delete card.');
        }
    },

    /**
     * Set a card as the default payment method.
     */
    setDefaultCard: async (userId, cardId) => {
        try {
            const userPayment = await PaymentMethod.findOne({ user: userId });

            if (!userPayment) throw new Error('User not found.');

            const card = userPayment.cards.id(cardId);
            if (!card) throw new Error('Card not found.');

            // Set all cards to not default
            userPayment.cards.forEach(card => (card.isDefault = false));

            // Set the selected card as default
            card.isDefault = true;

            // Save changes
            await userPayment.save();

            return {
                success: true,
                message: 'Default card set successfully.',
                data: userPayment.cards,
            };
        } catch (error) {
            throw new Error(error.message || 'Failed to set default card.');
        }
    },
};
