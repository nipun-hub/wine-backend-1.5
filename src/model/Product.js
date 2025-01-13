import mongoose from 'mongoose';
import mongoosePaginate from "mongoose-paginate-v2";

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            trim: true,
        },
        country: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Country',
            required: true,
        },
        regions: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'WineRegion',
                required: true,
            },
        ],
        subRegions: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'SubRegion',
        }],

        categories: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'WineCategory',
            required: true,
        }],
        subCategories: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'SubCategory',
            },
        ],
        vintage: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Vintage',
        },
        dryness: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Dryness',
            required: true,
        },
        size: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Size',
            required: true,
        },
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Type',
        }],
        abv: {
            type: Number,
            required: true,
            min: 0,
        },
        rating: {
            type: Number,
            default: 0,
            min: 0,
            max: 5,
        },
        greatForGift: {
            type: Boolean,
            default: false,
        },
        image: {
            type: String,
            trim: true,
            required: true,
        },
        unitPrice: {
            type: Number,
            required: true,
            min: 0,
        },
        unitCost: {
            type: Number,
            required: true,
            min: 0,
        },
        qtyOnHand: {
            type: Number,
            required: true,
            min: 0,
        },
        isPack: {
            type: Boolean,
            default: false,
        },
        pack: {
            type: Array,
            required: function () {
                return this.isPack;
            },
            validate: {
                validator: function (v) {
                    return v && v.length > 0;
                },
                message: 'At least one pack details is required if isPack is true'
            },
            default: undefined,
            of: {
                packSize: {
                    type: Number,
                    required: true,
                    min: 1,
                },
                packCost: {
                    type: Number,
                    required: true,
                    min: 0,
                },
                packPrice: {
                    type: Number,
                    required: true,
                    min: 0,
                },
            }
        },
        inStock: {
            type: Boolean,
            default: true,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

// Add pagination plugin
productSchema.plugin(mongoosePaginate);

// Create model
const Product = mongoose.model('Product', productSchema);

export default Product;
