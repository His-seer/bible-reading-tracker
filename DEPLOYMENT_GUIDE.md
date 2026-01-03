# Deployment Guide - Bible Reading Tracker

## Overview

Your app is ready to deploy! This guide will walk you through getting it live on Vercel in about 5-10 minutes.

## Step 1: Setup Firebase (5 minutes)

### Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click "Add project"
3. Name it "bible-reading-tracker"
4. Continue with default settings
5. Wait for project creation

### Enable Firestore
1. In Firebase Console, click **Firestore Database** in left menu
2. Click **Create database**
3. Select **Production mode**
4. Choose location closest to you
5. Click **Enable**

### Get Firebase Credentials
1. Go to **Project Settings** (gear icon, top left)
2. Click **General** tab
3. Scroll down to find your config (looks like a code block)
4. Copy these 6 values:
   - `apiKey`
   - `authDomain`
   - `projectId`
   - `storageBucket`
   - `messagingSenderId`
   - `appId`

### Set Firestore Rules
1. In **Firestore Database** > **Rules** tab
2. Replace everything with:
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```
3. Click **Publish**

## Step 2: Push to GitHub (3 minutes)

1. **Initialize Git**
   ```bash
   cd bible-reading-tracker
   git init
   git add .
   git commit -m "Initial commit: Bible reading tracker"
   ```

2. **Create GitHub Repository**
   - Go to [github.com/new](https://github.com/new)
   - Create repo named "bible-reading-tracker"
   - **Don't** initialize with README
   - Click **Create repository**

3. **Push Code**
   ```bash
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/bible-reading-tracker.git
   git push -u origin main
   ```

## Step 3: Deploy on Vercel (2 minutes)

1. **Create Vercel Account**
   - Go to [vercel.com](https://vercel.com)
   - Sign up with GitHub
   - Authorize Vercel

2. **Import Project**
   - Click "New Project"
   - Select your "bible-reading-tracker" repo
   - Click "Import"

3. **Add Environment Variables**
   - Find "Environment Variables" section
   - Add these 6 variables with your Firebase values:
     - `VITE_FIREBASE_API_KEY`
     - `VITE_FIREBASE_AUTH_DOMAIN`
     - `VITE_FIREBASE_PROJECT_ID`
     - `VITE_FIREBASE_STORAGE_BUCKET`
     - `VITE_FIREBASE_MESSAGING_SENDER_ID`
     - `VITE_FIREBASE_APP_ID`
   - For each variable, set scope to: Production, Preview, Development

4. **Deploy**
   - Click "Deploy"
   - Wait ~2 minutes for build to complete
   - You'll see "Congratulations! Your project has been successfully deployed"
   - Click the URL to visit your live app!

## Step 4: Share with Others

Your app is now live! Share the URL with others to start the challenge:

```
https://your-project.vercel.app
```

## Testing the Live App

1. **Visit your URL**
2. **Sign up with a username** (e.g., "John")
3. **Add today's reading**
   - Chapters: "Genesis 1"
   - Insight: "Amazing creation story"
   - Click "Complete Day 1"
4. **Check Leaderboard** - You should see yourself listed
5. **In another browser tab/window**:
   - Sign up with different username (e.g., "Jane")
   - Add a reading
   - See both users on leaderboard!

## Troubleshooting

### Build Fails on Vercel
- Check all 6 Firebase variables are added
- Verify no typos in variable names
- Rebuild: Click "Deployments" > "..." > "Redeploy"

### "Permission Denied" Error
- Go to Firebase Console > Firestore > Rules
- Make sure you added the security rules
- Click "Publish" after updating rules

### "API Key Invalid"
- Double-check your Firebase credentials
- Make sure you copied all 6 values correctly
- Check for extra spaces in variable values

### App shows loading forever
- Open browser Developer Tools (F12)
- Check Console for errors
- Most likely Firebase credentials issue

## Next: Invite Others

Once you verify it works:

1. **Share the URL** with your group
2. **Everyone signs up** with their name
3. **Track readings together** for 90 days
4. **Celebrate on the leaderboard** 🎉

## Optional: Custom Domain

To use your own domain instead of vercel app:

1. Go to your Vercel project > Settings > Domains
2. Add your domain
3. Follow DNS instructions
4. Wait for SSL certificate (automated)

## Optional: GitHub Updates

To make changes and auto-deploy:

```bash
# Make changes locally
git add .
git commit -m "Description of changes"
git push origin main
```

Vercel automatically deploys on every push to main!

## Support

If something isn't working:

1. **Check Firestore Rules** - Most common issue
2. **Check Firebase Credentials** - Second most common
3. **Check Browser Console** - Press F12, look for error messages
4. **Rebuild on Vercel** - Sometimes helps

## Performance Monitoring

To check how your app is performing:

1. In Vercel dashboard: **Analytics**
   - Shows visitor counts, response times
2. In Firebase Console: **Firestore**
   - Shows read/write operations
   - Storage usage

## Cost

- Firebase: Free tier is 50K reads/day + 1GB storage
- Vercel: Free tier includes unlimited deployments
- **Total: $0/month** (unless you exceed free limits)

Congratulations! Your app is live! 🚀

Questions? Check the README.md in the project root.
