export interface UserProfile {
  uid: string;
  email: string;
  username: string;
  completedDays: number;
  currentStreak: number;
  joinedDate: string;
  lastActive: string;
}

export interface Reading {
  day: number;
  chapters: string;
  summary: string;
  completed: boolean;
  date: string;
}

export interface Activity {
  username: string;
  day: number;
  chapters: string;
  summary: string;
  timestamp: string;
}

export interface Stats {
  currentDay: number;
  completedDays: number;
  currentStreak: number;
  rank: number;
  totalParticipants: number;
}
