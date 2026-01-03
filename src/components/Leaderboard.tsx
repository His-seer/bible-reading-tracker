import { Trophy } from 'lucide-react';
import Card from './ui/Card';
import type { UserProfile } from '../types';

interface LeaderboardProps {
  participants: UserProfile[];
  currentUsername: string | null;
  totalGroupDays: number;
}

export function Leaderboard({ participants, currentUsername, totalGroupDays }: LeaderboardProps) {
  const getMedalColor = (index: number): string => {
    if (index === 0) return 'bg-warning-400 text-white shadow-sm shadow-warning-200';
    if (index === 1) return 'bg-neutral-300 text-white shadow-sm shadow-neutral-200';
    if (index === 2) return 'bg-orange-400 text-white shadow-sm shadow-orange-200';
    return 'bg-neutral-100 text-neutral-500';
  };

  return (
    <Card variant="elevated" padding="lg" className="h-[600px] flex flex-col">
      <h3 className="text-xl font-bold text-neutral-800 mb-6 flex items-center gap-2.5">
        <Trophy className="w-6 h-6 text-warning-500 fill-warning-500/10" />
        Leaderboard
      </h3>

      <div className="mb-6 p-5 bg-gradient-to-br from-primary-600 to-secondary-600 rounded-2xl text-white shadow-lg shadow-primary-500/30">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-3xl font-black">{totalGroupDays}</div>
            <div className="text-[10px] font-bold uppercase tracking-widest opacity-80">Total Days Completed</div>
          </div>
          <Trophy className="w-10 h-10 opacity-20" />
        </div>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto pr-2 custom-scrollbar">
        {participants.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-10 opacity-60">
            <Trophy className="w-16 h-16 text-neutral-300 mb-4" />
            <p className="text-neutral-500 font-medium">No participants yet.</p>
            <p className="text-neutral-400 text-sm mt-1">Be the first to join the challenge!</p>
          </div>
        ) : (
          participants.map((participant, index) => (
            <div
              key={participant.username}
              className={`p-4 rounded-2xl flex items-center justify-between transition-all duration-300 border-2 ${participant.username === currentUsername
                ? 'bg-primary-50 border-primary-200 shadow-sm relative overflow-hidden'
                : 'bg-white border-neutral-100 hover:border-neutral-200 hover:bg-neutral-50 shadow-sm'
                }`}
            >
              {participant.username === currentUsername && (
                <div className="absolute top-0 right-0 p-1">
                  <div className="bg-primary-500 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-bl-lg rounded-tr-lg uppercase tracking-wider">You</div>
                </div>
              )}
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-lg ${getMedalColor(index)}`}>
                  {index + 1}
                </div>
                <div>
                  <div className="font-bold text-neutral-900 text-base leading-tight">
                    {participant.username}
                  </div>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="text-xs font-bold text-orange-500">{participant.currentStreak} 🔥</span>
                    <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Streak</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-black text-primary-600 tabular-nums">{participant.completedDays}</div>
                <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Days</div>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
}
