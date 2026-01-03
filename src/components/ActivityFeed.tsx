import { Heart } from 'lucide-react';
import Card from './ui/Card';
import type { Activity } from '../types';

interface ActivityFeedProps {
  activities: Activity[];
}

export function ActivityFeed({ activities }: ActivityFeedProps) {
  return (
    <Card variant="elevated" padding="lg" className="h-[600px] flex flex-col">
      <h3 className="text-xl font-bold text-neutral-800 mb-6 flex items-center gap-2.5">
        <Heart className="w-6 h-6 text-accent-500 fill-accent-500/10" />
        Recent Activity
      </h3>

      <div className="flex-1 space-y-4 overflow-y-auto pr-2 custom-scrollbar">
        {activities.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-10">
            <div className="w-16 h-16 bg-neutral-50 rounded-full flex items-center justify-center mb-4">
              <Heart className="w-8 h-8 text-neutral-200" />
            </div>
            <p className="text-neutral-500 font-medium max-w-[200px]">No activity yet. Be the first to complete a day!</p>
          </div>
        ) : (
          activities.map((activity, index) => (
            <div
              key={index}
              className="group border border-neutral-100 p-4 bg-white rounded-2xl hover:bg-neutral-50 hover:border-primary-100 transition-all duration-300 shadow-sm hover:shadow-md"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-neutral-900">{activity.username}</span>
                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">{new Date(activity.timestamp).toLocaleDateString()}</span>
              </div>
              <div className="text-sm text-primary-600 font-bold bg-primary-50 px-2.5 py-1 rounded-lg inline-block mb-2">
                Completed Day {activity.day}: {activity.chapters}
              </div>
              {activity.summary && (
                <div className="relative pl-3 border-l-2 border-neutral-200 mt-2">
                  <p className="text-sm text-neutral-600 italic">"{activity.summary}"</p>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </Card>
  );
}
