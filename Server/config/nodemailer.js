const nodeMailer = require('nodemailer');

// Create a transporter
let transporter = nodeMailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.SMTP_USER,
      pass:  process.env.SMTP_PASSWORD,
    }
  });


module.exports = transporter;



// Steps to Generate a Gmail App Password (One-Time Setup)

// Go to: https://myaccount.google.com/security

// Scroll to "Signing in to Google" → Click on "App passwords"

// Sign in again (if prompted)

// Under “Select the app”, choose:

// App: Mail

// Device: Other (Custom name) → enter something like "Nodemailer"

// Click Generate

// Google will show you a 16-character password — copy this (no spaces)

//if apppasswords is no visible 

// Turn off “Skip password when possible”

// Make sure you log in using password + 2FA prompt/OTP, not just passkeys

// Wait ~1 hour if 2FA was just enabled

// Try again at: https://myaccount.google.com/apppasswords

//genrate and use that inside password 