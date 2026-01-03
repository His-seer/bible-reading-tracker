import { Calendar, CheckCircle2, TrendingUp, Medal, Users } from 'lucide-react';

interface StatsCardsProps {
  currentDay: number;
  completedDays: number;
  currentStreak: number;
  rank: number | string;
  totalParticipants: number;
}

export function StatsCards({
  currentDay,
  completedDays,
  currentStreak,
  rank,
  totalParticipants,
}: StatsCardsProps) {
  const stats = [
    {
      icon: Calendar,
      label: 'Day',
      value: `${currentDay}/90`,
      color: 'indigo',
      iconBg: 'bg-indigo-100',
      iconColor: 'text-indigo-500',
      valueColor: 'text-indigo-600',
    },
    {
      icon: CheckCircle2,
      label: 'Completed',
      value: completedDays.toString(),
      color: 'green',
      iconBg: 'bg-green-100',
      iconColor: 'text-green-500',
      valueColor: 'text-green-600',
    },
    {
      icon: TrendingUp,
      label: 'Streak',
      value: currentStreak.toString(),
      color: 'orange',
      iconBg: 'bg-orange-100',
      iconColor: 'text-orange-500',
      valueColor: 'text-orange-600',
      special: currentStreak > 0,
      isStreak: true,
    },
    {
      icon: Medal,
      label: 'Rank',
      value: `#${rank}`,
      color: 'yellow',
      iconBg: 'bg-yellow-100',
      iconColor: 'text-yellow-500',
      valueColor: 'text-yellow-600',
    },
    {
      icon: Users,
      label: 'Group',
      value: totalParticipants.toString(),
      color: 'purple',
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-500',
      valueColor: 'text-purple-600',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.label}
            className={`
              bg-white border border-neutral-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-200
              animate-slide-up opacity-0 group flex flex-col justify-between min-h-[140px]
            `}
            style={{ animationDelay: `${index * 0.1}s`, animationFillMode: 'forwards' }}
          >
            <div className="flex items-start justify-between">
              <div className={`p-3 rounded-xl ${stat.iconBg} group-hover:scale-110 transition-transform duration-300`}>
                <Icon className={`w-6 h-6 ${stat.iconColor}`} />
              </div>
              <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest">{stat.label}</span>
            </div>

            <div className="mt-4 flex items-end justify-between">
              <div>
                <div className="text-3xl font-black text-neutral-900 tracking-tight flex items-center gap-2">
                  {stat.value}
                  {stat.isStreak && parseInt(stat.value) > 0 && (
                    <span className="text-2xl animate-float">🔥</span>
                  )}
                </div>
              </div>
              {stat.isStreak && parseInt(stat.value) > 0 && (
                <div className="p-1.5 bg-warning-50 rounded-lg">
                  <Icon className="w-5 h-5 text-warning-500 fill-warning-500" />
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

