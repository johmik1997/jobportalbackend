const mongoose = require('mongoose');
const mongooseSequence = require('mongoose-sequence')(mongoose);

const JobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    companyName: {
      type: String,
      required: true,
    },
    salary: {
      type: String,
    },
    category: {
      type: String,
    },
    location: {
      type: String,
    },
    jobDescription: {
      type: String,
    },
      requirementSkill: {
      type: [String], // <-- array of strings
      default: [],
    },
    keyResponsibility: {
      type: [String], // <-- array of strings
      default: [],
    },
  jobType: {
  type: String,
  enum: ["Full-time", "Part-time", "Contract", "Internship"],
},
educationLevel: {
  type: String,
  enum: ["High School", "Diploma", "Bachelor", "Master", "PhD"],
},
    experience: {
      type: String,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    status:{
      type:Boolean,
      default:true,
    }
  },
  { timestamps: true }
);


module.exports = mongoose.model('Job', JobSchema);
