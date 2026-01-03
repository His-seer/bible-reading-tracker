import { useState, useEffect, useCallback } from 'react';
import { getAllUsers, getRecentActivities } from '../services/storage';
import { STATS_REFRESH_INTERVAL, MAX_RECENT_ACTIVITIES } from '../utils/constants';
import type { UserProfile, Activity } from '../types';

export function useLeaderboard(uid: string | null | undefined, username: string | null = null) {
  const [participants, setParticipants] = useState<UserProfile[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    // Only fetch data if user is authenticated
    if (!uid) {
      setParticipants([]);
      setActivities([]);
      return;
    }

    try {
      setError(null);
      const [users, acts] = await Promise.all([
        getAllUsers(),
        getRecentActivities(MAX_RECENT_ACTIVITIES),
      ]);
      setParticipants(users);
      setActivities(acts);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load leaderboard';
      setError(message);
      console.error('Error loading leaderboard:', err);
    }
  }, [uid]);

  // Initial load - only when authenticated
  useEffect(() => {
    if (!uid) return;

    setLoading(true);
    loadData().finally(() => setLoading(false));
  }, [loadData, uid]);

  // Refresh at intervals - only when authenticated
  useEffect(() => {
    if (!uid) return;

    const interval = setInterval(() => {
      loadData();
    }, STATS_REFRESH_INTERVAL);

    return () => clearInterval(interval);
  }, [loadData, uid]);

  const getLeaderboardPosition = useCallback((): number => {
    if (!username) return -1;
    const position = participants.findIndex((p) => p.username === username);
    return position >= 0 ? position + 1 : -1;
  }, [participants, username]);

  const getTotalGroupDays = useCallback((): number => {
    return participants.reduce((sum, p) => sum + p.completedDays, 0);
  }, [participants]);

  const refresh = useCallback(async () => {
    setLoading(true);
    await loadData();
    setLoading(false);
  }, [loadData]);

  return {
    participants,
    activities,
    loading,
    error,
    getLeaderboardPosition,
    getTotalGroupDays,
    refresh,
  };
}
