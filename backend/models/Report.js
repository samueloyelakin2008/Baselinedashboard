import mongoose from 'mongoose';

const featureSchema = new mongoose.Schema({
  feature: { type: String, required: true },
  detected: { type: Boolean, required: true },
  baseline: {
    status: String,
    since: String,
    description: String
  },
  browserSupport: {
    chrome: String,
    firefox: String,
    safari: String,
    edge: String
  }
}, { _id: false });

const reportSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true
  },
  userEmail: {
    type: String,
    required: true
  },
  codeType: {
    type: String,
    enum: ['javascript', 'css'],
    required: true
  },
  codeContent: {
    type: String,
    required: true,
    maxlength: 50000 // Limit code size
  },
  features: [featureSchema],
  summary: {
    totalFeatures: Number,
    detectedFeatures: Number,
    baselineCompliant: Number,
    modernFeatures: Number
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 7776000 // 90 days TTL
  }
});

// Indexes for performance
reportSchema.index({ userId: 1, createdAt: -1 });
reportSchema.index({ createdAt: -1 });

const Report = mongoose.model('Report', reportSchema);

export default Report;