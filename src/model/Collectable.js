import mongoose from 'mongoose';

const collectableSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  description: {
    type: String,
    required: false,
    trim: true,
  },
  category: {
    type: String,
    enum: ['Limited Release Wine', 'Vintage Wine', 'Limited Release Spirits', 'Vintage Spirits'],
    required: true,
  },
}, { 
  timestamps: true,
  strict: true,
});

const Collectable = mongoose.model('Collectable', collectableSchema);

export default Collectable;