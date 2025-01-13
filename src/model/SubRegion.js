import mongoose from 'mongoose';

const subRegionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  mainRegionId: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: "WineRegion" 
  }
}, {
  timestamps: true,
});

const SubRegion = mongoose.model('SubRegion', subRegionSchema);

export default SubRegion;