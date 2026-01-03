import type { Reading } from '../types';

/**
 * Calculates the current streak of consecutive days
 * A streak is consecutive calendar days (not day numbers)
 * Streak breaks if there's a gap > 1 day from today
 */
export function calculateStreak(readings: Reading[]): number {
  if (readings.length === 0) return 0;

  // Filter completed readings and sort by date, most recent first
  const completedReadings = readings
    .filter((r) => r.completed)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  if (completedReadings.length === 0) return 0;

  // Normalize dates to midnight for comparison
  const getMidnightDate = (date: string | Date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
  };

  const today = getMidnightDate(new Date());
  const mostRecentDate = getMidnightDate(completedReadings[0].date);

  // Calculate days since most recent reading
  const daysSinceLastReading = Math.floor((today.getTime() - mostRecentDate.getTime()) / (1000 * 60 * 60 * 24));

  // If last reading was more than 1 day ago, streak is broken
  if (daysSinceLastReading > 1) {
    return 0;
  }

  // Count consecutive days backwards
  let streak = 1;
  for (let i = 1; i < completedReadings.length; i++) {
    const currentDate = getMidnightDate(completedReadings[i].date);
    const previousDate = getMidnightDate(completedReadings[i - 1].date);

    // Calculate day difference
    const daysDiff = Math.floor((previousDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24));

    // If exactly 1 day apart, continue streak
    if (daysDiff === 1) {
      streak++;
    } else {
      // Gap > 1 day, streak broken
      break;
    }
  }

  return streak;
}

/**
 * Get milestone message based on completed days
 */
export function getMilestoneMessage(completedDays: number): string {
  if (completedDays === 90) return '🏆 CHALLENGE COMPLETE! Amazing!';
  if (completedDays === 60) return '🔥 60 Days! You\'re on Fire!';
  if (completedDays === 30) return '🎉 30 Days Complete! One Month Strong!';
  if (completedDays % 7 === 0 && completedDays > 0) {
    return `✨ ${completedDays} Days! One Week Milestone!`;
  }
  return '⭐ Great Progress!';
}
