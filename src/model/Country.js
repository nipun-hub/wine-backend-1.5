import mongoose from 'mongoose';
const countrySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    regions: [{ type: mongoose.Schema.Types.ObjectId, ref: "SubRegion" }],
}, {
    timestamps: true,
    strict: true,
});

const Country = mongoose.model('Country', countrySchema);

export default Country;