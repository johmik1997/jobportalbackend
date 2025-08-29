const express = require("express");
const router = express.Router();
const { sendContactMessage } = require("../controller/contactController");

/**
 * @swagger
 * /send/contact:
 *   post:
 *     summary: Send a contact message
 *     tags: [Contact]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - email
 *               - message
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: John
 *               lastName:
 *                 type: string
 *                 example: Doe
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john.doe@example.com
 *               message:
 *                 type: string
 *                 example: I need help with your platform.
 *     responses:
 *       200:
 *         description: Message sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Message sent successfully
 *       400:
 *         description: All fields are required
 *       500:
 *         description: Failed to send message
 */
router.post("/contact", sendContactMessage);

module.exports = router;
