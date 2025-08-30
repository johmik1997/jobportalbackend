const express = require('express')
const router = express.Router()
const applicationsController = require('../controller/applicationController')
const verifyJWT = require('../middleware/verifyJWT')
const authorizeRole = require('../middleware/authorizeRole');
const upload = require("../middleware/uploads");
const jobsController= require("../controller/jobsController")

router.use(verifyJWT)
/**
 * @swagger
 * /applications:
 *   post:
 *     summary: Apply for a job (Developer)
 *     tags: [Applications]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               resume:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Job application submitted successfully
 */
router.post('/', upload.single("resume"), authorizeRole(['Developer']), applicationsController.applyJob);

/**
 * @swagger
 * /applications/user/{userId}:
 *   get:
 *     summary: Get applications for a specific user (Developer)
 *     tags: [Applications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: List of applications for the user
 */
router.get('/user/:userId', authorizeRole(['Developer']), applicationsController.getUserApplications);

/**
 * @swagger
 * /applications/employer/{id}:
 *   get:
 *     summary: Get all applications for an employer
 *     tags: [Applications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Employer ID
 *     responses:
 *       200:
 *         description: List of applications for the employer
 */
router.get('/employer/:id', authorizeRole(['employer']), jobsController.getEmployerApplications);

/**
 * @swagger
 * /applications/{id}:
 *   get:
 *     summary: Get details of a specific application
 *     tags: [Applications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Application ID
 *     responses:
 *       200:
 *         description: Application details
 */
router.get('/:id', applicationsController.getApplicationDetails);

/**
 * @swagger
 * /applications/job/{jobId}:
 *   get:
 *     summary: Get all applications for a specific job (Employer)
 *     tags: [Applications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: jobId
 *         required: true
 *         schema:
 *           type: string
 *         description: Job ID
 *     responses:
 *       200:
 *         description: List of applications for the job
 */
router.get('/job/:jobId', authorizeRole('employer'), applicationsController.getJobApplications);

/**
 * @swagger
 * /applications/{id}:
 *   patch:
 *     summary: Update application status (e.g., Approved, Shortlisted, Rejected)
 *     tags: [Applications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Application ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [approved, shortlisted, rejected]
 *     responses:
 *       200:
 *         description: Application status updated successfully
 */
router.patch('/:id', authorizeRole(['employer']), applicationsController.updateApplicationStatus);

module.exports = router;
