# Deployment & Testing Guide

This guide covers deploying your Bible Reading Tracker with the new login system.

## Pre-Deployment Checklist

- [ ] All code changes committed to git
- [ ] Firebase project created and configured
- [ ] Firestore security rules applied
- [ ] Environment variables set up
- [ ] App builds without errors
- [ ] All core features tested locally

## Step 1: Set Up Firestore Security Rules

1. Open [Firebase Console](https://console.firebase.google.com/)
2. Select your project → Firestore Database
3. Click "Rules" tab
4. Copy all rules from `FIRESTORE_SECURITY_RULES.md`
5. Paste into Rules editor
6. Click "Publish"

## Step 2: Enable Email/Password Authentication

1. Go to Firebase Console → Authentication
2. Click "Sign-in method"
3. Enable "Email/Password" provider
4. Click "Save"

## Step 3: Environment Variables

Verify `.env.local` has all required Firebase variables:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

## Step 4: Build for Production

```bash
npm run build
```

## Step 5: Deploy

### Firebase Hosting (Recommended)

```bash
npm install -g firebase-tools
firebase login
firebase deploy
```

Your app will be at: `https://your-project.web.app`

---

## Testing Checklist

### Authentication Flow

#### New User Signup
- [ ] Navigate to app
- [ ] Click "Sign Up" tab
- [ ] Enter email: `testuser@example.com`
- [ ] Enter username: `TestUser`
- [ ] Enter password: `SecurePass123`
- [ ] Confirm password matches
- [ ] Accept terms & conditions
- [ ] Click "Create Account"
- [ ] Should redirect to main app
- [ ] Username appears in header

#### Existing User Login
- [ ] Click "Login" tab
- [ ] Enter email: `testuser@example.com`
- [ ] Enter password: `SecurePass123`
- [ ] Click "Sign In"
- [ ] Should load main app with data

#### Password Reset
- [ ] Click "Forgot password?"
- [ ] Enter email: `testuser@example.com`
- [ ] Click "Send Reset Link"
- [ ] Check email for link
- [ ] Click link to reset password
- [ ] Set new password
- [ ] Try login with new password

#### Logout
- [ ] Click user avatar (top right)
- [ ] Click "Logout"
- [ ] Should return to login screen

#### Session Persistence
- [ ] Login to app
- [ ] Refresh browser (Ctrl+R)
- [ ] Still logged in?
- [ ] Close tab completely
- [ ] Reopen browser
- [ ] Navigate to app URL
- [ ] Still logged in?

### Settings Modal

- [ ] Click avatar → "Settings"
- [ ] Verify username and email display
- [ ] Enter new username: `UpdatedUser`
- [ ] Click "Update Username"
- [ ] Check success message
- [ ] Verify header shows new username
- [ ] Logout and login again
- [ ] Verify new username persists

### Bible Reading Features

#### Complete Reading
- [ ] Click "My Progress" tab
- [ ] Fill chapters: `Genesis 1-2`
- [ ] Add summary (optional)
- [ ] Click "Complete"
- [ ] See celebration animation
- [ ] Check progress increased

#### Edit Reading
- [ ] Scroll to Reading History
- [ ] Click edit icon
- [ ] Modify chapters to `Genesis 3-4`
- [ ] Save changes
- [ ] Verify updated in list

#### Delete Reading
- [ ] Click delete icon
- [ ] Confirm deletion
- [ ] Verify removed from list
- [ ] Check progress decreased

#### Leaderboard
- [ ] Click "Leaderboard & Activity"
- [ ] See all users ranked by progress
- [ ] Your name highlighted?
- [ ] Activity feed shows recent actions?

### Multi-User Testing

**User A:**
1. Signup with `usera@test.com` / `UserA`
2. Complete readings for 5 days
3. Note your leaderboard position

**User B:**
1. Signup with `userb@test.com` / `UserB`
2. Complete readings for 10 days
3. Verify UserB ranked above UserA

**User A:**
1. Refresh page
2. Verify UserB above in leaderboard
3. Complete 6 more readings (total 11)
4. Refresh - verify back above UserB

### Mobile Responsiveness

#### Small Screen (iPhone - 375px)
- [ ] LoginScreen fits without scrolling
- [ ] All form inputs clickable
- [ ] Buttons full-width and touch-friendly
- [ ] No horizontal scrolling

#### Medium Screen (iPad - 768px)
- [ ] Layout properly centered
- [ ] Stats cards display well
- [ ] Buttons properly sized

#### Large Screen (Desktop - 1024px+)
- [ ] Optimal width with max-w-7xl
- [ ] Layout looks professional
- [ ] All elements aligned properly

### Accessibility

#### Keyboard Navigation
- [ ] Tab moves through form fields
- [ ] Tab moves through buttons
- [ ] Enter submits forms
- [ ] Escape closes modals
- [ ] Focus indicators visible (blue ring)

#### Mobile Device Testing
Test on actual devices or emulators:
- [ ] iPhone (test on actual device if possible)
- [ ] Android (test on actual device if possible)
- [ ] Tablet (test on actual device if possible)

### Error Scenarios

#### Invalid Email
- [ ] Try: `notanemail`
- [ ] Should show error: "invalid email"
- [ ] Cannot submit

#### Weak Password
- [ ] Try: `password` (too weak)
- [ ] Should show strength indicator
- [ ] Error: "Password must contain..."

#### Duplicate Email
- [ ] Signup with `test@example.com`
- [ ] Try signup again with same email
- [ ] Should show: "email already in use"

#### Duplicate Username
- [ ] Signup user with username `John`
- [ ] From different email, try username `John`
- [ ] Should show: "Username is already taken"

#### Network Error
- [ ] Disconnect internet
- [ ] Try to login
- [ ] Should show network error
- [ ] Reconnect and try again

### Performance

#### Build Size
```bash
npm run build
```
Check output - target < 300KB gzipped

#### Load Times
- [ ] Login page: < 2 seconds
- [ ] After login: < 3 seconds
- [ ] Tab switches: < 500ms

---

## Deployment Checklist

Before going live:

### Code Quality
- [ ] No console errors
- [ ] No TypeScript errors (`npm run type-check`)
- [ ] All dependencies up to date

### Functionality
- [ ] All auth flows work
- [ ] Can complete readings
- [ ] Can edit/delete readings
- [ ] Leaderboard updates
- [ ] Settings work
- [ ] Logout works

### Security
- [ ] Firestore rules applied
- [ ] Email/Password auth enabled
- [ ] No secrets in code
- [ ] No sensitive data in localStorage

### Mobile
- [ ] Works on iPhone
- [ ] Works on Android
- [ ] Touch interactions work
- [ ] No layout issues

### Performance
- [ ] Build succeeds
- [ ] Bundle size reasonable
- [ ] Load time acceptable

---

## Launch Sequence

1. **Test Locally**: Run `npm run dev` and test thoroughly
2. **Build**: Run `npm run build` and verify no errors
3. **Deploy Staging**: Deploy to staging URL first
4. **Test Staging**: Repeat full test suite on staging
5. **Deploy Production**: Run `firebase deploy` for production
6. **Smoke Test**: Test key flows on production
7. **Share Link**: Give users the public URL
8. **Monitor**: Watch Firebase Console for errors

---

## After Launch

### Monitor These Metrics
- User signup rate
- Daily active users
- Errors in console
- Firebase quota usage
- Page load times

### Maintain Regular Checkups
- Weekly: Check for error spikes
- Monthly: Review usage patterns
- Monthly: Update dependencies

---

## Quick Reference

### Common Issues & Fixes

| Issue | Solution |
|-------|----------|
| "Permission denied" | Check Firestore rules |
| Blank login page | Check Firebase config in `.env.local` |
| Can't create account | Verify Email/Password auth is enabled |
| Readings not saving | Check Firestore rules allow user writes |
| Settings won't update | Verify user document exists in Firestore |

### Support Links
- [Firebase Docs](https://firebase.google.com/docs)
- [Firestore Security](https://firebase.google.com/docs/firestore/security/start)
- [Firebase Auth](https://firebase.google.com/docs/auth)

Good luck! 🚀
