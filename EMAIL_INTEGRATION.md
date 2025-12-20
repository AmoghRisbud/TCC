# CV Submission Email Integration Guide

## Overview
The CV submission form on the careers page collects candidate information and sends it to `info.thecollectivecounsel@gmail.com`. The current implementation is a mock that logs submissions to the console. To enable actual email sending, you need to integrate an email service.

## Email Service Options

### Option 1: Resend (Recommended)
Modern, developer-friendly email API with good deliverability.

**Setup:**
```powershell
npm install resend
```

**Environment Variables (.env.local):**
```env
RESEND_API_KEY=re_xxxxxxxxxxxxx
```

**Update app/api/careers/submit-cv/route.ts:**
```typescript
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

await resend.emails.send({
  from: 'careers@yourdomain.com', // Must be verified domain
  to: 'info.thecollectivecounsel@gmail.com',
  subject: emailContent.subject,
  html: emailContent.html,
  attachments: emailContent.attachments,
});
```

**Pricing:** Free tier: 3,000 emails/month

---

### Option 2: Nodemailer with Gmail
Use Gmail's SMTP server to send emails.

**Setup:**
```powershell
npm install nodemailer
npm install --save-dev @types/nodemailer
```

**Environment Variables (.env.local):**
```env
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASSWORD=your-app-specific-password
```

**Gmail App Password Setup:**
1. Go to Google Account Settings
2. Security → 2-Step Verification (enable if not already)
3. App passwords → Select "Mail" and "Other (Custom name)"
4. Copy the 16-character password

**Update app/api/careers/submit-cv/route.ts:**
```typescript
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

await transporter.sendMail({
  from: process.env.EMAIL_USER,
  to: 'info.thecollectivecounsel@gmail.com',
  subject: emailContent.subject,
  html: emailContent.html,
  attachments: emailContent.attachments,
});
```

**Limitations:** 
- Gmail's sending limits: ~500 emails/day
- May be flagged as spam if sending volume increases

---

### Option 3: SendGrid
Enterprise-grade email service with high deliverability.

**Setup:**
```powershell
npm install @sendgrid/mail
```

**Environment Variables (.env.local):**
```env
SENDGRID_API_KEY=SG.xxxxxxxxxxxxx
```

**Update app/api/careers/submit-cv/route.ts:**
```typescript
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

await sgMail.send({
  from: 'careers@yourdomain.com', // Must be verified sender
  to: 'info.thecollectivecounsel@gmail.com',
  subject: emailContent.subject,
  html: emailContent.html,
  attachments: emailContent.attachments,
});
```

**Pricing:** Free tier: 100 emails/day

---

## Current Implementation Status

**Location:** `app/api/careers/submit-cv/route.ts`

The API currently:
- ✅ Validates all form inputs
- ✅ Checks file size (max 5MB) and type (PDF, DOC, DOCX)
- ✅ Generates professional HTML email template
- ✅ Converts file to base64 for attachment
- ⚠️ **LOGS TO CONSOLE** (not sending actual emails)

**To Enable Email Sending:**
1. Choose one of the options above
2. Install the required npm package
3. Add environment variables to `.env.local`
4. Uncomment and update the relevant code section in `route.ts`
5. Remove the console.log mock implementation

## Testing

**Development Testing:**
```powershell
# Start the dev server
npm run dev

# Navigate to http://localhost:3000/careers
# Fill out and submit the form
# Check console for logged submissions (current behavior)
```

**Production Testing:**
After integrating email service:
1. Submit a test CV with your own email
2. Verify email arrives at info.thecollectivecounsel@gmail.com
3. Check that attachment is readable
4. Verify all form fields appear correctly in email

## Security Considerations

- ✅ File size validation (max 5MB)
- ✅ File type validation (PDF, DOC, DOCX only)
- ✅ Email format validation
- ✅ Required field validation
- ✅ Base64 encoding for attachments
- ⚠️ Consider adding rate limiting to prevent spam
- ⚠️ Consider adding CAPTCHA for production

## Form Features

**Client Component:** `app/careers/CVSubmissionForm.tsx`

**Fields:**
- Full Name (required)
- Email (required, validated)
- Phone Number (optional)
- CV Upload (required, PDF/DOC/DOCX, max 5MB)
- Message to Hiring Manager (required, textarea)

**UX Features:**
- Real-time file validation
- Upload progress indication
- Success/error messages
- Loading states during submission
- Form reset after successful submission
- Responsive design

## Troubleshooting

**"File too large" error:**
- Current limit: 5MB
- To increase: Update validation in both `CVSubmissionForm.tsx` and `route.ts`

**Email not sending:**
- Check environment variables are set correctly
- Verify API keys are valid
- Check email service dashboard for logs
- Ensure sender email is verified (for Resend/SendGrid)

**Form not submitting:**
- Check browser console for errors
- Verify API endpoint is accessible: `http://localhost:3000/api/careers/submit-cv`
- Check Network tab in DevTools for request/response

## Next Steps

1. **Choose and integrate email service** (recommended: Resend for simplicity)
2. **Add rate limiting** to prevent abuse
3. **Consider adding email notifications** to candidates (auto-reply)
4. **Set up monitoring** for failed email sends
5. **Add analytics** to track submission rates

---

**Last Updated:** December 19, 2025
