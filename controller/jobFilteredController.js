const Job = require("../Models/Job");

// GET /api/jobs?title=developer&location=NY&salaryMin=0&salaryMax=80000&jobType=Full-time
const getFilteredJobs = async (req, res) => {
  try {
    const { title, location, category, jobType, experience, datePosted } = req.query;

    const filter = {};

    if (title) {
      filter.$or = [
        { title: { $regex: title, $options: "i" } },
        { companyName: { $regex: title, $options: "i" } },
      ];
    }

    if (location) filter.location = { $regex: location, $options: "i" };
    if (category) filter.category = category;
    if (jobType) filter.jobType = jobType;
    if (experience) filter.experience = { $regex: experience, $options: "i" };

    if (datePosted) {
      const now = new Date();
      let dateFilter = null;

      switch (datePosted) {
        case "Last Hour":
          dateFilter = new Date(now - 60 * 60 * 1000);
          break;
        case "Last 24 Hours":
          dateFilter = new Date(now - 24 * 60 * 60 * 1000);
          break;
        case "Last 7 Days":
          dateFilter = new Date(now - 7 * 24 * 60 * 60 * 1000);
          break;
        case "Last 30 Days":
          dateFilter = new Date(now - 30 * 24 * 60 * 60 * 1000);
          break;
      }

      if (dateFilter) filter.createdAt = { $gte: dateFilter };
    }

    const jobs = await Job.find(filter).sort({ createdAt: -1 });
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: "Error fetching jobs", error: err.message });
  }
};

module.exports = { getFilteredJobs };
