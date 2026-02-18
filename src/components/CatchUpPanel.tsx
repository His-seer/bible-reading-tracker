import { useState } from 'react';
import { ExternalLink, BookOpen, ChevronRight, AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react';
import Card from './ui/Card';
import type { ReadingPlanEntry } from '../utils/readingPlan';

interface CatchUpPanelProps {
    missedDays: ReadingPlanEntry[];
    onSelectDay: (day: number, entry: ReadingPlanEntry) => void;
}

export function CatchUpPanel({ missedDays, onSelectDay }: CatchUpPanelProps) {
    const [expanded, setExpanded] = useState(false);

    if (missedDays.length === 0) return null;

    // Show only first 3 by default; expand to show all
    const visible = expanded ? missedDays : missedDays.slice(0, 3);
    const hiddenCount = missedDays.length - 3;

    return (
        <Card variant="default" className="border-l-4 border-l-warning-400">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-warning-50 rounded-xl text-warning-600">
                        <AlertTriangle className="w-4 h-4" />
                    </div>
                    <div>
                        <h3 className="text-base font-bold text-neutral-900">Catch Up</h3>
                        <p className="text-xs text-neutral-500 font-medium">
                            {missedDays.length} day{missedDays.length !== 1 ? 's' : ''} behind — you've got this! 💪
                        </p>
                    </div>
                </div>
            </div>

            {/* Scrollable compact list */}
            <div className="space-y-2">
                {visible.map((entry) => {
                    const scheduled = new Date(entry.scheduledDate + 'T00:00:00');
                    const dateLabel = scheduled.toLocaleDateString('default', { month: 'short', day: 'numeric' });

                    return (
                        <div
                            key={entry.day}
                            className="flex items-center gap-2.5 px-3 py-2.5 bg-neutral-50 hover:bg-white border border-neutral-100 hover:border-primary-200 rounded-xl transition-all hover:shadow-sm"
                        >
                            {/* Day badge */}
                            <div className="shrink-0 w-10 h-10 bg-warning-100 rounded-lg flex flex-col items-center justify-center">
                                <span className="text-[8px] font-black text-warning-500 uppercase tracking-widest leading-none">Day</span>
                                <span className="text-sm font-black text-warning-700 leading-tight">{entry.day}</span>
                            </div>

                            {/* Passage info */}
                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-bold text-neutral-800 truncate">{entry.chapters}</p>
                                <p className="text-[10px] text-neutral-400 font-medium">{dateLabel}</p>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-1.5 shrink-0">
                                <a
                                    href={entry.bibleUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={(e) => e.stopPropagation()}
                                    className="p-1.5 text-neutral-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all"
                                    title="Read on Bible.com"
                                >
                                    <ExternalLink className="w-3.5 h-3.5" />
                                </a>
                                <button
                                    onClick={() => onSelectDay(entry.day, entry)}
                                    className="flex items-center gap-1 px-2.5 py-1.5 bg-primary-600 hover:bg-primary-700 text-white text-[11px] font-bold rounded-lg transition-colors"
                                >
                                    <BookOpen className="w-3 h-3" /> Log <ChevronRight className="w-3 h-3" />
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Show more / less toggle */}
            {missedDays.length > 3 && (
                <button
                    onClick={() => setExpanded(!expanded)}
                    className="mt-3 w-full flex items-center justify-center gap-1.5 py-2 text-xs font-bold text-neutral-400 hover:text-primary-600 hover:bg-neutral-50 rounded-xl transition-colors"
                >
                    {expanded ? (
                        <><ChevronUp className="w-3.5 h-3.5" /> Show less</>
                    ) : (
                        <><ChevronDown className="w-3.5 h-3.5" /> Show {hiddenCount} more day{hiddenCount !== 1 ? 's' : ''}</>
                    )}
                </button>
            )}
        </Card>
    );
}
