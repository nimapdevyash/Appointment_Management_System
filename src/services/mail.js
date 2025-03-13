const nodemailer = require("nodemailer");

async function sendMail({ email, subject, text }) {
  try {
    const transporter = nodemailer.createTransport({
      port: 465,
      service: "gmail",
      secure: true,
      auth: {
        user: process.env.GMAIL_ID,
        pass: process.env.GMAIL_PASS,
      },
    });

    const transport = {
      from: process.env.GMAIL_ID,
      to: email,
      subject,
      text,
    };

    await transporter.sendMail(transport);
  } catch (error) {
    console.log("error while sending mail : ", error);
  }
}

module.exports = sendMail;
