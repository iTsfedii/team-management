const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,    // ← Should say this
    pass: process.env.EMAIL_PASS     // ← Should say this
  }
});

async function sendLoginEmail(userEmail, userName) {
  console.log('📧 Attempting to send email to:', userEmail);
  
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: userEmail,
    subject: 'Login Notification - Team Management',
    html: `
      <h2>Hello ${userName}!</h2>
      <p>You successfully logged into Team Management App.</p>
      <p>Login time: ${new Date().toLocaleString()}</p>
      <p>If this wasn't you, please contact support immediately.</p>
      <br>
      <p>Best regards,<br>Team Management Team</p>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('✅ Email sent successfully to:', userEmail);
    return { success: true };
  } catch (error) {
    console.error('❌ Email sending failed:', error.message);
    return { success: false, error: error.message };
  }
}

module.exports = { sendLoginEmail };
