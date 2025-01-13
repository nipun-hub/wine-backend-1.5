import mongoose from 'mongoose';

const imageModelSchema = new mongoose.Schema({
  section: {
    type: String, // e.g., 'banner', 'hero', 'promotion_card_1', etc.
    required: true,
    unique: true,
  },
  imageUrl: {
    type: String,
    required: true,
  }
});

const ImageModel = mongoose.model('ImageModel', imageModelSchema);

export default ImageModel;