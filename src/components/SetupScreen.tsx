import React, { useState } from 'react';
import { Book, Users } from 'lucide-react';

interface SetupScreenProps {
  onSetup: (username: string) => void;
  participantCount: number;
  error?: string | null;
  loading?: boolean;
}

export function SetupScreen({ onSetup, participantCount, error, loading }: SetupScreenProps) {
  const [username, setUsername] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      onSetup(username);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-8 shadow-2xl max-w-md w-full">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full mb-4 shadow-lg">
            <Book className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Join the Challenge
          </h1>
          <p className="text-gray-600">Enter your name to start your 90-day journey</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Your name"
            className="w-full p-4 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none text-lg"
            disabled={loading}
            autoFocus
          />

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={!username.trim() || loading}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold py-4 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Starting...' : 'Start My Journey'}
          </button>
        </form>

        {participantCount > 0 && (
          <div className="mt-6 text-center text-sm text-gray-600">
            <Users className="w-4 h-4 inline mr-1" />
            {participantCount} {participantCount === 1 ? 'person is' : 'people are'} already participating!
          </div>
        )}
      </div>
    </div>
  );
}
