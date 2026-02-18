import { ExternalLink, BookOpen, ChevronRight, AlertTriangle } from 'lucide-react';
import Card from './ui/Card';
import type { ReadingPlanEntry } from '../utils/readingPlan';

interface CatchUpPanelProps {
    missedDays: ReadingPlanEntry[];
    onSelectDay: (day: number, entry: ReadingPlanEntry) => void;
}

export function CatchUpPanel({ missedDays, onSelectDay }: CatchUpPanelProps) {
    if (missedDays.length === 0) return null;

    return (
        <Card variant="default" className="border-l-4 border-l-warning-400">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-warning-50 rounded-xl text-warning-600">
                    <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                    <h3 className="text-xl font-bold text-neutral-900">Catch Up</h3>
                    <p className="text-sm text-neutral-500 font-medium">
                        {missedDays.length} day{missedDays.length !== 1 ? 's' : ''} behind — you've got this! 💪
                    </p>
                </div>
            </div>

            <div className="space-y-3">
                {missedDays.map((entry) => {
                    const scheduled = new Date(entry.scheduledDate + 'T00:00:00');
                    const dateLabel = scheduled.toLocaleDateString('default', { month: 'short', day: 'numeric' });

                    return (
                        <div
                            key={entry.day}
                            className="group flex items-center gap-3 p-3.5 bg-neutral-50 hover:bg-white border border-neutral-100 hover:border-primary-200 rounded-2xl transition-all hover:shadow-md"
                        >
                            {/* Day badge */}
                            <div className="shrink-0 w-12 h-12 bg-warning-100 rounded-xl flex flex-col items-center justify-center">
                                <span className="text-[9px] font-black text-warning-500 uppercase tracking-widest leading-none">Day</span>
                                <span className="text-lg font-black text-warning-700 leading-tight">{entry.day}</span>
                            </div>

                            {/* Passage info */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-1.5 mb-0.5">
                                    <BookOpen className="w-3 h-3 text-neutral-400 shrink-0" />
                                    <p className="text-sm font-bold text-neutral-800 truncate">{entry.chapters}</p>
                                </div>
                                <p className="text-xs text-neutral-400 font-medium">Scheduled: {dateLabel}</p>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-2 shrink-0">
                                <a
                                    href={entry.bibleUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={(e) => e.stopPropagation()}
                                    className="p-2 text-neutral-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all"
                                    title="Read passage on Bible.com"
                                >
                                    <ExternalLink className="w-4 h-4" />
                                </a>
                                <button
                                    onClick={() => onSelectDay(entry.day, entry)}
                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold rounded-xl transition-colors shadow-sm shadow-primary-500/20"
                                >
                                    Log <ChevronRight className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            <p className="text-xs text-neutral-400 font-medium text-center mt-4">
                Click <strong>Log</strong> to record your notes, or <ExternalLink className="w-3 h-3 inline" /> to read the passage first.
            </p>
        </Card>
    );
}
