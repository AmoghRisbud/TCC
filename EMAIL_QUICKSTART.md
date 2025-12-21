# Email Service - Quick Start

## ⚡ Quick Setup (5 minutes)

### 1. Get Gmail App Password

1. Visit: https://myaccount.google.com/apppasswords
2. Select "Mail" → "Other (Custom name)"
3. Name it "TCC Frontend"
4. Copy the 16-character password (remove spaces)

### 2. Update .env.local

```env
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASSWORD=abcdefghijklmnop
```

### 3. Restart Server

```bash
# Stop server (Ctrl+C)
npm run dev
```

### 4. Test

1. Go to http://localhost:3000/careers
2. Submit a test CV
3. Check `info.thecollectivecounsel@gmail.com` for email

## ✅ Success Signs

Terminal shows:
```
✅ Email service connection verified
✅ CV submission email sent successfully
```

## ❌ Common Issues

**"Email configuration missing"**
→ Add EMAIL_USER and EMAIL_PASSWORD to .env.local, restart server

**"Invalid login"**
→ Use App Password (not regular password), remove spaces

**"Email service verification failed"**
→ Check internet connection, verify Gmail credentials

## 📚 Full Documentation

See [EMAIL_SETUP_GUIDE.md](EMAIL_SETUP_GUIDE.md) for complete instructions.

## 🚀 Production Deployment

Add these environment variables to your hosting platform:
- `EMAIL_USER`: Your Gmail address
- `EMAIL_PASSWORD`: Your Gmail app password

Then deploy!
