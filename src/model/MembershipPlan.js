import mongoose from 'mongoose';

const membershipPlanSchema = new mongoose.Schema({
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
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  benefits: [{
    type: String,
    required: true,
  }],
  duration: {
    type: String,
    required: true,
    enum: ['3 Months', '6 Months', '12 Months'],
  },
}, { 
  timestamps: true,
  strict: true,
});

const MembershipPlan = mongoose.model('MembershipPlan', membershipPlanSchema);

export default MembershipPlan;