import mongoose from 'mongoose';

const addressSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: [true, 'Full name is required'],
        trim: true,
    },
    streetAddress: {
        type: String,
        required: [true, 'Street address is required'],
        trim: true,
    },
    additionalAddress: {
        type: String,
        trim: true,
        default: '',
    },
    city: {
        type: String,
        required: [true, 'City is required'],
        trim: true,
    },
    state: {
        type: String,
        required: [true, 'State is required'],
        trim: true,
    },
    zipCode: {
        type: String, // Changed to String to accommodate leading zeros
        required: [true, 'Zip code is required'],
        trim: true,
        validate: {
            validator: (value) => /^[0-9]{5}(-[0-9]{4})?$/.test(value),
            message: 'Invalid zip code format',
        },
    },
    isDefault: {
        type: Boolean,
        default: false,
    },
}, {timestamps: true}); // Automatically handles createdAt and updatedAt

const userAddressSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User ID is required'],
        index: true, // Adds an index for better query performance
    },
    addresses: [addressSchema], // Array of addresses
}, {timestamps: true});

const UserAddress = mongoose.model('UserAddress', userAddressSchema);

export default UserAddress;
