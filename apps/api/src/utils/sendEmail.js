import transporter from '../config/mailer.js';







const sendEmail = async ({ to, subject, html }) => {
  await transporter.sendMail({
    from: process.env.MAIL_FROM || 'noreply@bigbazaar.com',
    to,
    subject,
    html
  });
};

export default sendEmail;