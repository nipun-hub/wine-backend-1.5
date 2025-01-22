import mongoose from 'mongoose';
import mongoosePaginate from "mongoose-paginate-v2";

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    products: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
                min: 1,
            },
            isPack: {
                type: Boolean,
                default: false
            },
            packSize: {
                type: Number,
                required: function () {
                    return this.isPack;
                },
                min: 0,
            },
        },
    ],
    totalAmount: {
        type: Number,
        required: true,
    },
    mobileNumber: {
        type: String,
        required: true,
    },
    userComments: {
        type: String,
    },
    paymentMethod: {
        type: String,
        enum: ['Cash', 'Card'],
        default: 'Cash',
    },
    shippingAddress: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserAddress',
        required: true,
    },
    paymentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Address',
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'paid', 'failed'],
        default: 'pending',
    },
    editable: {
        type: Boolean,
        default: false,
    },
    deliveryType: {
        type: String,
        enum: ['Delivery', 'Pickup'],
        default: 'Delivery',
    },
    deliveryDate: {
        type: Date,
        required: function () {
            return this.deliveryType === 'Pickup';
        },
    },
    status: {
        type: String,
        enum: ['pending', 'delivered', 'cancelled'],
        default: 'pending',
    },
    statusMessage: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
}, { timestamps: true });

orderSchema.plugin(mongoosePaginate);

const Order = mongoose.model('Order', orderSchema);

export default Order;