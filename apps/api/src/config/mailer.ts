import nodemailer from 'nodemailer';

const mailPort = Number(process.env.MAIL_PORT) || 2525;

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST || 'sandbox.smtp.mailtrap.io',
  port: mailPort,
  // port 465 = SSL (secure:true), port 587/2525 = TLS (secure:false)
  secure: mailPort === 465,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

export default transporter;
