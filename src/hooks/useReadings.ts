import { useState, useEffect, useCallback } from 'react';
import { getUserReadings, completeReading, updateReading, deleteReading as deleteReadingService } from '../services/storage';
import { calculateStreak } from '../utils/streakCalculator';
import { TOTAL_DAYS } from '../utils/constants';
import type { Reading } from '../types';

export function useReadings(uid: string | null | undefined, username: string | null = null) {
  const [readings, setReadings] = useState<Reading[]>([]);
  const [currentDay, setCurrentDay] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Calculate derived values
  const completedDays = readings.filter((r) => r.completed).length;
  const progressPercentage = Math.min((completedDays / TOTAL_DAYS) * 100, 100);
  const currentStreak = calculateStreak(readings);

  // Load readings on uid change
  useEffect(() => {
    const loadReadings = async () => {
      if (!uid) {
        setReadings([]);
        setCurrentDay(1);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const data = await getUserReadings(uid);
        setReadings(data);

        // Find current day (first uncompleted day or next day)
        let nextDay = 1;
        for (let i = 1; i <= TOTAL_DAYS; i++) {
          const reading = data.find((r) => r.day === i);
          if (!reading || !reading.completed) {
            nextDay = i;
            break;
          }
        }
        if (nextDay <= TOTAL_DAYS) {
          setCurrentDay(nextDay);
        } else {
          setCurrentDay(TOTAL_DAYS);
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to load readings';
        setError(message);
        console.error('Error loading readings:', err);
      } finally {
        setLoading(false);
      }
    };

    loadReadings();
  }, [uid]);

  const saveReading = useCallback(
    async (
      day: number,
      chapters: string,
      summary: string,
      date?: Date
    ): Promise<void> => {
      if (!uid) {
        throw new Error('User ID not set');
      }

      if (!chapters.trim()) {
        throw new Error('Please add the chapters you read today');
      }

      if (day < 1 || day > TOTAL_DAYS) {
        throw new Error('Invalid day number');
      }

      try {
        setError(null);

        const reading: Reading = {
          day,
          chapters: chapters.trim(),
          summary: summary.trim(),
          completed: true,
          date: (date || new Date()).toISOString(),
        };

        const newReadings = [...readings.filter((r) => r.day !== day), reading];
        const newCompletedCount = newReadings.filter((r) => r.completed).length;
        const newStreak = calculateStreak(newReadings);

        // Save to Firebase atomically
        await completeReading(uid, reading, username || 'User', newCompletedCount, newStreak);

        // Update local state
        setReadings(newReadings);

        // Find the actual next uncompleted day (handles gaps from backdating)
        let nextDay = TOTAL_DAYS;
        for (let i = 1; i <= TOTAL_DAYS; i++) {
          const existing = newReadings.find((r) => r.day === i);
          if (!existing || !existing.completed) {
            nextDay = i;
            break;
          }
        }
        setCurrentDay(nextDay);

        return undefined;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to save reading';
        setError(message);
        throw err;
      }
    },
    [uid, username, readings]
  );

  const getCurrentReading = useCallback((): Reading | undefined => {
    return readings.find((r) => r.day === currentDay);
  }, [readings, currentDay]);

  const editReading = useCallback(
    async (day: number, chapters: string, summary: string): Promise<void> => {
      if (!uid) throw new Error('User ID not set');

      try {
        setError(null);
        const reading: Reading = {
          day,
          chapters: chapters.trim(),
          summary: summary.trim(),
          completed: true,
          date: new Date().toISOString(),
        };

        await updateReading(uid, day, reading);

        // Update local state
        setReadings((prev) => {
          const updated = prev.map((r) => (r.day === day ? reading : r));
          return updated;
        });
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to update reading';
        setError(message);
        throw err;
      }
    },
    [uid]
  );

  const deleteReading = useCallback(
    async (day: number): Promise<void> => {
      if (!uid) throw new Error('User ID not set');

      try {
        setError(null);

        // Recalculate without this reading
        const newReadings = readings.filter((r) => r.day !== day);
        const newCompletedCount = newReadings.filter((r) => r.completed).length;
        const newStreak = calculateStreak(newReadings);

        await deleteReadingService(uid, day, newCompletedCount, newStreak);

        // Update local state
        setReadings(newReadings);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to delete reading';
        setError(message);
        throw err;
      }
    },
    [uid, readings]
  );

  return {
    readings,
    currentDay,
    completedDays,
    progressPercentage,
    currentStreak,
    loading,
    error,
    saveReading,
    getCurrentReading,
    setError,
    editReading,
    deleteReading,
  };
}
