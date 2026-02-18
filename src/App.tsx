import { useState, useEffect } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { useAuth } from './hooks/useAuth';
import { useReadings } from './hooks/useReadings';
import { useLeaderboard } from './hooks/useLeaderboard';
import { getMilestoneMessage } from './utils/streakCalculator';
import { getPlanForDay, getMissedDays } from './utils/readingPlan';
import type { ReadingPlanEntry } from './utils/readingPlan';
import { LoginScreen } from './components/LoginScreen';
import { StatsCards } from './components/StatsCards';
import { ProgressBar } from './components/ProgressBar';
import { TodayReading } from './components/TodayReading';
import { ReadingHistory } from './components/ReadingHistory';
import { Leaderboard } from './components/Leaderboard';
import { ActivityFeed } from './components/ActivityFeed';
import { CalendarView } from './components/CalendarView';
import { CelebrationModal } from './components/CelebrationModal';
import { SettingsModal } from './components/SettingsModal';
import { WalkthroughModal } from './components/WalkthroughModal';
import { CatchUpPanel } from './components/CatchUpPanel';
import { Book, Settings, LogOut, Menu, TrendingUp, Users, Calendar, HelpCircle } from 'lucide-react';

function App() {
  const { user, userProfile, isAuthenticated, loading: authLoading, logout, changeUsername } = useAuth();
  const { readings, currentDay, completedDays, currentStreak, loading: readingsLoading, error: readingsError, saveReading, setError: setReadingsError, editReading, deleteReading } = useReadings(user?.uid, userProfile?.username || null);
  const { participants, activities, getLeaderboardPosition, getTotalGroupDays } = useLeaderboard(user?.uid, userProfile?.username || null);

  type Tab = 'progress' | 'calendar' | 'leaderboard';
  const [activeTab, setActiveTab] = useState<Tab>('progress');
  const [showCelebration, setShowCelebration] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [todaysChapters, setTodaysChapters] = useState('');
  const [todaysSummary, setTodaysSummary] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [backfillDate, setBackfillDate] = useState<Date | null>(null);
  const [backfillDay, setBackfillDay] = useState<number | null>(null);
  const [showWalkthrough, setShowWalkthrough] = useState(false);

  // The day we're currently logging (either the catch-up day or currentDay)
  const activeDay = backfillDay ?? currentDay;
  // The reading plan entry for the active day
  const activePlanEntry: ReadingPlanEntry | null = getPlanForDay(activeDay) ?? null;
  // Missed days (past scheduled date, not yet completed)
  const completedDaySet = new Set(readings.filter(r => r.completed).map(r => r.day));
  const missedDays = getMissedDays(completedDaySet);

  // Check for first-time user
  useEffect(() => {
    const hasSeenWalkthrough = localStorage.getItem('hasSeenWalkthrough');
    if (!hasSeenWalkthrough && isAuthenticated) {
      setShowWalkthrough(true);
      localStorage.setItem('hasSeenWalkthrough', 'true');
    }
  }, [isAuthenticated]);

  const handleComplete = async (date?: Date) => {
    if (!todaysChapters.trim()) {
      setReadingsError('Please add the chapters you read');
      return;
    }

    try {
      setIsSubmitting(true);
      await saveReading(activeDay, todaysChapters, todaysSummary, date);

      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 3000);

      setTodaysChapters('');
      setTodaysSummary('');
      setBackfillDate(null);
      setBackfillDay(null);
    } catch (err) {
      console.error('Error completing day:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Called from CatchUpPanel — select a missed day to log
  const handleSelectCatchUpDay = (day: number, entry: ReadingPlanEntry) => {
    setBackfillDay(day);
    // Pre-fill chapters from the reading plan
    setTodaysChapters(entry.chapters);
    setTodaysSummary('');
    // Use the scheduled date for the backfill
    const scheduled = new Date(entry.scheduledDate + 'T12:00:00');
    setBackfillDate(scheduled);
    // Scroll to the reading form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = async () => {
    await logout();
    setShowProfileMenu(false);
  };

  // Show loading screen
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin">
            <Book className="w-12 h-12 text-primary-600" />
          </div>
          <p className="text-neutral-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  // Show login screen if not authenticated
  if (!isAuthenticated) {
    return <LoginScreen />;
  }

  // Show main app
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex flex-col transition-colors duration-300">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-neutral-100 shadow-sm sticky top-0 z-30 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-18">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-gradient-to-br from-primary-600 to-secondary-600 rounded-xl text-white shadow-lg shadow-primary-500/20">
                <Book className="w-6 h-6" />
              </div>
              <h1 className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent hidden sm:block">
                Bible Reading Tracker
              </h1>
            </div>

            <div className="flex items-center gap-2 sm:gap-4">
              {/* Help Button */}
              <button
                onClick={() => setShowWalkthrough(true)}
                className="p-2.5 rounded-xl text-neutral-500 hover:bg-neutral-100 transition-all duration-200"
                aria-label="Help & Guide"
              >
                <HelpCircle className="w-5 h-5" />
              </button>

              {/* Profile Menu */}
              <div className="relative">
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl transition-all duration-200 ${showProfileMenu ? 'bg-neutral-100 ring-2 ring-primary-500/10' : 'hover:bg-neutral-50'
                    }`}
                >
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-600 to-secondary-600 flex items-center justify-center text-white text-sm font-bold shadow-sm shadow-primary-500/20 border-2 border-white">
                    {userProfile?.username?.charAt(0).toUpperCase()}
                  </div>
                  <div className="hidden sm:flex flex-col items-start leading-tight">
                    <span className="text-sm font-bold text-neutral-800">{userProfile?.username}</span>
                    <span className="text-[10px] font-medium text-neutral-500 uppercase tracking-wider">Member</span>
                  </div>
                  <Menu className="w-4 h-4 text-neutral-400 ml-1" />
                </button>

                {/* Dropdown Menu */}
                {showProfileMenu && (
                  <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-xl border border-neutral-100 z-40 overflow-hidden animate-scale-in">
                    <div className="p-4 bg-neutral-50/50 border-b border-neutral-100">
                      <p className="text-sm font-bold text-neutral-900">{userProfile?.username}</p>
                      <p className="text-xs text-neutral-500 truncate">{userProfile?.email}</p>
                    </div>
                    <div className="p-1.5">
                      <button
                        onClick={() => {
                          setShowSettings(true);
                          setShowProfileMenu(false);
                        }}
                        className="w-full text-left px-3 py-2.5 text-sm text-neutral-700 hover:bg-neutral-50 rounded-lg flex items-center gap-3 transition-colors group"
                      >
                        <Settings className="w-4 h-4 text-neutral-400 group-hover:text-primary-600" />
                        <span className="font-medium">Settings</span>
                      </button>
                      <button
                        onClick={() => {
                          setShowWalkthrough(true);
                          setShowProfileMenu(false);
                        }}
                        className="w-full text-left px-3 py-2.5 text-sm text-neutral-700 hover:bg-neutral-50 rounded-lg flex items-center gap-3 transition-colors group"
                      >
                        <HelpCircle className="w-4 h-4 text-neutral-400 group-hover:text-primary-600" />
                        <span className="font-medium">How it Works</span>
                      </button>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-3 py-2.5 text-sm text-error-600 hover:bg-error-50 rounded-lg flex items-center gap-3 transition-colors group border-t border-neutral-50 mt-1"
                      >
                        <LogOut className="w-4 h-4 text-error-400 group-hover:text-error-600" />
                        <span className="font-semibold">Logout</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 sm:p-6 lg:p-10">
        <div className="max-w-5xl mx-auto w-full">
          {/* Welcome Section */}
          <div className="mb-14 text-center">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-neutral-900 tracking-tight mb-4 px-4">
              Welcome back, {userProfile?.username || userProfile?.email?.split('@')[0]}!
            </h2>
            <div className="flex items-center justify-center gap-3">
              <span className="h-px w-10 bg-gradient-to-r from-transparent to-primary-200 hidden sm:block"></span>
              <p className="text-neutral-500 font-medium text-lg italic">Your journey through the Word continues</p>
              <span className="h-px w-10 bg-gradient-to-l from-transparent to-primary-200 hidden sm:block"></span>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="mb-10">
            <StatsCards
              currentDay={currentDay}
              completedDays={completedDays}
              currentStreak={currentStreak}
              rank={getLeaderboardPosition()}
              totalParticipants={participants.length}
            />
          </div>

          {/* Toggle View Tabs */}
          <div className="flex p-1.5 bg-neutral-100/80 backdrop-blur-sm rounded-2xl mb-10 max-w-3xl mx-auto relative group border border-neutral-200/50 shadow-sm">
            <div
              className="absolute h-[calc(100%-12px)] top-1.5 bg-white rounded-[10px] shadow-sm transition-all duration-300 ease-out z-0"
              style={{
                width: 'calc(33.333% - 6px)',
                left: activeTab === 'progress' ? '6px' : activeTab === 'calendar' ? 'calc(33.333% + 2px)' : 'calc(66.666% - 2px)'
              }}
            />
            <button
              onClick={() => setActiveTab('progress')}
              className={`flex-1 flex items-center justify-center gap-2.5 py-2.5 px-4 font-bold transition-all duration-300 relative z-10 rounded-[10px] ${activeTab === 'progress'
                ? 'text-primary-600'
                : 'text-neutral-500 hover:text-neutral-700 hover:bg-white/50'
                }`}
            >
              <TrendingUp className={`w-4 h-4 transition-transform duration-300 ${activeTab === 'progress' ? 'scale-110' : ''}`} />
              <span className="hidden sm:inline">My Progress</span>
              <span className="sm:hidden">Progress</span>
            </button>
            <button
              onClick={() => setActiveTab('calendar')}
              className={`flex-1 flex items-center justify-center gap-2.5 py-2.5 px-4 font-bold transition-all duration-300 relative z-10 rounded-[10px] ${activeTab === 'calendar'
                ? 'text-primary-600'
                : 'text-neutral-500 hover:text-neutral-700 hover:bg-white/50'
                }`}
            >
              <Calendar className={`w-4 h-4 transition-transform duration-300 ${activeTab === 'calendar' ? 'scale-110' : ''}`} />
              <span className="hidden sm:inline">Calendar View</span>
              <span className="sm:hidden">Calendar</span>
            </button>
            <button
              onClick={() => setActiveTab('leaderboard')}
              className={`flex-1 flex items-center justify-center gap-2.5 py-2.5 px-4 font-bold transition-all duration-300 relative z-10 rounded-[10px] ${activeTab === 'leaderboard'
                ? 'text-primary-600'
                : 'text-neutral-500 hover:text-neutral-700 hover:bg-white/50'
                }`}
            >
              <Users className={`w-4 h-4 transition-transform duration-300 ${activeTab === 'leaderboard' ? 'scale-110' : ''}`} />
              <span className="hidden sm:inline">Leaderboard & Activity</span>
              <span className="sm:hidden">Leaderboard</span>
            </button>
          </div>

          {/* Main Content Sections */}
          {activeTab === 'progress' && (
            <div className="space-y-8 animate-fade-in">
              {/* Progress Bar */}
              <ProgressBar completedDays={completedDays} totalDays={90} />

              {/* Catch-Up Panel — missed days */}
              {missedDays.length > 0 && !backfillDay && (
                <CatchUpPanel
                  missedDays={missedDays}
                  onSelectDay={handleSelectCatchUpDay}
                />
              )}

              {/* Today's / Catch-up Reading Form */}
              <TodayReading
                currentDay={activeDay}
                chapters={todaysChapters}
                summary={todaysSummary}
                onChaptersChange={setTodaysChapters}
                onSummaryChange={setTodaysSummary}
                onComplete={handleComplete}
                selectedDate={backfillDate}
                planEntry={activePlanEntry}
                onCancel={() => {
                  setBackfillDate(null);
                  setBackfillDay(null);
                  setTodaysChapters('');
                  setTodaysSummary('');
                }}
                loading={readingsLoading || isSubmitting}
                error={readingsError}
                onErrorDismiss={() => setReadingsError(null)}
              />

              {/* Reading History */}
              <ReadingHistory
                readings={readings}
                onEditReading={editReading}
                onDeleteReading={deleteReading}
              />
            </div>
          )}

          {activeTab === 'calendar' && (
            <CalendarView
              readings={readings}
              onSelectDay={(date) => {
                setBackfillDate(date);
                setActiveTab('progress');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          )}

          {activeTab === 'leaderboard' && (
            <div className="grid md:grid-cols-2 gap-6 animate-fade-in">
              {/* Leaderboard */}
              <Leaderboard
                participants={participants}
                currentUsername={userProfile?.username || ''}
                totalGroupDays={getTotalGroupDays()}
              />

              {/* Activity Feed */}
              <ActivityFeed activities={activities} />
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-neutral-100 mt-8 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-sm text-neutral-600 text-center">
            © 2026 Bible Reading Tracker. Built with <span className="text-error-500">❤️</span> for Bible readers.
          </p>
        </div>
      </footer>

      {/* Celebration Modal */}
      <CelebrationModal
        show={showCelebration}
        username={userProfile?.username || ''}
        message={getMilestoneMessage(completedDays)}
        onClose={() => setShowCelebration(false)}
      />

      {/* Walkthrough Modal */}
      <WalkthroughModal
        isOpen={showWalkthrough}
        onClose={() => setShowWalkthrough(false)}
      />

      {userProfile && (
        <SettingsModal
          show={showSettings}
          currentUsername={userProfile.username}
          email={userProfile.email}
          onClose={() => setShowSettings(false)}
          onChangeUsername={changeUsername}
        />
      )}

      {/* Vercel Analytics */}
      <Analytics />
    </div>
  );
}

export default App;
