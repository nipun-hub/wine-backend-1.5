import mongoose from 'mongoose';

const vintageSchema = new mongoose.Schema({
  year: {
    type: String,
    unique: true,
  },
  description: {
    type: String,
    required: false,
    trim: true,
  },
}, {
  timestamps: true,
  strict: true,
});

const Vintage = mongoose.model('Vintage', vintageSchema);

export default Vintage;