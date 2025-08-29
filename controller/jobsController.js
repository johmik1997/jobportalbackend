const Job = require('../Models/Job');
const User = require('../Models/User');
const Application =require("../Models/Application")

// @desc Get all Jobs
// @route GET /jobs
// @access Public
const getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find().lean();

    if (!jobs?.length) {
      return res.status(400).json({ message: 'No jobs found' });
    }

    // Add username to each job (if you have a user field)
    const jobsWithUser = await Promise.all(
      jobs.map(async (job) => {
        if (!job.user) return job;
        const user = await User.findById(job.user).lean().exec();
        return { ...job, username: user?.username || 'Unknown' };
      })
    );

    res.json(jobsWithUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
// @desc Get Employer Jobs (optionally by employer)
// @route GET /jobs?employerId=<id>
// @access private
const getEmployerJobs = async (req, res) => {
  try {
    const { userId } = req.params;

    // 1️⃣ Get all jobs posted by this employer
    const jobs = await Job.find({ user: userId }).lean();

    if (!jobs?.length) {
      return res.status(200).json([]);
    }

    // 2️⃣ Add username and number of applicants
    const jobsWithExtras = await Promise.all(
      jobs.map(async (job) => {
        // Get employer username
        const user = await User.findById(job.user).lean();
        
        // Count applications for this job
        const applicantsCount = await Application.countDocuments({ job: job._id });
        const applicant= await Application.findOne({job: job._id });
       const applicantName = applicant?.name || "Unknown";

        return {
          ...job,
          username: applicantName || "Unknown",
          applicants: applicantsCount,  // <-- added
        };
      })
    );

    res.json(jobsWithExtras);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const getEmployerApplications = async (req, res) => {
  try {
    const { userId } = req.params;

    // 1️⃣ Find all jobs by this employer
    const jobs = await Job.find({ user: userId }).select("_id title").lean();
    const jobIds = jobs.map(job => job._id);

    if (!jobIds.length) return res.status(200).json([]);

    // 2️⃣ Find all applications for these jobs
    const applications = await Application.find({ job: { $in: jobIds } })
      .populate("job", "title") // populate job title
      .populate("user", "username") // optional: populate applicant username if needed
      .lean();

    // Map to frontend-friendly structure
    const formatted = applications.map(app => ({
      id: app._id,
      jobTitle: app.job.title,
      applicant: app.name || app.user?.username || "Unknown",
      status: app.status,
    }));

    res.json(formatted);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


// @desc Create new Job
// @route POST /jobs
// @access Private
const createNewJob = async (req, res) => {
  try {
    const {
      user,
      title,
      companyName,
      salary,
      category,
      jobType,
      location,
      jobDescription,
      requirementSkill,
      keyResponsibility,
      educationLevel,
      experience,
      createdAt,
    } = req.body;

    // Confirm required fields
    if (!user || !title || !companyName) {
      return res.status(400).json({ message: 'User, title and companyName are required' });
    }

    // Check for duplicate title
    const duplicate = await Job.findOne({ title })
      .collation({ locale: 'en', strength: 2 })
      .lean()
      .exec();

    if (duplicate) {
      return res.status(409).json({ message: 'Duplicate job title' });
    }

    const job = await Job.create({
      user,
      title,
      companyName,
      salary,
      category,
      jobType,
      location,
      jobDescription,
      requirementSkill,
      keyResponsibility,
      educationLevel,
      experience,
      createdAt,
    });

    if (job) {
      return res.status(201).json({ message: 'New job created', job });
    } else {
      return res.status(400).json({ message: 'Invalid job data received' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc Update a Job
// @route PATCH /jobs/:id
// @access Private
const updateJob = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      user,
      title,
      companyName,
      salary,
      category,
      jobType,
      location,
      jobDescription,
      requirementSkill,
      keyResponsibility,
      educationLevel,
      experience,
    } = req.body;

    if (!id || !title || !companyName) {
      return res.status(400).json({ message: 'Job ID, title, and companyName are required' });
    }

    const job = await Job.findById(id).exec();
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Check for duplicate title
    const duplicate = await Job.findOne({ title })
      .collation({ locale: 'en', strength: 2 })
      .lean()
      .exec();
    if (duplicate && duplicate._id.toString() !== id) {
      return res.status(409).json({ message: 'Duplicate job title' });
    }

    // Update fields
    job.user = user || job.user;
    job.title = title;
    job.companyName = companyName;
    job.salary = salary || job.salary;
    job.category = category || job.category;
    job.jobType = jobType || job.jobType;
    job.location = location || job.location;
    job.jobDescription = jobDescription || job.jobDescription;
    job.requirementSkill = requirementSkill || job.requirementSkill;
    job.keyResponsibility = keyResponsibility || job.keyResponsibility;
    job.educationLevel = educationLevel || job.educationLevel;
    job.experience = experience || job.experience;

    const updatedJob = await job.save();

    res.json({ message: `Job '${updatedJob.title}' updated`, updatedJob });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc Delete a Job
// @route DELETE /jobs/:id
// @access Private
const deleteJob = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: 'Job ID required' });
    }

    const job = await Job.findById(id).exec();
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    const result = await job.deleteOne();

    res.json({ message: `Job '${result.title}' with ID ${result._id} deleted` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getAllJobs,
  createNewJob,
  getEmployerJobs,
  updateJob,
  deleteJob,
  getEmployerApplications,
};
