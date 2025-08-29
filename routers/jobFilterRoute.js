const express = require("express");
const { getFilteredJobs } = require("../controller/jobFilteredController");

const router = express.Router();

/**
 * @swagger
 * /api/job:
 *   get:
 *     summary: Get a list of filtered jobs
 *     tags: [Jobs]
 *     parameters:
 *       - in: query
 *         name: title
 *         schema:
 *           type: string
 *         description: Filter jobs by title
 *       - in: query
 *         name: location
 *         schema:
 *           type: string
 *         description: Filter jobs by location
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *         description: Filter jobs by type (e.g., Full-time, Part-time)
 *     responses:
 *       200:
 *         description: List of filtered jobs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   title:
 *                     type: string
 *                   company:
 *                     type: string
 *                   location:
 *                     type: string
 *                   type:
 *                     type: string
 *                   salary:
 *                     type: string
 */
router.get("/", getFilteredJobs);

module.exports = router;
