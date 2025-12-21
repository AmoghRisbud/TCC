/**
 * Email Service Test Script
 * 
 * Run this script to validate your email configuration before using it in the app
 * Usage: node scripts/test-email.js
 */

const nodemailer = require('nodemailer');
require('dotenv').config({ path: '.env.local' });

console.log('\n🔍 Email Service Validation Test\n');
console.log('=' .repeat(50));

// Step 1: Check environment variables
console.log('\n📋 Step 1: Checking Environment Variables...\n');

const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD;

if (!EMAIL_USER || !EMAIL_PASSWORD) {
  console.error('❌ FAILED: Missing environment variables');
  console.log('\nPlease add these to your .env.local file:');
  console.log('EMAIL_USER=your-gmail@gmail.com');
  console.log('EMAIL_PASSWORD=your-16-char-app-password');
  console.log('\nSee EMAIL_QUICKSTART.md for setup instructions.');
  process.exit(1);
}

console.log('✅ EMAIL_USER:', EMAIL_USER);
console.log('✅ EMAIL_PASSWORD:', '*'.repeat(EMAIL_PASSWORD.length), `(${EMAIL_PASSWORD.length} characters)`);

// Check for common issues
const warnings = [];

if (EMAIL_PASSWORD.includes(' ')) {
  warnings.push('⚠️  Password contains spaces - remove all spaces from app password');
}

if (EMAIL_PASSWORD.length !== 16) {
  warnings.push('⚠️  Password should be exactly 16 characters (Gmail app password)');
}

if (!EMAIL_USER.includes('@gmail.com')) {
  warnings.push('⚠️  Email is not a Gmail address - this script is configured for Gmail SMTP');
}

if (warnings.length > 0) {
  console.log('\n⚠️  WARNINGS:');
  warnings.forEach(w => console.log(w));
}

// Step 2: Create transporter
console.log('\n📋 Step 2: Creating Email Transporter...\n');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASSWORD,
  },
  pool: true,
  maxConnections: 5,
  maxMessages: 100,
  rateDelta: 1000,
  rateLimit: 5,
  debug: true, // Enable debug output
  logger: true, // Enable logging
});

console.log('✅ Transporter created successfully');

// Step 3: Verify connection
console.log('\n📋 Step 3: Verifying SMTP Connection...\n');

transporter.verify()
  .then(() => {
    console.log('✅ CONNECTION SUCCESSFUL!');
    console.log('\nYour email credentials are valid and working.\n');
    
    // Step 4: Send test email
    console.log('📋 Step 4: Sending Test Email...\n');
    
    return transporter.sendMail({
      from: EMAIL_USER,
      to: 'info.thecollectivecounsel@gmail.com',
      subject: '🧪 Test Email from TCC Frontend',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #1a472a 0%, #2d5a3d 100%); color: white; padding: 30px; text-align: center; border-radius: 8px; }
              .content { background: #f9f9f9; padding: 30px; margin-top: 20px; border-radius: 8px; }
              .success { background: #10b981; color: white; padding: 15px; border-radius: 4px; margin: 20px 0; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1 style="margin: 0;">✅ Email Test Successful</h1>
                <p style="margin: 10px 0 0 0; opacity: 0.9;">TCC Frontend Email Service</p>
              </div>
              <div class="content">
                <div class="success">
                  <strong>🎉 Congratulations!</strong> Your email service is configured correctly.
                </div>
                <h3>Test Details:</h3>
                <ul>
                  <li><strong>From:</strong> ${EMAIL_USER}</li>
                  <li><strong>To:</strong> info.thecollectivecounsel@gmail.com</li>
                  <li><strong>Time:</strong> ${new Date().toLocaleString()}</li>
                  <li><strong>Status:</strong> ✅ Delivered Successfully</li>
                </ul>
                <p>Your CV submission emails will now be sent successfully.</p>
                <hr style="margin: 20px 0; border: none; border-top: 1px solid #ddd;">
                <p style="font-size: 12px; color: #666;">
                  This is an automated test email from the TCC Frontend application.
                  If you did not expect this email, you can safely ignore it.
                </p>
              </div>
            </div>
          </body>
        </html>
      `,
    });
  })
  .then((info) => {
    console.log('✅ TEST EMAIL SENT SUCCESSFULLY!\n');
    console.log('Email Details:');
    console.log('  Message ID:', info.messageId);
    console.log('  From:', EMAIL_USER);
    console.log('  To: info.thecollectivecounsel@gmail.com');
    console.log('  Response:', info.response);
    console.log('\n' + '='.repeat(50));
    console.log('\n✅ ALL TESTS PASSED!');
    console.log('\nYour email service is ready to use.');
    console.log('Check info.thecollectivecounsel@gmail.com for the test email.\n');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ FAILED:', error.message);
    console.log('\n' + '='.repeat(50));
    console.log('\n🔧 TROUBLESHOOTING:\n');
    
    if (error.code === 'EAUTH' || error.responseCode === 535) {
      console.log('Authentication Failed - Invalid credentials\n');
      console.log('Common causes:');
      console.log('1. Using regular Gmail password instead of App Password');
      console.log('   → Generate App Password at: https://myaccount.google.com/apppasswords');
      console.log('   → Make sure 2-Factor Authentication is enabled first');
      console.log('\n2. App Password contains spaces');
      console.log('   → Remove ALL spaces from the 16-character password');
      console.log('   → Example: "abcd efgh ijkl mnop" → "abcdefghijklmnop"');
      console.log('\n3. Wrong email address');
      console.log('   → Verify EMAIL_USER matches the account that generated the app password');
      console.log('\n4. App Password was revoked');
      console.log('   → Generate a new app password');
    } else if (error.code === 'ETIMEDOUT' || error.code === 'ECONNECTION') {
      console.log('Connection Failed - Network issue\n');
      console.log('Common causes:');
      console.log('1. No internet connection');
      console.log('2. Firewall blocking SMTP (port 587 or 465)');
      console.log('3. VPN/proxy interfering with connection');
      console.log('4. Gmail SMTP temporarily unavailable');
    } else if (error.code === 'ESOCKET') {
      console.log('Socket Error - Connection issue\n');
      console.log('Try:');
      console.log('1. Check your internet connection');
      console.log('2. Disable VPN/proxy temporarily');
      console.log('3. Check if Gmail is having issues: https://status.google.com');
    } else {
      console.log('Unexpected Error\n');
      console.log('Error Code:', error.code);
      console.log('Error Details:', error);
    }
    
    console.log('\n📚 Full Setup Guide: See EMAIL_SETUP_GUIDE.md');
    console.log('⚡ Quick Start: See EMAIL_QUICKSTART.md\n');
    process.exit(1);
  });
