const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/Cloudnary");

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "resumes", // Cloudinary folder
    resource_type: "raw", // auto-detect pdf, docx, etc
    allowed_formats: ["pdf", "doc", "docx", "png", "jpg"], // resume file types
  },
});

const upload = multer({ storage });

module.exports = upload;
