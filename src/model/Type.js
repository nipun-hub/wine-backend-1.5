import mongoose from 'mongoose';

const typeSchema = new mongoose.Schema({
    name: {
        type: String,
        enum: ['Screw caps', 'Kosher', 'Passover', 'Mevshal', 'Natural'],
        required: true,
        unique: true,
        trim: true,
    },
}, {
    timestamps: true,
    strict: true,
});

const Type = mongoose.model('Type', typeSchema);

export default Type;