# Email Service Setup Guide

This guide explains how to configure the email service for CV submissions and other email functionality in the TCC Frontend application.

## Overview

The application uses **Nodemailer with Gmail SMTP** for sending emails. This includes:
- CV submission emails to `info.thecollectivecounsel@gmail.com`
- Future: Contact form submissions
- Future: Candidate auto-reply confirmations

## Prerequisites

1. A Gmail account for sending emails (e.g., `your-company@gmail.com`)
2. Two-Factor Authentication (2FA) enabled on the Gmail account
3. A Gmail App Password (16-character password for apps)

## Setup Instructions

### Step 1: Enable Two-Factor Authentication

1. Go to your Google Account: https://myaccount.google.com
2. Navigate to **Security** → **2-Step Verification**
3. Follow the prompts to enable 2FA (if not already enabled)

### Step 2: Generate App Password

1. After enabling 2FA, go to https://myaccount.google.com/apppasswords
2. Select **Mail** as the app
3. Select **Other (Custom name)** as the device
4. Enter a name like "TCC Frontend App"
5. Click **Generate**
6. Copy the 16-character password (e.g., `abcd efgh ijkl mnop`)
7. **Important:** Remove spaces when adding to environment variables

### Step 3: Configure Environment Variables

#### For Local Development

Add these variables to your `.env.local` file:

```env
# Email Configuration (Nodemailer with Gmail)
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASSWORD=abcdefghijklmnop  # 16-character app password (no spaces)
```

#### For Production Deployment

Add the same environment variables to your hosting platform:

**Vercel:**
1. Go to Project Settings → Environment Variables
2. Add `EMAIL_USER` with your Gmail address
3. Add `EMAIL_PASSWORD` with your app password
4. Select "Production" environment
5. Save and redeploy

**Netlify:**
1. Go to Site Settings → Environment Variables
2. Add `EMAIL_USER` and `EMAIL_PASSWORD`
3. Save and trigger a new deploy

**AWS/Other Platforms:**
Consult your platform's documentation for setting environment variables.

## Testing the Email Service

### 1. Start the Development Server

```bash
npm run dev
```

### 2. Submit a Test CV

1. Navigate to http://localhost:3000/careers
2. Find a job posting and click "Apply Now"
3. Fill out the CV submission form
4. Upload a test PDF or Word document
5. Submit the form

### 3. Verify Email Delivery

1. Check the inbox of `info.thecollectivecounsel@gmail.com`
2. Verify the email arrived with:
   - Correct subject line: "New CV Submission from [Name]"
   - Formatted HTML content
   - CV attachment (PDF/DOC/DOCX)
   - All candidate details (name, email, phone, message)

### 4. Check Console Logs

In your terminal, you should see:
```
✅ Email service connection verified
✅ CV submission email sent successfully: { name, email, ... }
```

If there are errors, you'll see:
```
❌ Email service verification failed: [error details]
❌ Failed to send CV submission email: [error details]
```

## Troubleshooting

### Error: "Email configuration missing"

**Cause:** Environment variables not set

**Solution:**
1. Verify `.env.local` contains `EMAIL_USER` and `EMAIL_PASSWORD`
2. Restart the development server (`Ctrl+C` and `npm run dev`)
3. Check for typos in variable names

### Error: "Invalid login: 535-5.7.8 Username and Password not accepted"

**Cause:** Incorrect credentials or not using app password

**Solution:**
1. Verify you're using the **app password**, not your regular Gmail password
2. Remove any spaces from the app password
3. Generate a new app password if needed
4. Ensure 2FA is enabled on the Gmail account

### Error: "Email service verification failed"

**Cause:** Network issues or Gmail SMTP blocked

**Solution:**
1. Check your internet connection
2. Verify Gmail SMTP is not blocked by firewall/antivirus
3. Try accessing https://smtp.gmail.com:587 to check connectivity
4. Check Gmail account for security alerts

### Error: "Failed to send email. Please try again later."

**Cause:** Transient network issue or Gmail rate limit

**Solution:**
1. Wait a few minutes and try again
2. Check Gmail sending limits (500 emails/day)
3. Verify the Gmail account is not suspended
4. Check server logs for detailed error messages

### Emails Going to Spam

**Solutions:**
1. Add sender email to allowed senders in receiving account
2. Ensure receiving email account marks first email as "Not Spam"
3. Consider using a professional email service (Resend/SendGrid) for better deliverability
4. Set up SPF/DKIM records for your domain (advanced)

## Gmail Sending Limits

Gmail SMTP has the following limitations:

- **Daily Limit:** ~500 emails per day
- **Rate Limit:** ~5 emails per second (configured in `lib/email.ts`)
- **Attachment Size:** Max 25MB per email (app limits to 5MB)

If you expect higher volume, consider migrating to:
- **Resend:** 3,000 emails/month free
- **SendGrid:** 100 emails/day free
- **AWS SES:** $0.10 per 1,000 emails

## Security Best Practices

### ✅ DO:
- Use app-specific passwords (never regular Gmail password)
- Keep environment variables in `.env.local` (git-ignored)
- Use secrets management in production (Vercel/Netlify/AWS)
- Rotate app passwords periodically
- Monitor for suspicious activity in Gmail account

### ❌ DON'T:
- Commit `.env.local` to version control
- Share app passwords in public channels
- Use the same password across multiple apps
- Disable 2FA after generating app password

## Production Considerations

### Before Going Live:

- [ ] Verify environment variables set in production
- [ ] Test email delivery from production environment
- [ ] Check spam score of sent emails (use https://www.mail-tester.com)
- [ ] Set up error monitoring/alerting for failed sends
- [ ] Document email sending limits for team
- [ ] Consider implementing rate limiting to prevent abuse
- [ ] Add CAPTCHA to CV submission form

### Monitoring:

The application logs email sending events to the console:

```typescript
// Success
console.log('✅ CV submission email sent successfully:', { ... });

// Failure
console.error('❌ Failed to send CV submission email:', error);
```

Set up alerts for failed email sends (503 status codes) in your logging platform.

## Migrating to Other Email Services

If you need to switch from Gmail to another provider:

### Resend (Recommended for Scale)

1. Install: `npm install resend`
2. Update `lib/email.ts` to use Resend API
3. Replace environment variables: `RESEND_API_KEY`
4. See [EMAIL_INTEGRATION.md](EMAIL_INTEGRATION.md) for complete guide

### SendGrid

1. Install: `npm install @sendgrid/mail`
2. Update `lib/email.ts` to use SendGrid API
3. Replace environment variables: `SENDGRID_API_KEY`
4. See [EMAIL_INTEGRATION.md](EMAIL_INTEGRATION.md) for complete guide

## Support

If you encounter issues not covered in this guide:

1. Check the detailed error logs in terminal/console
2. Review [EMAIL_INTEGRATION.md](EMAIL_INTEGRATION.md) for alternative setup options
3. Contact the development team with error details
4. Email info.thecollectivecounsel@gmail.com for urgent issues

---

**Last Updated:** December 21, 2025
**Version:** 1.0.0
