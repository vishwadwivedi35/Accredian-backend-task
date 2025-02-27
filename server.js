require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");
const nodemailer = require("nodemailer");

const app = express();
const prisma = new PrismaClient();

app.use(express.json());
app.use(cors());

app.post("/api/refer", async (req, res) => {
  try {
    const { referrerName, referrerEmail, refereeName, refereeEmail } = req.body;

    const referral = await prisma.referral.create({
      data: { referrerName, referrerEmail, refereeName, refereeEmail },
    });

    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASS,
      },
    });

    let mailOptions = {
      from: process.env.EMAIL,
      to: refereeEmail,
      subject: "Referral Received",
      text: `${referrerName} has referred you to our course!`,
    };

    await transporter.sendMail(mailOptions);

    res.status(201).json({ message: "Referral submitted successfully!" });
  } catch (error) {
    res.status(500).json({ error: "Error submitting referral" });
  }
});

app.listen(5000, () => console.log("Server running on port 5000"));
