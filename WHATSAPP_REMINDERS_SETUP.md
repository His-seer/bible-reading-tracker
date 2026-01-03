# WhatsApp Group Reminder Setup Guide

This guide shows you how to send automatic daily reminders to your WhatsApp group with user progress updates.

## Overview

We'll use:
1. **Twilio** - To send WhatsApp messages
2. **Firebase Cloud Functions** - To schedule daily reminders
3. **Firestore** - To fetch user data and generate summaries

Total cost: ~$0.01 per message (Twilio) + Firebase free tier

## Step 1: Setup Twilio WhatsApp

### Create Twilio Account
1. Go to [twilio.com](https://twilio.com)
2. Sign up for free ($15 trial credit)
3. Navigate to Messaging > Try it Out > Send an SMS
4. Keep this page open - you'll need your Account SID and Auth Token

### Enable WhatsApp Sandbox
1. In Twilio Console, go to **Messaging > Try it out > Send a WhatsApp message**
2. Click **Sandbox Settings**
3. You'll see a WhatsApp number assigned (e.g., `+1 415 523 8886`)
4. Join the sandbox:
   - Open WhatsApp on your phone
   - Save the Twilio number in your contacts
   - Send the join code message shown in sandbox (usually just a word like "join" or a specific code)
   - You'll see a confirmation message

### Get WhatsApp Group ID

⚠️ **Important**: WhatsApp sandbox is for ONE person only. For group messages:

**Option A: Use WhatsApp Business API** (Recommended for groups)
- Contact Twilio sales or use the Business API
- Follow: https://www.twilio.com/docs/whatsapp/api

**Option B: Use Sandbox (Single user testing)**
- Continue with this guide for testing
- Upgrade to Business API for production groups

### Copy Your Credentials
In Twilio Console:
1. Copy **Account SID**
2. Copy **Auth Token**
3. Copy **WhatsApp Number** (your sandbox number)

Save these - you'll need them in a moment.

## Step 2: Create Firebase Cloud Function

### Install Firebase CLI
```bash
npm install -g firebase-tools
firebase login
firebase init functions
```

### Create WhatsApp Function

In your Firebase project, create `functions/src/index.ts`:

```typescript
import * as functions from 'firebase-functions';
import { initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import axios from 'axios';

initializeApp();
const db = getFirestore();

const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const TWILIO_WHATSAPP_NUMBER = process.env.TWILIO_WHATSAPP_NUMBER;
const WHATSAPP_RECIPIENT = process.env.WHATSAPP_RECIPIENT; // e.g., "+1234567890"

export const sendDailyBibleReminder = functions
  .region('us-central1')
  .pubsub.schedule('0 9 * * *') // Daily at 9 AM UTC
  .timeZone('UTC')
  .onRun(async (context) => {
    try {
      // Get all users
      const usersSnap = await db.collection('users').get();
      const users = usersSnap.docs.map(doc => ({
        username: doc.data().username,
        completedDays: doc.data().completedDays,
        currentStreak: doc.data().currentStreak
      }));

      // Sort by completed days (leaderboard)
      users.sort((a, b) => b.completedDays - a.completedDays);

      // Create message
      const totalDays = users.reduce((sum, u) => sum + u.completedDays, 0);
      const topUser = users[0];

      const message = `
📖 *Daily Bible Challenge Update*

👥 Total Group Progress: ${totalDays} days completed

🏆 Top Reader: ${topUser.username} (${topUser.completedDays} days, 🔥 Streak: ${topUser.currentStreak})

👥 Participants: ${users.length}

Remember to read today! Check the app to log your reading.

👉 [Open App](https://your-app.vercel.app)
      `.trim();

      // Send via Twilio
      const auth = Buffer.from(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`).toString('base64');

      await axios.post(
        `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`,
        new URLSearchParams({
          From: `whatsapp:${TWILIO_WHATSAPP_NUMBER}`,
          To: `whatsapp:${WHATSAPP_RECIPIENT}`,
          Body: message
        }),
        {
          headers: {
            Authorization: `Basic ${auth}`,
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );

      console.log('WhatsApp reminder sent successfully');
      return { success: true };
    } catch (error) {
      console.error('Error sending WhatsApp reminder:', error);
      throw error;
    }
  });
```

### Update `functions/package.json`:

```json
{
  "dependencies": {
    "firebase-admin": "^12.0.0",
    "firebase-functions": "^5.0.0",
    "axios": "^1.6.0"
  }
}
```

## Step 3: Deploy Function

### Set Environment Variables

```bash
firebase functions:config:set twilio.account_sid="YOUR_ACCOUNT_SID"
firebase functions:config:set twilio.auth_token="YOUR_AUTH_TOKEN"
firebase functions:config:set twilio.whatsapp_number="YOUR_TWILIO_WHATSAPP_NUMBER"
firebase functions:config:set twilio.recipient="+1234567890"
```

### Deploy

```bash
firebase deploy --only functions
```

Verify in Firebase Console > Functions > you should see `sendDailyBibleReminder`

## Step 4: Test the Function

### Manual Trigger (Optional)

```bash
firebase functions:shell
> sendDailyBibleReminder()
```

Or trigger via HTTP by modifying the function to accept a trigger URL.

## Step 5: Monitor

In Firebase Console:
- Go to **Functions** > **sendDailyBibleReminder**
- View logs and execution history
- Check for any errors

## WhatsApp Message Format

The daily message includes:
- 📖 Header
- 👥 Total group days completed
- 🏆 Top reader of the day
- Number of participants
- Link to app

## Customization Options

### Change Time
In the Cloud Function, modify the cron schedule:
```typescript
.pubsub.schedule('0 7 * * *') // 7 AM instead of 9 AM
```

Valid cron format:
```
minute hour day month weekday
0      7    *   *     *       // 7 AM daily
0      9    *   *     1-5     // 9 AM weekdays only
0      19   1   *     *       // 7 PM on 1st of month
```

### Customize Message

Edit the message template to include:
- Percentage to goal
- New participants
- Upcoming milestones
- Bible verses
- Motivational quotes

Example:
```typescript
const completionPercent = Math.round((totalDays / (users.length * 90)) * 100);
const message = `
📖 *Daily Bible Challenge Update* 📖

🎯 Group Progress: ${completionPercent}% toward goal

👥 Participants: ${users.length}

⭐ Today's Top Reader: ${topUser.username} (${topUser.completedDays} days)

Keep up the great work! 🙏
`;
```

## Troubleshooting

### "Permission Denied" when sending

**Solution**: Check Firestore security rules allow Cloud Functions to read:
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read: if true;
      allow write: if true;
    }
  }
}
```

### Message not received

1. **Sandbox timeout**: Twilio sandbox resets if no messages in 3 days
   - Solution: Test send a message via Twilio Console first

2. **Wrong WhatsApp number**: Verify you copied the Twilio number correctly

3. **Recipient not joined**: User didn't send join code to sandbox
   - Solution: Retry join process in WhatsApp

### Function not executing

1. Check **Cloud Functions** logs in Firebase Console
2. Verify cron schedule is correct (3 hyphens for UTC)
3. Check environment variables are set: `firebase functions:config:get`

## Upgrade to Business API (For Production)

For actual WhatsApp group messaging:

1. Request WhatsApp Business API from Twilio
2. Get your business phone number approved
3. Update function to use group/participant numbers
4. Handle message delivery receipts

See: https://www.twilio.com/docs/whatsapp/api

## Alternative: Simple HTTP Endpoint

Instead of scheduled function, create an HTTP endpoint to trigger manually:

```typescript
export const triggerBibleReminder = functions
  .region('us-central1')
  .https.onRequest(async (req, res) => {
    // Same logic as above
    // Call from your app or cron job
  });
```

Then trigger daily from:
- GitHub Actions
- Vercel Cron
- External cron service (cron-job.org)

## Cost

**Monthly costs:**
- Twilio: $1-2 (1-2 messages/day)
- Firebase: Free tier covers this
- **Total: ~$1-2/month**

## Questions?

For Twilio help: https://support.twilio.com/hc/en-us
For Firebase: https://firebase.google.com/support

---

Happy reading and stay connected! 🙏📖
