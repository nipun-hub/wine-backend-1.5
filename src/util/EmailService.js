import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { sendTestEmail } from './emailTemplates.js';

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  secure: false, 
  auth: {
    user: process.env.MAIL_USERNAME,
    pass: process.env.MAIL_PASSWORD,
  },
  tls: {
    ciphers: 'SSLv3'
  }
});

const sendEmail = async (to, subject, html) => {
  const mailOptions = {
    from: process.env.MAIL_FROM_ADDRESS,
    to,
    subject,
    html,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    // console.log(`Email sent successfully: ${to}`, info.response);
   
  } catch (error) {
    console.error(`Error sending email: ${to}`, error);
   
  }
};

const EmailService = {
  async sendTestEmail(to) {
    try {
      const { subject, html } = sendTestEmail();
      await sendEmail(to, subject, html);
      return {
        success: true,
        message: "Test email sent.",
        data: null
      };
      
    } catch (error) {
      return {
        success: false,
        message: error.message,
        otp: null
      };
    }
  },
};

export default EmailService;