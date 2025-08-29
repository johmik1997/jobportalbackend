const mongoose = require('mongoose');
const mongooseSequence = require('mongoose-sequence')(mongoose);

const ApplicationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
    name: { type: String, required: true },
    age: { type: Number },
    email: { type: String, required: true },
    phoneNumber: { type: String },
    education: { type: String },
    experience: { type: String },
    resume: { type: String, required: true },
    portfolio: { type: String },
    coverLetter: { type: String, maxlength: 2000 },
    status: {
  type: String,
  enum: ['applied', 'shortlisted', 'rejected'],
  default: 'applied',
}

  },
  { timestamps: true }
);

// Prevent duplicate applications
ApplicationSchema.index({ user: 1, job: 1 }, { unique: true });

module.exports = mongoose.model('Application', ApplicationSchema);
