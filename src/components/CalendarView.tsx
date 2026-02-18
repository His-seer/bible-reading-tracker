import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';
import type { Reading } from '../types';
import Card from './ui/Card';

interface CalendarViewProps {
    readings: Reading[];
    onSelectDay?: (date: Date) => void;
}

export function CalendarView({ readings, onSelectDay }: CalendarViewProps) {
    const [displayedDate, setDisplayedDate] = useState(new Date());

    // Real "now" for highlighting today
    const realNow = new Date();

    const currentMonth = displayedDate.getMonth();
    const currentYear = displayedDate.getFullYear();

    // Navigation handlers
    const prevMonth = () => {
        setDisplayedDate(new Date(currentYear, currentMonth - 1, 1));
    };

    const nextMonth = () => {
        setDisplayedDate(new Date(currentYear, currentMonth + 1, 1));
    };

    // Helper to check if a specific date has a reading
    // Safely handles both ISO strings and Firestore Timestamp objects
    const getReadingForDate = (date: Date) => {
        const dateStr = date.toISOString().split('T')[0];
        return readings.find(r => {
            const rDate = typeof r.date === 'string' ? r.date : (r.date as any)?.toDate?.()?.toISOString?.() ?? '';
            return rDate.split('T')[0] === dateStr;
        });
    };

    // Generate days for the displayed month
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

    const calendarDays = [];
    // Padding for start of month
    for (let i = 0; i < firstDayOfMonth; i++) {
        calendarDays.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
        calendarDays.push(new Date(currentYear, currentMonth, i));
    }

    // 90-Day Challenge Grid data
    const challengeDays = Array.from({ length: 90 }, (_, i) => i + 1);

    return (
        <div className="space-y-8 animate-fade-in">
            {/* 90-Day Progress Grid */}
            <Card variant="default">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-primary-50 rounded-xl text-primary-600">
                            <CheckCircle2 className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-neutral-900">90-Day Challenge Grid</h3>
                            <p className="text-sm text-neutral-500 font-medium">Your entire journey at a glance</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 text-xs font-bold text-neutral-400 uppercase tracking-widest hidden sm:flex">
                        <div className="flex items-center gap-1.5">
                            <div className="w-3 h-3 rounded-sm bg-neutral-100 border border-neutral-200"></div>
                            <span>Planned</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <div className="w-3 h-3 rounded-sm bg-primary-500 shadow-sm shadow-primary-500/20"></div>
                            <span>Completed</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-10 sm:grid-cols-15 md:grid-cols-18 gap-2">
                    {challengeDays.map((day) => {
                        const isCompleted = readings.some(r => r.day === day);
                        const isCurrent = !isCompleted && readings.length + 1 === day;

                        return (
                            <div
                                key={day}
                                title={`Day ${day}`}
                                className={`
                  aspect-square rounded-md border transition-all duration-200 flex items-center justify-center text-[10px] font-bold
                  ${isCompleted
                                        ? 'bg-primary-500 border-primary-600 text-white shadow-sm scale-105 z-10'
                                        : isCurrent
                                            ? 'bg-white border-primary-300 text-primary-600 ring-2 ring-primary-100 animate-pulse'
                                            : 'bg-neutral-50 border-neutral-100 text-neutral-400 hover:border-neutral-200'
                                    }
                `}
                            >
                                {day}
                            </div>
                        );
                    })}
                </div>
            </Card>

            {/* Monthly Calendar View */}
            <Card variant="default">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-secondary-50 rounded-xl text-secondary-600">
                            <CalendarIcon className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-neutral-900">
                                {displayedDate.toLocaleString('default', { month: 'long' })} {currentYear}
                            </h3>
                            <p className="text-sm text-neutral-500 font-medium">Daily consistency tracking</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={prevMonth}
                            className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg text-neutral-400 hover:text-neutral-900 transition-colors"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                            onClick={nextMonth}
                            className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg text-neutral-400 hover:text-neutral-900 transition-colors"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-px bg-neutral-100 border border-neutral-100 rounded-2xl overflow-hidden shadow-inner font-inter">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                        <div key={day} className="bg-neutral-50 py-3 text-center">
                            <span className="text-[11px] font-black text-neutral-400 uppercase tracking-widest">{day}</span>
                        </div>
                    ))}

                    {calendarDays.map((date, idx) => {
                        if (!date) return <div key={`empty-${idx}`} className="bg-white min-h-[100px]"></div>;

                        const reading = getReadingForDate(date);
                        const isToday = date.toDateString() === realNow.toDateString();
                        const isFuture = date > realNow;

                        return (
                            <div
                                key={date.toISOString()}
                                className={`
                  bg-white min-h-[100px] p-2 transition-all group relative
                  ${isToday ? 'bg-primary-50/30' : ''}
                `}
                            >
                                <div className="flex justify-between items-start">
                                    <span className={`
                    text-sm font-bold w-7 h-7 flex items-center justify-center rounded-full transition-colors
                    ${isToday ? 'bg-primary-600 text-white shadow-md' : 'text-neutral-500 group-hover:text-neutral-900'}
                  `}>
                                        {date.getDate()}
                                    </span>
                                    {reading && (
                                        <div className="p-1 bg-success-100 rounded-full animate-scale-in">
                                            <CheckCircle2 className="w-3 h-3 text-success-600" />
                                        </div>
                                    )}
                                </div>

                                {reading && (
                                    <div className="mt-2 p-1.5 bg-primary-50 rounded-lg border border-primary-100/50 animate-fade-in group-hover:shadow-sm transition-shadow">
                                        <p className="text-[10px] font-bold text-primary-700 truncate">Day {reading.day}</p>
                                        <p className="text-[9px] text-primary-600/80 font-medium truncate leading-tight mt-0.5">{reading.chapters}</p>
                                    </div>
                                )}

                                {!reading && isToday ? (
                                    <button
                                        onClick={() => onSelectDay?.(date)}
                                        className="mt-2 w-full px-2 py-1.5 bg-primary-100 hover:bg-primary-200 text-[10px] font-bold text-primary-600 uppercase tracking-tighter rounded-lg transition-colors border border-primary-200"
                                    >
                                        + Log Today
                                    </button>
                                ) : !reading && !isFuture && !isToday ? (
                                    <button
                                        onClick={() => onSelectDay?.(date)}
                                        className="mt-2 w-full px-2 py-1.5 bg-neutral-100 hover:bg-primary-50 text-[10px] font-bold text-neutral-400 hover:text-primary-600 uppercase tracking-tighter rounded-lg transition-colors border border-dashed border-neutral-200 opacity-0 group-hover:opacity-100 focus:opacity-100"
                                    >
                                        + Backfill
                                    </button>
                                ) : null}
                            </div>
                        );
                    })}
                </div>
            </Card>
        </div>
    );
}
