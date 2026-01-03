import { useState } from 'react';
import { CheckCircle2, Sparkles } from 'lucide-react';
import Button from './ui/Button';
import Input from './ui/Input';
import Card from './ui/Card';
import Alert from './ui/Alert';

interface TodayReadingProps {
  currentDay: number;
  chapters: string;
  summary: string;
  onChaptersChange: (value: string) => void;
  onSummaryChange: (value: string) => void;
  onComplete: (date?: Date) => Promise<void>;
  selectedDate?: Date | null;
  loading?: boolean;
  error?: string | null;
  onErrorDismiss?: () => void;
  onCancel?: () => void;
}

export function TodayReading({
  currentDay,
  chapters,
  summary,
  onChaptersChange,
  onSummaryChange,
  onComplete,
  selectedDate,
  loading = false,
  error,
  onErrorDismiss,
  onCancel,
}: TodayReadingProps) {
  const [editingChapters, setEditingChapters] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      await onComplete(selectedDate || undefined);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formattedDate = selectedDate ? selectedDate.toLocaleDateString('default', { month: 'long', day: 'numeric', year: 'numeric' }) : null;

  return (
    <Card variant="elevated" padding="lg">
      <h2 className="text-2xl font-bold text-neutral-900 mb-6 flex items-center gap-2">
        <Sparkles className="w-6 h-6 text-warning-500" />
        {selectedDate ? `Log Reading for ${formattedDate}` : `Day ${currentDay} Reading`}
      </h2>

      {error && (
        <Alert variant="error" className="mb-6" dismissible onDismiss={onErrorDismiss}>
          {error}
        </Alert>
      )}

      <div className="mb-6">
        {editingChapters || !chapters ? (
          <Input
            label="Today's Chapters"
            type="text"
            value={chapters}
            onChange={(e) => onChaptersChange(e.target.value)}
            placeholder="e.g., Genesis 1-3, Psalm 1"
            onBlur={() => chapters && setEditingChapters(false)}
            disabled={loading || isSubmitting}
            autoFocus
          />
        ) : (
          <>
            <label className="block text-sm font-medium text-neutral-700 mb-2">Today's Chapters</label>
            <div
              onClick={() => setEditingChapters(true)}
              className="w-full p-3 bg-primary-50 rounded-base font-medium text-primary-700 cursor-pointer hover:bg-primary-100 transition-colors duration-fast border border-primary-100"
            >
              {chapters}
            </div>
          </>
        )}
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-neutral-700 mb-2">
          What spoke to you today? (Share with the group)
        </label>
        <textarea
          value={summary}
          onChange={(e) => onSummaryChange(e.target.value)}
          placeholder="Share your thoughts, insights, or favorite verse..."
          className="w-full px-4 py-2.5 text-base font-normal border-2 rounded-base border-neutral-300 transition-colors duration-base placeholder:text-neutral-400 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-offset-2 focus:ring-primary-500/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-neutral-100 disabled:border-neutral-200 disabled:text-neutral-400 h-24 resize-none"
          disabled={loading || isSubmitting}
        />
      </div>

      <div className="flex flex-col gap-3">
        <Button
          onClick={handleSubmit}
          disabled={!chapters.trim() || loading || isSubmitting}
          fullWidth
          isLoading={isSubmitting}
          icon={<CheckCircle2 className="w-5 h-5" />}
        >
          {isSubmitting ? `Saving...` : selectedDate ? `Save Backfill for ${formattedDate}` : `Complete Day ${currentDay}`}
        </Button>

        {selectedDate && (
          <button
            onClick={onCancel}
            className="w-full py-2 text-sm font-bold text-neutral-400 hover:text-neutral-600 transition-colors"
          >
            Cancel Backfill
          </button>
        )}
      </div>
    </Card>
  );
}
