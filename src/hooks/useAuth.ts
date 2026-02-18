import { useState, useEffect } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
} from 'firebase/auth';
import type { User } from 'firebase/auth';
import { auth } from '../services/firebase';
import { createUser, getUser, updateUsername, checkUsernameExists } from '../services/storage';
import type { UserProfile } from '../types';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Detect iOS PWA standalone mode (home screen app)
  const isStandalone =
    ('standalone' in navigator && (navigator as any).standalone === true) ||
    window.matchMedia('(display-mode: standalone)').matches;

  // On mount: handle redirect result from signInWithRedirect (iOS PWA flow)
  useEffect(() => {
    const handleRedirectResult = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result?.user) {
          const firebaseUser = result.user;
          const existingProfile = await getUser(firebaseUser.uid);
          if (!existingProfile) {
            let username = firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User';
            if (username.length < 2) username += Math.floor(Math.random() * 1000);
            const exists = await checkUsernameExists(username);
            if (exists) username += Math.floor(Math.random() * 1000);
            await createUser(firebaseUser.uid, firebaseUser.email || '', username);
            await updateProfile(firebaseUser, { displayName: username });
          }
          setUser(firebaseUser);
          setIsAuthenticated(true);
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : '';
        if (!message.includes('auth/popup-closed-by-user')) {
          console.error('Redirect sign-in error:', err);
        }
      }
    };
    handleRedirectResult();
  }, []);

  // Listen to auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        setLoading(true);
        if (firebaseUser) {
          setUser(firebaseUser);
          setIsAuthenticated(true);

          // Load user profile from Firestore
          const profile = await getUser(firebaseUser.uid);
          if (profile) {
            setUserProfile(profile);
          }
        } else {
          setUser(null);
          setIsAuthenticated(false);
          setUserProfile(null);
        }
        setError(null);
      } catch (err) {
        console.error('Error loading user profile:', err);
        setError('Failed to load your profile');
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const validatePassword = (password: string): string | null => {
    if (password.length < 8) {
      return 'Password must be at least 8 characters';
    }
    if (!/[A-Z]/.test(password)) {
      return 'Password must contain at least one uppercase letter';
    }
    if (!/[0-9]/.test(password)) {
      return 'Password must contain at least one number';
    }
    return null;
  };

  const validateEmail = (email: string): string | null => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return 'Please enter a valid email address';
    }
    return null;
  };

  const signUp = async (email: string, password: string, username: string) => {
    const trimmedEmail = email.trim();
    const trimmedUsername = username.trim();

    // Validation
    if (!trimmedEmail || !password || !trimmedUsername) {
      setError('All fields are required');
      return;
    }

    const emailError = validateEmail(trimmedEmail);
    if (emailError) {
      setError(emailError);
      return;
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    if (trimmedUsername.length < 2) {
      setError('Username must be at least 2 characters');
      return;
    }

    if (trimmedUsername.length > 30) {
      setError('Username must be 30 characters or less');
      return;
    }

    try {
      setError(null);
      setLoading(true);

      // Check username uniqueness
      const usernameExists = await checkUsernameExists(trimmedUsername);
      if (usernameExists) {
        setError('Username is already taken');
        return;
      }

      // Create Firebase Auth user
      const { user: firebaseUser } = await createUserWithEmailAndPassword(auth, trimmedEmail, password);

      // Update profile with username
      await updateProfile(firebaseUser, {
        displayName: trimmedUsername,
      });

      // Create user profile in Firestore
      await createUser(firebaseUser.uid, trimmedEmail, trimmedUsername);

      setUser(firebaseUser);
      setIsAuthenticated(true);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create account';
      let friendlyMessage = message;

      if (message.includes('email-already-in-use')) {
        friendlyMessage = 'This email is already registered';
      } else if (message.includes('weak-password')) {
        friendlyMessage = 'Password is too weak';
      } else if (message.includes('invalid-email')) {
        friendlyMessage = 'Invalid email address';
      }

      setError(friendlyMessage);
      console.error('Error signing up:', err);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    const trimmedEmail = email.trim();

    if (!trimmedEmail || !password) {
      setError('Email and password are required');
      return;
    }

    try {
      setError(null);
      setLoading(true);

      await signInWithEmailAndPassword(auth, trimmedEmail, password);
      setIsAuthenticated(true);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to sign in';
      let friendlyMessage = message;

      if (message.includes('user-not-found') || message.includes('wrong-password') || message.includes('invalid-credential')) {
        friendlyMessage = 'Invalid email or password';
      } else if (message.includes('too-many-requests')) {
        friendlyMessage = 'Too many failed login attempts. Please try again later.';
      }

      setError(friendlyMessage);
      console.error('Error logging in:', err);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setError(null);
      await signOut(auth);
      setUser(null);
      setIsAuthenticated(false);
      setUserProfile(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to sign out';
      setError(message);
      console.error('Error signing out:', err);
    }
  };

  const resetPassword = async (email: string) => {
    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      setError('Email is required');
      return;
    }

    try {
      setError(null);
      setLoading(true);

      await sendPasswordResetEmail(auth, trimmedEmail);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to send reset email';
      let friendlyMessage = message;

      if (message.includes('user-not-found')) {
        friendlyMessage = 'No account found with this email';
      }

      setError(friendlyMessage);
      console.error('Error resetting password:', err);
    } finally {
      setLoading(false);
    }
  };

  const changeUsername = async (newUsername: string) => {
    if (!user) {
      setError('Not logged in');
      return;
    }

    const trimmedUsername = newUsername.trim();

    if (!trimmedUsername) {
      setError('Username cannot be empty');
      return;
    }

    if (trimmedUsername.length < 2 || trimmedUsername.length > 30) {
      setError('Username must be between 2 and 30 characters');
      return;
    }

    try {
      setError(null);
      setLoading(true);

      // Check username uniqueness (excluding current user)
      const usernameExists = await checkUsernameExists(trimmedUsername);
      if (usernameExists && userProfile?.username !== trimmedUsername) {
        setError('Username is already taken');
        return;
      }

      // Update username in Firestore
      await updateUsername(user.uid, trimmedUsername);

      // Update Firebase Auth profile
      await updateProfile(user, {
        displayName: trimmedUsername,
      });

      // Reload profile
      const profile = await getUser(user.uid);
      if (profile) {
        setUserProfile(profile);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to change username';
      setError(message);
      console.error('Error changing username:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    try {
      setError(null);
      setLoading(true);

      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });

      if (isStandalone) {
        // iOS PWA: use redirect flow — page will reload and getRedirectResult() handles the result
        await signInWithRedirect(auth, provider);
        return; // execution stops here; page reloads after redirect
      }

      // Normal browser: use popup
      const result = await signInWithPopup(auth, provider);

      if (result.user) {
        const { user: firebaseUser } = result;

        const existingProfile = await getUser(firebaseUser.uid);
        if (!existingProfile) {
          let username = firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User';
          if (username.length < 2) username += Math.floor(Math.random() * 1000);
          const exists = await checkUsernameExists(username);
          if (exists) username += Math.floor(Math.random() * 1000);
          await createUser(firebaseUser.uid, firebaseUser.email || '', username);
          await updateProfile(firebaseUser, { displayName: username });
        }

        setUser(firebaseUser);
        setIsAuthenticated(true);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to sign in with Google';
      if (!message.includes('auth/popup-closed-by-user')) {
        setError(message);
        console.error('Error signing in with Google:', err);
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    userProfile,
    isAuthenticated,
    loading,
    error,
    signUp,
    login,
    logout,
    resetPassword,
    changeUsername,
    signInWithGoogle,
  };
}
