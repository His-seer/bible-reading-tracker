import Card from './ui/Card';

interface ProgressBarProps {
  completedDays: number;
  totalDays: number;
}

export function ProgressBar({ completedDays, totalDays }: ProgressBarProps) {
  const percentage = Math.min((completedDays / totalDays) * 100, 100);

  return (
    <Card variant="elevated" padding="lg">
      <div className="flex justify-between items-center mb-3">
        <span className="text-sm font-medium text-neutral-600">Your Progress</span>
        <span className="text-sm font-bold text-primary-600">
          {completedDays} / {totalDays} days
        </span>
      </div>
      <div className="w-full h-4 bg-neutral-200 rounded-full overflow-hidden border border-neutral-100">
        <div
          className="h-full bg-gradient-to-r from-primary-500 via-secondary-500 to-accent-500 transition-all duration-500 rounded-full"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </Card>
  );
}
