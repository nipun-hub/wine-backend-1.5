import mongoose from 'mongoose';

const subCategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  mainCategoryId: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: "WineCategory" 
  }
}, {
  timestamps: true,
});

const SubCategory = mongoose.model('SubCategory', subCategorySchema);

export default SubCategory;