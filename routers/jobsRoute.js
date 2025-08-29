const express = require('express');
const router = express.Router();
const jobsController = require('../controller/jobsController');
const verifyJWT = require('../middleware/verifyJWT');
const authorizeRole = require('../middleware/authorizeRole');

/**
 * @swagger
 * tags:
 *   name: Jobs
 *   description: Job management and retrieval
 */

/**
 * @swagger
 * /jobs:
 *   get:
 *     summary: Get all jobs (public)
 *     tags: [Jobs]
 *     responses:
 *       200:
 *         description: List of all jobs
 */
router.get('/', jobsController.getAllJobs);

/**
 * @swagger
 * /jobs/{id}:
 *   get:
 *     summary: Get jobs of a specific employer
 *     tags: [Jobs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Employer ID
 *     responses:
 *       200:
 *         description: List of jobs posted by the employer
 */
router.get('/:id', jobsController.getEmployerJobs);

/**
 * @swagger
 * /jobs:
 *   post:
 *     summary: Create a new job (Employer only)
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               location:
 *                 type: string
 *               type:
 *                 type: string
 *               salary:
 *                 type: string
 *     responses:
 *       201:
 *         description: Job created successfully
 */
router.post('/', verifyJWT, authorizeRole(['employer']), jobsController.createNewJob);

/**
 * @swagger
 * /jobs/{id}:
 *   patch:
 *     summary: Update a job (Employer only)
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Job ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               location:
 *                 type: string
 *               type:
 *                 type: string
 *               salary:
 *                 type: string
 *     responses:
 *       200:
 *         description: Job updated successfully
 */
router.patch('/:id', verifyJWT, authorizeRole(['employer']), jobsController.updateJob);

/**
 * @swagger
 * /jobs/{id}:
 *   delete:
 *     summary: Delete a job (Employer only)
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Job ID
 *     responses:
 *       200:
 *         description: Job deleted successfully
 */
router.delete('/:id', verifyJWT, authorizeRole(['employer']), jobsController.deleteJob);

module.exports = router;
