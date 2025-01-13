import mongoose from "mongoose";

const wineRegionSchema = new mongoose.Schema({
  region: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  subRegions: [{ type: mongoose.Schema.Types.ObjectId, ref: "SubRegion" }],
}, {
  timestamps: true,
  strict: true,
});

const WineRegion = mongoose.model("WineRegion", wineRegionSchema);

export default WineRegion;

