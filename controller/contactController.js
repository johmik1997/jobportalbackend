const nodemailer = require("nodemailer");

const sendContactMessage = async (req, res) => {
  const { firstName, lastName, email, message } = req.body;
  if (!firstName || !lastName || !email || !message) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: `"${firstName} ${lastName}" <${email}>`,
      to: "support@talenthub.com",
      subject: "New Contact Message",
      text: message,
    });

    res.status(200).json({ message: "Message sent successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to send message" });
  }
};

module.exports = { sendContactMessage };
