# Email Authentication Troubleshooting Guide

## ❌ "Username and Password Not Accepted" Error

This is the most common error when setting up Gmail SMTP with Nodemailer. Here's how to fix it.

## 🔍 Step-by-Step Validation

### Step 1: Test Your Credentials

Run the validation script:

```bash
npm run test-email
```

This script will:
1. ✅ Check if environment variables exist
2. ✅ Verify password format (should be 16 characters, no spaces)
3. ✅ Test SMTP connection to Gmail
4. ✅ Send a test email to info.thecollectivecounsel@gmail.com

### Step 2: Common Fixes

#### 🔴 Problem: Using Regular Gmail Password

**WRONG:**
```env
EMAIL_PASSWORD=MyGmailPassword123
```

**CORRECT:**
```env
EMAIL_PASSWORD=abcdefghijklmnop  # 16-character app password
```

**Solution:**
1. Go to https://myaccount.google.com/apppasswords
2. If you see "App passwords aren't recommended", enable 2FA first:
   - Go to https://myaccount.google.com/security
   - Click "2-Step Verification" → Follow setup
   - Return to app passwords page
3. Select "Mail" → "Other (Custom name)" → Name it "TCC Frontend"
4. Click "Generate"
5. Copy the 16-character password (e.g., `abcd efgh ijkl mnop`)
6. **IMPORTANT:** Remove ALL spaces: `abcdefghijklmnop`
7. Add to `.env.local`:
   ```env
   EMAIL_PASSWORD=abcdefghijklmnop
   ```

#### 🔴 Problem: App Password Has Spaces

Gmail generates passwords like: `abcd efgh ijkl mnop`

**WRONG:**
```env
EMAIL_PASSWORD=abcd efgh ijkl mnop  # Has spaces!
```

**CORRECT:**
```env
EMAIL_PASSWORD=abcdefghijklmnop  # No spaces!
```

#### 🔴 Problem: 2-Factor Authentication Not Enabled

App passwords ONLY work when 2FA is enabled.

**Check:**
1. Go to https://myaccount.google.com/security
2. Look for "2-Step Verification"
3. If it says "Off", click it and enable 2FA

**After enabling 2FA:**
1. Go back to https://myaccount.google.com/apppasswords
2. Generate a new app password
3. Update `.env.local`

#### 🔴 Problem: Wrong Gmail Account

Make sure `EMAIL_USER` matches the account where you generated the app password.

**Check:**
```env
# These MUST be from the SAME Gmail account
EMAIL_USER=yourname@gmail.com
EMAIL_PASSWORD=abcdefghijklmnop  # Generated from yourname@gmail.com
```

#### 🔴 Problem: App Password Revoked/Expired

If you previously generated an app password and it stopped working:

**Solution:**
1. Go to https://myaccount.google.com/apppasswords
2. Find "TCC Frontend" in the list
3. Click "Remove" to revoke the old password
4. Generate a new app password
5. Update `.env.local` with the new password

#### 🔴 Problem: Gmail Account Locked/Security Block

Gmail may block login attempts if it detects suspicious activity.

**Check:**
1. Go to https://myaccount.google.com/notifications
2. Look for security alerts
3. If you see "Suspicious sign-in blocked", click "Review activity"
4. Confirm it was you trying to send emails
5. Try the test script again

**Alternative Check:**
1. Check email for "Critical security alert" from Google
2. Follow the link to review and approve the activity

## 📝 Complete Setup Checklist

Use this checklist to ensure everything is configured correctly:

- [ ] Gmail account has 2-Factor Authentication enabled
- [ ] App password generated at https://myaccount.google.com/apppasswords
- [ ] App password copied with NO spaces (16 characters exactly)
- [ ] `.env.local` file updated with EMAIL_USER and EMAIL_PASSWORD
- [ ] Development server restarted (Ctrl+C and `npm run dev`)
- [ ] Test script executed: `npm run test-email`
- [ ] Test email received at info.thecollectivecounsel@gmail.com

## 🧪 Manual Validation Steps

If the automated test doesn't work, try these manual checks:

### 1. Verify Environment Variables Are Loaded

Create a temporary file `test-env.js`:

```javascript
require('dotenv').config({ path: '.env.local' });
console.log('EMAIL_USER:', process.env.EMAIL_USER);
console.log('EMAIL_PASSWORD:', process.env.EMAIL_PASSWORD);
console.log('Password length:', process.env.EMAIL_PASSWORD?.length);
```

Run: `node test-env.js`

**Expected output:**
```
EMAIL_USER: your-email@gmail.com
EMAIL_PASSWORD: abcdefghijklmnop
Password length: 16
```

### 2. Test Gmail SMTP Directly

Use a simple test (create `test-simple.js`):

```javascript
const nodemailer = require('nodemailer');
require('dotenv').config({ path: '.env.local' });

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
  debug: true,
  logger: true,
});

transporter.verify((error, success) => {
  if (error) {
    console.log('❌ Error:', error);
  } else {
    console.log('✅ Server is ready to send emails');
  }
});
```

Run: `node test-simple.js`

### 3. Check Firewall/Network

Test if port 587 is accessible:

**Windows PowerShell:**
```powershell
Test-NetConnection -ComputerName smtp.gmail.com -Port 587
```

**Expected output:**
```
TcpTestSucceeded : True
```

If `False`, your firewall/network is blocking SMTP.

## 🔧 Advanced Troubleshooting

### Error Code Reference

| Error Code | Meaning | Solution |
|------------|---------|----------|
| `EAUTH` / `535` | Invalid credentials | Use app password, remove spaces |
| `ETIMEDOUT` | Connection timeout | Check firewall, internet connection |
| `ECONNREFUSED` | Connection refused | Check if port 587 is open |
| `ESOCKET` | Socket error | Network issue, try again |
| `EENVELOPE` | Invalid email address | Check EMAIL_USER format |

### Still Not Working?

1. **Try a different port:**
   Update `lib/email.ts`:
   ```typescript
   transporter = nodemailer.createTransport({
     host: 'smtp.gmail.com',
     port: 465,  // Change from 587 to 465
     secure: true,  // Change to true
     auth: {
       user: process.env.EMAIL_USER,
       pass: process.env.EMAIL_PASSWORD,
     },
   });
   ```

2. **Enable "Less secure app access" (Deprecated but might work):**
   - Go to https://myaccount.google.com/lesssecureapps
   - Turn it ON (not recommended, use app passwords instead)

3. **Try a different Gmail account:**
   - Some Gmail accounts have stricter security policies
   - Create a new Gmail account specifically for the app
   - Enable 2FA and generate app password

4. **Check Gmail quotas:**
   - Gmail limits: ~500 emails/day
   - If exceeded, wait 24 hours or use different account

## 📞 Getting Help

If you've tried everything and it still doesn't work:

1. **Run the diagnostic:**
   ```bash
   npm run test-email
   ```
   
2. **Copy the full error message**

3. **Check these details:**
   - Operating system
   - Node.js version (`node --version`)
   - Internet connection type (WiFi, VPN, proxy)
   - Firewall software running

4. **Look for patterns:**
   - Does it fail immediately or after timeout?
   - Same error every time or different errors?
   - Does it work on different network?

## ✅ Success Indicators

You'll know it's working when:

1. Test script shows:
   ```
   ✅ EMAIL_USER: your-email@gmail.com
   ✅ EMAIL_PASSWORD: **************** (16 characters)
   ✅ Transporter created successfully
   ✅ CONNECTION SUCCESSFUL!
   ✅ TEST EMAIL SENT SUCCESSFULLY!
   ```

2. Email arrives at info.thecollectivecounsel@gmail.com

3. Dev server logs show:
   ```
   ✅ Email service connection verified
   ```

## 🎯 Quick Recovery Checklist

If emails suddenly stop working:

- [ ] Check if app password was revoked in Google Account
- [ ] Verify Gmail account not locked/suspended
- [ ] Check internet connection
- [ ] Restart development server
- [ ] Run `npm run test-email` to diagnose
- [ ] Check Gmail quota (500 emails/day limit)
- [ ] Review Gmail security notifications

---

**Need more help?** See [EMAIL_SETUP_GUIDE.md](EMAIL_SETUP_GUIDE.md) for comprehensive documentation.
