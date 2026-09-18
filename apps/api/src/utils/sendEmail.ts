import transporter from '../config/mailer';

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
}

const sendEmail = async ({ to, subject, html }: SendEmailOptions): Promise<void> => {
  await transporter.sendMail({
    from: process.env.MAIL_FROM || 'noreply@bigbazaar.com',
    to,
    subject,
    html,
  });
};

export default sendEmail;
