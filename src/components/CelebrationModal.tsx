import { Trophy, X, Star } from 'lucide-react';
import { useEffect, useState } from 'react';

interface CelebrationModalProps {
  show: boolean;
  username: string;
  message: string;
  onClose?: () => void;
}

// Confetti particle component
function ConfettiParticle({ delay, color }: { delay: number; color: string }) {
  return (
    <div
      className="absolute w-3 h-3 rounded-sm"
      style={{
        left: `${Math.random() * 100}%`,
        top: '-10px',
        backgroundColor: color,
        animation: `confetti 3s ease-out ${delay}s forwards`,
        transform: `rotate(${Math.random() * 360}deg)`,
      }}
    />
  );
}

export function CelebrationModal({ show, username, message, onClose }: CelebrationModalProps) {
  const [particles, setParticles] = useState<{ id: number; delay: number; color: string }[]>([]);

  useEffect(() => {
    if (show) {
      // Generate confetti particles
      const colors = ['#4f46e5', '#9333ea', '#ec4899', '#facc15', '#22c55e', '#3b82f6'];
      const newParticles = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        delay: Math.random() * 0.5,
        color: colors[Math.floor(Math.random() * colors.length)],
      }));
      setParticles(newParticles);
    } else {
      setParticles([]);
    }
  }, [show]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur-sm animate-fade-in">
      {/* Confetti */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map((particle) => (
          <ConfettiParticle key={particle.id} delay={particle.delay} color={particle.color} />
        ))}
      </div>

      {/* Modal */}
      <div className="bg-white rounded-2xl p-8 shadow-2xl text-center max-w-md mx-4 animate-scale-in relative">
        {/* Close button */}
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close celebration"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Floating stars */}
        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 flex gap-2">
          <Star className="w-8 h-8 text-yellow-400 fill-yellow-400 animate-float" style={{ animationDelay: '0s' }} />
          <Star className="w-6 h-6 text-yellow-400 fill-yellow-400 animate-float" style={{ animationDelay: '0.2s' }} />
          <Star className="w-8 h-8 text-yellow-400 fill-yellow-400 animate-float" style={{ animationDelay: '0.4s' }} />
        </div>

        {/* Trophy with glow */}
        <div className="relative inline-block mb-4">
          <div className="absolute inset-0 bg-yellow-400/30 blur-xl rounded-full" />
          <Trophy className="w-20 h-20 text-yellow-500 relative animate-float" />
        </div>

        <h3 className="text-3xl font-bold text-gray-800 mb-2">
          Amazing, {username}! 🎊
        </h3>
        <p className="text-xl text-gray-600 mb-4">{message}</p>

        {/* Emoji parade */}
        <div className="text-5xl mb-4 flex justify-center gap-2">
          <span className="animate-float" style={{ animationDelay: '0s' }}>🎉</span>
          <span className="animate-float" style={{ animationDelay: '0.1s' }}>📖</span>
          <span className="animate-float" style={{ animationDelay: '0.2s' }}>✨</span>
        </div>

        <p className="text-gray-500 text-sm">Your progress has been shared with the group!</p>

        {onClose && (
          <button
            onClick={onClose}
            className="mt-6 px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
          >
            Continue Reading
          </button>
        )}
      </div>
    </div>
  );
}

