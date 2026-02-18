import { useState } from 'react';
import { Trash2, Edit2, History, Save, X, Calendar } from 'lucide-react';
import type { Reading } from '../types';
import Card from './ui/Card';

interface ReadingHistoryProps {
  readings: Reading[];
  onEditReading?: (day: number, chapters: string, summary: string) => Promise<void>;
  onDeleteReading?: (day: number) => Promise<void>;
}

export function ReadingHistory({ readings, onEditReading, onDeleteReading }: ReadingHistoryProps) {
  const [editingDay, setEditingDay] = useState<number | null>(null);
  const [editChapters, setEditChapters] = useState('');
  const [editSummary, setEditSummary] = useState('');
  const [isDeleting, setIsDeleting] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const sortedReadings = [...readings].sort((a, b) => b.day - a.day);

  const handleEdit = (reading: Reading) => {
    setEditingDay(reading.day);
    setEditChapters(reading.chapters);
    setEditSummary(reading.summary);
    setError(null);
  };

  const handleSaveEdit = async (day: number) => {
    if (!editChapters.trim()) {
      setError('Chapters cannot be empty');
      return;
    }
    try {
      await onEditReading?.(day, editChapters, editSummary);
      setEditingDay(null);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save');
    }
  };

  const handleDelete = async (day: number) => {
    if (!confirm(`Delete Day ${day} reading? This cannot be undone.`)) return;

    try {
      setIsDeleting(day);
      setError(null);
      await onDeleteReading?.(day);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete');
    } finally {
      setIsDeleting(null);
    }
  };

  if (readings.length === 0) {
    return null;
  }

  return (
    <Card variant="default">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-neutral-100 rounded-xl text-neutral-600">
            <History className="w-5 h-5" />
          </div>
          <h3 className="text-xl font-bold text-neutral-900">Your Journey</h3>
        </div>
        <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest bg-neutral-50 px-3 py-1.5 rounded-full border border-neutral-100">
          {readings.length} {readings.length === 1 ? 'Entry' : 'Entries'}
        </span>
      </div>

      {error && (
        <div className="bg-error-50 border border-error-100 rounded-xl p-4 mb-6 animate-scale-in">
          <p className="text-error-600 text-sm font-medium">{error}</p>
        </div>
      )}

      <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
        {sortedReadings.map((reading) => (
          <div
            key={reading.day}
            className={`
              relative overflow-hidden group border-l-4 border-primary-500 bg-neutral-50 rounded-r-2xl transition-all duration-200
              ${editingDay === reading.day ? 'ring-2 ring-primary-500 ring-offset-2' : 'hover:bg-white hover:shadow-md hover:border-l-8'}
            `}
          >
            <div className="p-5">
              {editingDay === reading.day ? (
                <div className="space-y-4 animate-fade-in">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-black text-neutral-900 uppercase tracking-wider">Editing Day {reading.day}</span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleSaveEdit(reading.day)}
                        className="flex items-center gap-2 px-4 py-2 bg-success-600 text-white text-xs font-bold rounded-lg hover:bg-success-700 transition-colors shadow-sm"
                      >
                        <Save className="w-3.5 h-3.5" /> Save
                      </button>
                      <button
                        onClick={() => setEditingDay(null)}
                        className="flex items-center gap-2 px-4 py-2 bg-neutral-200 text-neutral-700 text-xs font-bold rounded-lg hover:bg-neutral-300 transition-colors"
                      >
                        <X className="w-3.5 h-3.5" /> Cancel
                      </button>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={editChapters}
                      onChange={(e) => setEditChapters(e.target.value)}
                      className="w-full px-4 py-2.5 bg-white border border-neutral-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all outline-none"
                      placeholder="Chapters read..."
                    />
                    <textarea
                      value={editSummary}
                      onChange={(e) => setEditSummary(e.target.value)}
                      className="w-full px-4 py-2.5 bg-white border border-neutral-200 rounded-xl text-sm h-24 resize-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all outline-none"
                      placeholder="What did you learn today? (Optional)"
                    />
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-black text-neutral-900">Day {reading.day}</span>
                        <span className="h-1 w-1 bg-neutral-300 rounded-full"></span>
                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-neutral-400 uppercase tracking-widest bg-white px-2 py-0.5 rounded-md border border-neutral-100">
                          <Calendar className="w-3 h-3" />
                          {(() => {
                            const d = typeof reading.date === 'string'
                              ? new Date(reading.date)
                              : (reading.date as any)?.toDate?.() ?? new Date();
                            return d.toLocaleDateString();
                          })()}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                      <button
                        onClick={() => handleEdit(reading)}
                        className="p-2 text-neutral-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all"
                        title="Edit entry"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(reading.day)}
                        disabled={isDeleting === reading.day}
                        className="p-2 text-neutral-400 hover:text-error-600 hover:bg-error-50 rounded-lg transition-all disabled:opacity-50"
                        title="Delete entry"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-base font-bold text-primary-700 leading-tight">
                      {reading.chapters}
                    </p>
                    {reading.summary && (
                      <p className="text-sm text-neutral-600 font-medium leading-relaxed bg-white/50 p-3 rounded-xl border border-neutral-100/50 italic">
                        "{reading.summary}"
                      </p>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
