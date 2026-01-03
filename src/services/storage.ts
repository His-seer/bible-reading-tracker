import {
  doc,
  setDoc,
  getDoc,
  collection,
  query,
  orderBy,
  limit,
  getDocs,
  where,
  updateDoc,
  serverTimestamp,
  writeBatch,
} from 'firebase/firestore';
import { db } from './firebase';
import type { UserProfile, Reading, Activity } from '../types';

// User operations
export async function createUser(uid: string, email: string, username: string): Promise<void> {
  const userRef = doc(db, 'users', uid);
  const timestamp = serverTimestamp();
  await setDoc(userRef, {
    uid,
    email,
    username,
    completedDays: 0,
    currentStreak: 0,
    joinedDate: timestamp,
    lastActive: timestamp,
  });
}

export async function getUser(uid: string): Promise<UserProfile | null> {
  try {
    const userRef = doc(db, 'users', uid);
    const snap = await getDoc(userRef);
    if (snap.exists()) {
      const data = snap.data();
      return {
        uid: data.uid,
        email: data.email,
        username: data.username,
        completedDays: data.completedDays || 0,
        currentStreak: data.currentStreak || 0,
        joinedDate: data.joinedDate?.toDate?.()?.toISOString() || new Date().toISOString(),
        lastActive: data.lastActive?.toDate?.()?.toISOString() || new Date().toISOString(),
      };
    }
    return null;
  } catch (error) {
    console.error('Error getting user:', error);
    throw error;
  }
}

export async function checkUsernameExists(username: string): Promise<boolean> {
  try {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('username', '==', username));
    const snapshot = await getDocs(q);
    return !snapshot.empty;
  } catch (error) {
    console.error('Error checking username:', error);
    throw error;
  }
}

export async function updateUsername(uid: string, newUsername: string): Promise<void> {
  try {
    const userRef = doc(db, 'users', uid);
    await updateDoc(userRef, {
      username: newUsername,
      lastActive: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error updating username:', error);
    throw error;
  }
}

export async function updateUserProfile(
  uid: string,
  updates: Partial<UserProfile>
): Promise<void> {
  try {
    const userRef = doc(db, 'users', uid);
    const updateData: Record<string, any> = {
      ...updates,
      lastActive: serverTimestamp(),
    };
    // Don't include joinedDate in updates to preserve the original value
    delete updateData.joinedDate;
    delete updateData.uid;
    delete updateData.email;
    await updateDoc(userRef, updateData);
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
}

// Reading operations
export async function saveReading(uid: string, reading: Reading): Promise<void> {
  try {
    const readingRef = doc(db, 'readings', uid, 'readings', reading.day.toString());
    await setDoc(readingRef, reading);
  } catch (error) {
    console.error('Error saving reading:', error);
    throw error;
  }
}

export async function getUserReadings(uid: string): Promise<Reading[]> {
  try {
    const readingsRef = collection(db, 'readings', uid, 'readings');
    const q = query(readingsRef, orderBy('day', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => doc.data() as Reading);
  } catch (error) {
    console.error('Error getting readings:', error);
    throw error;
  }
}

// Activity operations
export async function postActivity(activity: Activity): Promise<void> {
  try {
    const activityId = `${activity.username}-${activity.day}-${Date.now()}`;
    const activityRef = doc(db, 'activities', activityId);
    await setDoc(activityRef, {
      ...activity,
      timestamp: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error posting activity:', error);
    throw error;
  }
}

export async function getRecentActivities(limitCount: number = 10): Promise<Activity[]> {
  try {
    const activitiesRef = collection(db, 'activities');
    const q = query(activitiesRef, orderBy('timestamp', 'desc'), limit(limitCount));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        username: data.username,
        day: data.day,
        chapters: data.chapters,
        summary: data.summary,
        timestamp: data.timestamp?.toDate?.()?.toISOString() || new Date().toISOString(),
      };
    });
  } catch (error) {
    console.error('Error getting activities:', error);
    throw error;
  }
}

// Leaderboard
export async function getAllUsers(): Promise<UserProfile[]> {
  try {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, orderBy('completedDays', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        uid: doc.id,
        email: data.email || '',
        username: data.username,
        completedDays: data.completedDays || 0,
        currentStreak: data.currentStreak || 0,
        joinedDate: data.joinedDate?.toDate?.()?.toISOString() || new Date().toISOString(),
        lastActive: data.lastActive?.toDate?.()?.toISOString() || new Date().toISOString(),
      };
    });
  } catch (error) {
    console.error('Error getting all users:', error);
    throw error;
  }
}

// Atomic operation for completing a reading
export async function completeReading(
  uid: string,
  reading: Reading,
  username: string,
  newCompletedCount: number,
  newStreak: number
): Promise<void> {
  try {
    const batch = writeBatch(db);

    // Save reading
    const readingRef = doc(db, 'readings', uid, 'readings', reading.day.toString());
    batch.set(readingRef, reading);

    // Update user profile
    const userRef = doc(db, 'users', uid);
    batch.update(userRef, {
      completedDays: newCompletedCount,
      currentStreak: newStreak,
      lastActive: serverTimestamp(),
    });

    // Post activity
    const activityId = `${uid}-${reading.day}-${Date.now()}`;
    const activityRef = doc(db, 'activities', activityId);
    batch.set(activityRef, {
      username,
      day: reading.day,
      chapters: reading.chapters,
      summary: reading.summary,
      timestamp: serverTimestamp(),
    });

    await batch.commit();
  } catch (error) {
    console.error('Error completing reading:', error);
    throw error;
  }
}

// Check if reading exists
export async function readingExists(uid: string, day: number): Promise<boolean> {
  try {
    const readingRef = doc(db, 'readings', uid, 'readings', day.toString());
    const snap = await getDoc(readingRef);
    return snap.exists();
  } catch (error) {
    console.error('Error checking reading:', error);
    return false;
  }
}

// Delete a reading
export async function deleteReading(
  uid: string,
  day: number,
  newCompletedCount: number,
  newStreak: number
): Promise<void> {
  try {
    const batch = writeBatch(db);

    // Delete reading
    const readingRef = doc(db, 'readings', uid, 'readings', day.toString());
    batch.delete(readingRef);

    // Update user profile with new counts
    const userRef = doc(db, 'users', uid);
    batch.update(userRef, {
      completedDays: newCompletedCount,
      currentStreak: newStreak,
      lastActive: serverTimestamp(),
    });

    await batch.commit();
  } catch (error) {
    console.error('Error deleting reading:', error);
    throw error;
  }
}

// Update a reading
export async function updateReading(
  uid: string,
  day: number,
  updates: Partial<Reading>
): Promise<void> {
  try {
    const readingRef = doc(db, 'readings', uid, 'readings', day.toString());
    await updateDoc(readingRef, {
      ...updates,
      date: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error updating reading:', error);
    throw error;
  }
}
