import { useState, useEffect } from 'react';
import Modal from './ui/Modal';
import { Calendar, TrendingUp, Users, CheckCircle2, Trophy, ArrowRight } from 'lucide-react';

interface GuideStep {
    title: string;
    description: string;
    icon: React.ComponentType<any>;
    color: string;
}

const steps: GuideStep[] = [
    {
        title: 'Welcome to Your Journey',
        description: 'Track your 90-day Bible reading challenge with ease. Join a community of believers growing together in the Word.',
        icon: Trophy,
        color: 'text-yellow-500 bg-yellow-100'
    },
    {
        title: 'Track Daily Progress',
        description: 'Log your daily readings and share insights. Fill up the progress bar as you complete each day of the challenge.',
        icon: CheckCircle2,
        color: 'text-green-500 bg-green-100'
    },
    {
        title: 'Build Your Streak',
        description: 'Consistency is key! Read every day to build your streak. Watch the fire icon light up as you maintain your momentum.',
        icon: TrendingUp,
        color: 'text-orange-500 bg-orange-100'
    },
    {
        title: 'Compete & Connect',
        description: 'Check the Leaderboard to see how others are doing. Stay motivated by seeing the group\'s collective progress.',
        icon: Users,
        color: 'text-purple-500 bg-purple-100'
    },
    {
        title: 'Plan Your Schedule',
        description: 'Use the Calendar view to see past readings and plan for upcoming days. You can backfill any missed days here too.',
        icon: Calendar,
        color: 'text-indigo-500 bg-indigo-100'
    }
];

interface WalkthroughModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function WalkthroughModal({ isOpen, onClose }: WalkthroughModalProps) {
    const [currentStep, setCurrentStep] = useState(0);

    // Reset step when modal opens
    useEffect(() => {
        if (isOpen) {
            setCurrentStep(0);
        }
    }, [isOpen]);

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            onClose();
        }
    };

    const step = steps[currentStep];
    const Icon = step.icon;

    return (
        <Modal isOpen={isOpen} onClose={onClose} maxWidth="md" title="How it Works">
            <div className="flex flex-col items-center text-center p-2">
                {/* Step Indicator */}
                <div className="flex justify-center gap-1.5 mb-8">
                    {steps.map((_, index) => (
                        <div
                            key={index}
                            className={`h-1.5 rounded-full transition-all duration-300 ${index === currentStep
                                    ? 'w-6 bg-primary-600'
                                    : 'w-1.5 bg-neutral-200'
                                }`}
                        />
                    ))}
                </div>

                {/* Icon */}
                <div className={`p-6 rounded-3xl ${step.color} mb-6 transform transition-all duration-500 ease-out scale-100`}>
                    <Icon className="w-12 h-12" />
                </div>

                {/* Content */}
                <h3 className="text-2xl font-bold text-neutral-900 mb-3 animate-fade-in">
                    {step.title}
                </h3>
                <p className="text-neutral-500 leading-relaxed mb-8 max-w-sm animate-fade-in">
                    {step.description}
                </p>

                {/* Action Button */}
                <button
                    onClick={handleNext}
                    className="w-full sm:w-auto px-8 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 group"
                >
                    {currentStep === steps.length - 1 ? "Let's Get Started!" : 'Next Step'}
                    {currentStep < steps.length - 1 && (
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    )}
                </button>
            </div>
        </Modal>
    );
}
