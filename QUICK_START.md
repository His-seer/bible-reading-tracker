# Quick Start Guide - Deployment

Get your app live in 10 minutes!

## Prerequisites

- ✅ Firebase project created
- ✅ Firebase CLI installed (`npm install -g firebase-tools`)
- ✅ App builds successfully (`npm run build` ✓)

---

## Step-by-Step Deployment

### 1️⃣ Configure Firebase (2 min)

**A. Enable Email/Password Authentication**

```
Firebase Console → Select Project → Authentication
↓
Sign-in method → Email/Password → Enable → Save
```

**B. Apply Firestore Security Rules**

```
Firebase Console → Firestore Database → Rules
↓
Copy all content from FIRESTORE_SECURITY_RULES.md
↓
Paste → Publish
```

### 2️⃣ Build Your App (1 min)

```bash
npm run build
```

✓ No errors? You're good!

### 3️⃣ Deploy (1 min)

```bash
firebase login
firebase deploy
```

Done! Your app is live at `https://your-project.web.app`

---

## Test It Works (3 min)

1. **Open the link** - You should see the login screen
2. **Sign up** - Create an account
3. **Add a reading** - Complete a day
4. **Logout** - Click your profile
5. **Login again** - Verify it worked

---

## Share with Users

Give them this URL: `https://your-project.web.app`

They can:
- Sign up with email
- Track Bible readings
- See leaderboard
- Compete with others

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| "Permission denied" on signup | Apply Firestore rules (see Step 1B) |
| Blank login page | Check Firebase config in `.env.local` |
| Can't complete reading | Check Firestore rules allow writes |
| Settings won't update | Verify Email/Password auth is enabled |

---

## Monitor Your App

After deployment, check:

```
Firebase Console → Project Settings → Usage & Quota
```

- Watch for errors
- Monitor user signups
- Check quota usage

---

## Need Help?

See full guides:
- **FIRESTORE_SECURITY_RULES.md** - Security & setup
- **DEPLOYMENT_TESTING_GUIDE.md** - Detailed testing
- **IMPLEMENTATION_SUMMARY.md** - What was built

---

## Key Features Users Get

✅ **Sign up** with email & password
✅ **Track** 90 days of Bible reading
✅ **Compete** on leaderboard
✅ **View history** of all readings
✅ **Manage profile** (change username)
✅ **Reset password** if forgotten
✅ **See activity feed** of others

---

## Success! 🎉

Your Bible Reading Tracker is now live and ready for multiple users!

Next: Share the link and start tracking! 📖
