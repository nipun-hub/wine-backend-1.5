import mongoose from 'mongoose';

const drynessSchema = new mongoose.Schema({
  name: {
    type: String,
    enum: ['Born dry', 'Dry', 'Off dry', 'Sweet', 'Semi Sweet'],
    required: true,
    unique: true,
    trim: true,
  },
}, {
  timestamps: true,
  strict: true,
});

const Dryness = mongoose.model('Dryness', drynessSchema);

export default Dryness;