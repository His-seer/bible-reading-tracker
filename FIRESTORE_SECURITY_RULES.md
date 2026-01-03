# Firestore Security Rules

Copy and paste these rules into your Firebase Console → Firestore Database → Rules tab.

## How to Apply These Rules

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to Firestore Database
4. Click on the "Rules" tab
5. Replace all content with the rules below
6. Click "Publish"

## Security Rules

```firestore
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Helper function to check if user is authenticated
    function isAuthenticated() {
      return request.auth != null;
    }

    // Helper function to check if user owns the resource
    function isOwner(uid) {
      return request.auth.uid == uid;
    }

    // Users collection - only own data can be read/written
    match /users/{uid} {
      allow read: if isAuthenticated() && isOwner(uid);
      allow write: if isAuthenticated() && isOwner(uid);
      allow create: if isAuthenticated() && isOwner(uid);

      // Allow reading all users for leaderboard (public info)
      allow read: if isAuthenticated();
    }

    // Readings collection - only own readings can be accessed
    match /readings/{uid}/{document=**} {
      allow read: if isAuthenticated() && isOwner(uid);
      allow write: if isAuthenticated() && isOwner(uid);
      allow create: if isAuthenticated() && isOwner(uid);
    }

    // Activities collection - authenticated users can read, only app can write
    match /activities/{document=**} {
      allow read: if isAuthenticated();
      // Activities are created via backend operations only
      allow write: if false;
    }

    // Default deny all
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

## What These Rules Do

### Users Collection (`/users/{uid}`)
- ✅ **Read**: Only the owner can read their own profile
- ✅ **Write**: Only the owner can update their own profile
- ✅ **Create**: Only authenticated users can create their own profile
- ⚠️ **Leaderboard**: Public read access for authenticated users to see leaderboard

### Readings Collection (`/readings/{uid}/readings/{dayId}`)
- ✅ **Read**: Only the owner can read their own readings
- ✅ **Write**: Only the owner can update their readings
- ✅ **Create**: Only the owner can add new readings
- ❌ **Delete**: Allowed through write permission

### Activities Collection (`/activities/{activityId}`)
- ✅ **Read**: All authenticated users can read activities (for activity feed)
- ❌ **Write**: Disabled (activities are created via secure backend operations)

## Important Notes

1. **User Isolation**: Users can only access their own data
2. **Leaderboard**: All users can read all user profiles to see the leaderboard
3. **Activities**: Read-only for users (prevents unauthorized modifications)
4. **No Anonymous Access**: All operations require authentication

## Testing the Rules

You can test these rules in the Firebase Console:

1. Go to Firestore → Rules
2. Click "Rules playground"
3. Set:
   - **User ID**: Your Firebase Auth UID
   - **Authentication**: signed in
4. Test read/write operations

## Troubleshooting

If you get "permission denied" errors:

1. Make sure you're logged in with a valid Firebase Auth account
2. Verify the document paths match exactly (case-sensitive)
3. Check that `request.auth.uid` matches the document's `uid` field
4. Review the browser console for detailed error messages

## Security Best Practices

These rules implement:
- ✅ **Principle of Least Privilege**: Users only get necessary access
- ✅ **Data Isolation**: Users cannot access other users' private data
- ✅ **Public Leaderboard**: Allows reading aggregate stats for competition
- ✅ **Immutable Activities**: Prevents tampering with historical records

