import { useState } from 'react';
import { Bell, BellOff, Send, CheckCircle2, AlertCircle, XCircle } from 'lucide-react';
import Modal from './ui/Modal';
import Input from './ui/Input';
import Button from './ui/Button';
import Alert from './ui/Alert';
import FormGroup from './ui/FormGroup';
import { useReminders } from '../hooks/useReminders';

interface SettingsModalProps {
  show: boolean;
  currentUsername: string;
  email?: string;
  onClose: () => void;
  onChangeUsername: (newUsername: string) => Promise<void>;
}

export function SettingsModal({ show, currentUsername, email, onClose, onChangeUsername }: SettingsModalProps) {
  const [newUsername, setNewUsername] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    isSupported,
    permission,
    enabled,
    time,
    enableReminders,
    disableReminders,
    updateTime,
    sendTestNotification,
  } = useReminders();

  const [reminderTime, setReminderTime] = useState(time);
  const [reminderError, setReminderError] = useState<string | null>(null);
  const [reminderSuccess, setReminderSuccess] = useState(false);
  const [testSent, setTestSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!newUsername.trim()) {
      setError('Please enter a new username');
      return;
    }
    if (newUsername.trim() === currentUsername) {
      setError('New username must be different from current');
      return;
    }
    if (newUsername.trim().length < 2) {
      setError('Username must be at least 2 characters');
      return;
    }
    if (newUsername.trim().length > 30) {
      setError('Username must be 30 characters or less');
      return;
    }

    try {
      setIsSubmitting(true);
      await onChangeUsername(newUsername.trim());
      setSuccess(true);
      setTimeout(() => {
        setNewUsername('');
        setSuccess(false);
        onClose();
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to change username');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleReminder = async () => {
    setReminderError(null);
    setReminderSuccess(false);
    if (enabled) {
      disableReminders();
    } else {
      const granted = await enableReminders(reminderTime);
      if (!granted) {
        setReminderError(
          permission === 'denied'
            ? 'Notifications are blocked. Please enable them in your browser settings and reload.'
            : 'Permission was not granted. Please try again.'
        );
      } else {
        setReminderSuccess(true);
        setTimeout(() => setReminderSuccess(false), 3000);
      }
    }
  };

  const handleTimeChange = (newTime: string) => {
    setReminderTime(newTime);
    if (enabled) updateTime(newTime);
  };

  const handleTest = () => {
    sendTestNotification();
    setTestSent(true);
    setTimeout(() => setTestSent(false), 3000);
  };

  const permissionIcon = () => {
    if (!isSupported) return <XCircle className="w-4 h-4 text-neutral-400" />;
    if (permission === 'granted') return <CheckCircle2 className="w-4 h-4 text-success-500" />;
    if (permission === 'denied') return <XCircle className="w-4 h-4 text-error-500" />;
    return <AlertCircle className="w-4 h-4 text-warning-500" />;
  };

  const permissionLabel = () => {
    if (!isSupported) return 'Not supported in this browser';
    if (permission === 'granted') return 'Permission granted';
    if (permission === 'denied') return 'Permission blocked — check browser settings';
    return 'Permission not yet granted';
  };

  return (
    <Modal isOpen={show} onClose={onClose} title="Account Settings" maxWidth="md">
      {/* Account Info Section */}
      <div className="mb-6 pb-6 border-b border-neutral-100">
        <h3 className="text-sm font-semibold text-neutral-700 uppercase tracking-wide mb-4">Account Information</h3>
        <div className="space-y-3">
          <div>
            <label className="text-xs font-medium text-neutral-500 uppercase tracking-wide">Username</label>
            <p className="text-base font-medium text-neutral-900 mt-1">{currentUsername}</p>
          </div>
          {email && (
            <div>
              <label className="text-xs font-medium text-neutral-500 uppercase tracking-wide">Email</label>
              <p className="text-base text-neutral-600 mt-1">{email}</p>
            </div>
          )}
        </div>
      </div>

      {/* Daily Reminder Section */}
      <div className="mb-6 pb-6 border-b border-neutral-100">
        <h3 className="text-sm font-semibold text-neutral-700 uppercase tracking-wide mb-4">Daily Reminder</h3>

        {/* Permission status badge */}
        <div className="flex items-center gap-2 mb-4 px-3 py-2 bg-neutral-50 rounded-xl border border-neutral-100">
          {permissionIcon()}
          <span className="text-xs font-medium text-neutral-500">{permissionLabel()}</span>
        </div>

        {reminderError && <Alert variant="error" className="mb-4">{reminderError}</Alert>}
        {reminderSuccess && (
          <Alert variant="success" className="mb-4" dismissible={false}>
            Reminders enabled! You'll be notified daily at {reminderTime}.
          </Alert>
        )}

        {/* Toggle row */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl transition-colors ${enabled ? 'bg-primary-50 text-primary-600' : 'bg-neutral-100 text-neutral-400'}`}>
              {enabled ? <Bell className="w-5 h-5" /> : <BellOff className="w-5 h-5" />}
            </div>
            <div>
              <p className="text-sm font-semibold text-neutral-800">Daily Bible Reminder</p>
              <p className="text-xs text-neutral-500">{enabled ? 'Reminders are on' : 'Reminders are off'}</p>
            </div>
          </div>
          <button
            onClick={handleToggleReminder}
            disabled={!isSupported || permission === 'denied'}
            className={`
              relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
              ${enabled ? 'bg-primary-600' : 'bg-neutral-200'}
              disabled:opacity-40 disabled:cursor-not-allowed
            `}
            aria-label="Toggle daily reminder"
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform duration-200 ${enabled ? 'translate-x-6' : 'translate-x-1'}`}
            />
          </button>
        </div>

        {/* Time picker — only shown when enabled or permission granted */}
        {(enabled || permission === 'granted') && (
          <div className="space-y-3 animate-fade-in">
            <FormGroup label="Reminder Time" hint="You'll receive a notification at this time every day.">
              <input
                type="time"
                value={reminderTime}
                onChange={(e) => handleTimeChange(e.target.value)}
                disabled={!enabled}
                className="w-full px-4 py-2.5 text-base font-normal border-2 rounded-xl border-neutral-300 transition-colors focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-offset-2 focus:ring-primary-500/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-neutral-50"
              />
            </FormGroup>

            {/* Test button */}
            {enabled && (
              <button
                onClick={handleTest}
                disabled={testSent}
                className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-primary-600 hover:text-primary-700 hover:bg-primary-50 rounded-xl transition-colors disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                {testSent ? 'Test notification sent!' : 'Send test notification'}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Change Username Section */}
      <div>
        <h3 className="text-sm font-semibold text-neutral-700 uppercase tracking-wide mb-4">Change Username</h3>

        {error && <Alert variant="error" className="mb-4">{error}</Alert>}
        {success && (
          <Alert variant="success" className="mb-4" dismissible={false}>
            Username changed successfully! Your profile and all data has been updated.
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <FormGroup label="New Username" hint="2-30 characters. This will update all your readings and leaderboard data.">
            <Input
              type="text"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              placeholder="Enter new username"
              disabled={isSubmitting || success}
              autoFocus
            />
          </FormGroup>

          <div className="flex gap-4 pt-6">
            <Button type="button" variant="ghost" fullWidth onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" fullWidth isLoading={isSubmitting} disabled={!newUsername.trim() || success}>
              Update Username
            </Button>
          </div>
        </form>
      </div>

      {/* Help Section */}
      <div className="mt-8 pt-6 border-t border-neutral-100">
        <p className="text-xs text-neutral-500">
          Need to change your password? Visit your <a href="#" className="text-primary-600 hover:text-primary-700 font-medium">account security settings</a>.
        </p>
      </div>
    </Modal>
  );
}
