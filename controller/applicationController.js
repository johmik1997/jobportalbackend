const Application = require('../Models/Application');
const Job = require('../Models/Job');

// @desc Apply for a job
// @route POST /applications
// @access Applicant only

const applyJob = async (req, res) => {
  try {
    const {
      user, job, name, age, email,
      phoneNumber, education, experience,
      portfolio, coverLetter,
    } = req.body;

    if (!user || !job || !name || !email) {
      return res.status(400).json({ message: "Required fields missing" });
    }


 const resumeUrl = req.file?.path || req.file?.secure_url;
console.log("Resume URL:", resumeUrl); // check what URL is generated

    if (!resumeUrl) {
      return res.status(400).json({ message: "Resume file required" });
    }

    // Prevent duplicate application
    const duplicate = await Application.findOne({ user, job }).lean();
    if (duplicate) {
      return res.status(409).json({ message: "You have already applied for this job" });
    }

    const application = await Application.create({
      user,
      job,
      name,
      age,
      email,
      phoneNumber,
      education,
      experience,
      resume: resumeUrl, // save Cloudinary URL
      portfolio,
      coverLetter,
    });

    res.status(201).json({ message: "Application submitted", application });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
// @dec Get Details of the application
// @route GET /applications/:Id
const getApplicationDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const application = await Application.findById(id)
      .populate('user', 'username email') // get user info
      .populate('job', 'title location')  // get job info
      .lean();

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    res.json(application);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};


// @desc Get all applications of a user
// @route GET /applications/:userId
// @access Applicant only
const getUserApplications = async (req, res) => {
  try {
    const { userId } = req.params;
    const applications = await Application.find({ user: userId})
      .populate('job')
      .lean();
    res.json(applications);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc Get all applications for a job (employer view)
// @route GET /applications/job/:jobId
// @access Employer only
const getJobApplications = async (req, res) => {
  try {
    const { jobId } = req.params;
    const applications = await Application.find({ job: jobId })
      .populate('user', 'username email')
      .lean();
    res.json(applications);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};


// @desc Update application status (admin/employer)
// @route PATCH /applications/:id
// @access Employer/Admin
const updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['applied', 'shortlisted', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const application = await Application.findById(id);
    if (!application) return res.status(404).json({ message: 'Application not found' });

    application.status = status;
    await application.save();

    res.json({ message: `Application status updated to ${status}` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  applyJob,
  getUserApplications,
  getJobApplications,
  getApplicationDetails,
  updateApplicationStatus,
};
