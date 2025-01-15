import mongoose from "mongoose";

const discountSchema = new mongoose.Schema({
    discountName: {
        type: String,
        required: true,
    },
    discountType: {
        type: String,
        enum: ['category', 'product', 'all', 'promotion'],
        required: true,
    },
    // discount code is only for promotion
    code: {
        type: String,
        required: function () {
            return this.discountType === 'promotion';
        },
        unique: true, // Ensures uniqueness
        sparse: true, // Allows multiple `null` values
        trim: true,
    },
    categoryId: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'WineCategory',
        required: function () {
            return this.discountType === 'category';
        },
        sparse: true,
    }],
    productId: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: function () {
            return this.discountType === 'product';
        },
        sparse: true,
    }],
    unitDiscount: {
        type: Number,
        required: true,
    },
    packDiscount: {
        type: Number,
        required: true,
    },
    startDate: {
        type: Date,
    },
    endDate: {
        type: Date,
    },
    isActive: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
});

const Discount = mongoose.model('Discount', discountSchema);

export default Discount;
