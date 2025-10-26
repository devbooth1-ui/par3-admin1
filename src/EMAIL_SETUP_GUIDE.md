# Par 3 Challenge - Email Notification Setup Guide

## Current Configuration
- **Current Email:** devbooth1@yahoo.com
- **Status:** Logging only (ready for email service)
- **Future Domain:** par3challenge.com

## Email Service Options

### Option 1: EmailJS (Easiest - Recommended for now)
1. Go to [emailjs.com](https://www.emailjs.com/)
2. Create free account
3. Create email service (use your Yahoo account)
4. Create email template
5. Update `notificationService.js` with your IDs
6. Uncomment EmailJS section in the code

**Benefits:** 
- Works from client-side
- No backend needed
- Free tier available
- Easy to set up with Yahoo

### Option 2: Par3Challenge.com Domain Setup
1. Register par3challenge.com domain
2. Set up email hosting (Google Workspace, Microsoft 365, or similar)
3. Create admin@par3challenge.com
4. Set up email forwarding to multiple addresses:
   - devbooth1@yahoo.com
   - manager@cypresscreekgolf.com
   - etc.
5. Build backend API for email notifications
6. Update notification service to use API

**Benefits:**
- Professional domain
- Multiple recipients
- Better spam filtering
- More reliable

## Quick Start (EmailJS with Yahoo)

1. **Sign up at EmailJS:**
   ```
   https://www.emailjs.com/
   ```

2. **Add email service:**
   - Select "Yahoo" or "Custom SMTP"
   - Use devbooth1@yahoo.com credentials

3. **Create template:**
   - Subject: "🚨 {{prize_type}} Prize Claim - {{player_name}}"
   - Body: Use the message format from notificationService.js

4. **Update code:**
   - Replace "YOUR_SERVICE_ID" with your service ID
   - Replace "YOUR_TEMPLATE_ID" with your template ID  
   - Replace "YOUR_USER_ID" with your user ID
   - Uncomment the EmailJS section

5. **Test:**
   - Use the `testNotification()` function
   - Check devbooth1@yahoo.com for test email

## Migration Plan

**Phase 1 (Now):** EmailJS + devbooth1@yahoo.com
**Phase 2 (Future):** par3challenge.com + email forwarding
**Phase 3 (Scale):** Custom backend with multiple notification channels

## Files to Update

- `/src/utils/notificationService.js` - Main notification logic
- `/src/pages/OutfitDescription.jsx` - Form submission handler

## Test Commands

In browser console:
```javascript
import { testNotification } from './src/utils/notificationService.js';
testNotification();
```

## Support

For setup help, see the comments in `notificationService.js` or check EmailJS documentation.