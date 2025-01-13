import mongoose from 'mongoose';

const cardSchema = new mongoose.Schema({
    cardHolderName: {
        type: String,
        required: true,
        trim: true,
    },
    cardNumber: {
        type: String,
        required: true,
        trim: true,
    },
    expiryDate: {
        type: String, // Format: MM/YY
        required: true,
    },
    cardType: {
        type: String,
        enum: ['Visa', 'MasterCard', 'American Express', 'Discover', 'JCB', 'Other'],
        required: true,
    },
    cvv: {
        type: Number,
        required: true,
    },
    isDefault: {
        type: Boolean,
        default: false, // Indicates if this card is the default payment method
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const userPaymentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    cards: [cardSchema], // Array of card details
}, {timestamps: true});

const PaymentMethod = mongoose.model('PaymentMethod', userPaymentSchema);

export default PaymentMethod;
