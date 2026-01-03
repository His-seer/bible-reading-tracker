import { useState } from 'react';
import Modal from './ui/Modal';
import Input from './ui/Input';
import Button from './ui/Button';
import Alert from './ui/Alert';
import FormGroup from './ui/FormGroup';

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
            <Button
              type="button"
              variant="ghost"
              fullWidth
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              fullWidth
              isLoading={isSubmitting}
              disabled={!newUsername.trim() || success}
            >
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
