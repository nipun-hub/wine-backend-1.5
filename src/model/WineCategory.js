import mongoose from "mongoose";

const wineCategorySchema = new mongoose.Schema({
    name: {
        type: String,
        enum: [
            "Red Wine",
            "White Wine",
            "Rose Wine",
            "Champagne & Sparkling",
            "Sake",
            "Spirits",
            "Cans & Cocktails",
            "Accessories",
            "Uncategorized",
        ],
        required: true,
        unique: true,
        trim: true,
    },
    subCategories: [{type: mongoose.Schema.Types.ObjectId, ref: "SubCategory"}],
    margin : {
        type: Number,
        default: 0,
    },
}, {
    timestamps: true,
    strict: true,
});

const WineCategory = mongoose.model("WineCategory", wineCategorySchema);

export default WineCategory;

