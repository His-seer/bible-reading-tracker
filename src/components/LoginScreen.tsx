import React, { useState } from 'react';
import { Book, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { GoogleLogo } from './ui/GoogleLogo';
import Button from './ui/Button';
import Input from './ui/Input';
import Card from './ui/Card';
import Alert from './ui/Alert';
import Loading from './ui/Loading';

type TabType = 'login' | 'signup';

export function LoginScreen() {
  const { login, signUp, loading, error, resetPassword, signInWithGoogle } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetPasswordSent, setResetPasswordSent] = useState(false);

  // Detect iOS PWA standalone mode — Google popup/redirect both fail here due to WebKit ITP
  const isStandalone =
    ('standalone' in navigator && (navigator as any).standalone === true) ||
    window.matchMedia('(display-mode: standalone)').matches;

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Sign up form state
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('');
  const [signupUsername, setSignupUsername] = useState('');
  const [signupTerms, setSignupTerms] = useState(false);

  const validatePasswordStrength = (password: string): { strength: 'weak' | 'fair' | 'strong'; message: string } => {
    let strength: 'weak' | 'fair' | 'strong' = 'weak';
    let message = 'Too weak';

    if (password.length >= 8) {
      strength = 'fair';
      message = 'Good';
    }
    if (password.length >= 8 && /[A-Z]/.test(password) && /[0-9]/.test(password)) {
      strength = 'strong';
      message = 'Strong';
    }

    return { strength, message };
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(loginEmail, loginPassword);
    if (!error) {
      setLoginEmail('');
      setLoginPassword('');
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (signupPassword !== signupConfirmPassword) {
      alert('Passwords do not match');
      return;
    }

    if (!signupTerms) {
      alert('Please accept the terms and conditions');
      return;
    }

    await signUp(signupEmail, signupPassword, signupUsername);
    if (!error) {
      setSignupEmail('');
      setSignupPassword('');
      setSignupConfirmPassword('');
      setSignupUsername('');
      setSignupTerms(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    await resetPassword(forgotPasswordEmail);
    if (!error) {
      setResetPasswordSent(true);
      setForgotPasswordEmail('');
      setTimeout(() => setResetPasswordSent(false), 5000);
    }
  };

  const passwordStrength = validatePasswordStrength(activeTab === 'login' ? loginPassword : signupPassword);

  if (showForgotPassword) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-4">
        <Card variant="elevated" padding="lg" className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-xl text-white">
                <Book className="w-8 h-8" />
              </div>
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
              Bible Reading Tracker
            </h1>
            <p className="text-neutral-600 mt-2">Reset your password</p>
          </div>

          {/* Error */}
          {error && <Alert variant="error" className="mb-6">{error}</Alert>}

          {/* Success Message */}
          {resetPasswordSent && (
            <Alert variant="success" className="mb-6">
              Check your email for password reset instructions
            </Alert>
          )}

          {/* Form */}
          <form onSubmit={handleForgotPassword} className="space-y-4">
            <Input
              label="Email Address"
              type="email"
              placeholder="you@example.com"
              value={forgotPasswordEmail}
              onChange={(e) => setForgotPasswordEmail(e.target.value)}
              required
              disabled={loading}
            />

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="ghost"
                fullWidth
                onClick={() => setShowForgotPassword(false)}
                disabled={loading}
              >
                Back to Login
              </Button>
              <Button type="submit" fullWidth isLoading={loading}>
                Send Reset Link
              </Button>
            </div>
          </form>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-4">
      <Card variant="elevated" padding="lg" className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-gradient-to-br from-primary-600 to-secondary-600 rounded-2xl text-white shadow-lg shadow-primary-500/20 animate-float">
              <Book className="w-10 h-10" />
            </div>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent mb-3">
            Bible Reading Tracker
          </h1>
          <p className="text-neutral-500 text-lg font-medium">Track your daily Bible reading journey</p>
        </div>

        {/* Tabs */}
        <div className="flex p-1 bg-neutral-100 rounded-xl mb-8 relative">
          <div
            className={`absolute h-[calc(100%-8px)] top-1 bg-white rounded-lg shadow-sm transition-all duration-300 ease-out`}
            style={{
              width: 'calc(50% - 4px)',
              left: activeTab === 'login' ? '4px' : 'calc(50%)'
            }}
          />
          <button
            onClick={() => setActiveTab('login')}
            className={`flex-1 py-2.5 px-6 font-semibold transition-all duration-300 relative z-10 ${activeTab === 'login'
              ? 'text-primary-600'
              : 'text-neutral-500 hover:text-neutral-700'
              }`}
          >
            Login
          </button>
          <button
            onClick={() => setActiveTab('signup')}
            className={`flex-1 py-2.5 px-6 font-semibold transition-all duration-300 relative z-10 ${activeTab === 'signup'
              ? 'text-primary-600'
              : 'text-neutral-500 hover:text-neutral-700'
              }`}
          >
            Sign Up
          </button>
        </div>

        {/* Error Alert */}
        {error && <Alert variant="error" className="mb-6">{error}</Alert>}

        {/* Login Tab */}
        {activeTab === 'login' && (
          <form onSubmit={handleLogin} className="space-y-5">
            <Input
              label="Email Address"
              type="email"
              placeholder="you@example.com"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              required
              disabled={loading}
              autoComplete="email"
            />

            <div className="relative">
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                required
                disabled={loading}
                autoComplete="current-password"
                icon={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-neutral-400 hover:text-neutral-600"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                }
                iconPosition="right"
              />
            </div>

            <div className="flex justify-end pt-1">
              <button
                type="button"
                onClick={() => setShowForgotPassword(true)}
                className="text-sm text-primary-600 hover:text-primary-700 font-semibold transition-colors"
              >
                Forgot password?
              </button>
            </div>

            <Button type="submit" fullWidth isLoading={loading} className="mt-2 py-3 text-lg">
              Sign In
            </Button>

            <p className="text-center text-sm text-neutral-500 mt-4">
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => setActiveTab('signup')}
                className="text-primary-600 hover:text-primary-700 font-bold transition-colors"
              >
                Sign up here
              </button>
            </p>
          </form>
        )}

        {/* Google Sign In - Show on both tabs to make it easy */}
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-neutral-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-neutral-500">Or continue with</span>
            </div>
          </div>

          {/* Google Sign In */}
          {isStandalone ? (
            // iOS PWA: Google OAuth can't complete inside the standalone WebView.
            // Direct the user to open in Safari where it works fine.
            <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-xl text-center">
              <p className="text-sm font-semibold text-amber-800 mb-1">Sign in with Google</p>
              <p className="text-xs text-amber-600 mb-3">
                Google sign-in requires opening in your browser due to iOS restrictions.
              </p>
              <a
                href={window.location.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-amber-300 rounded-xl text-sm font-bold text-amber-800 hover:bg-amber-50 transition-colors shadow-sm"
              >
                <GoogleLogo className="w-4 h-4" />
                Open in Safari to sign in with Google
              </a>
            </div>
          ) : (
            <button
              type="button"
              onClick={signInWithGoogle}
              disabled={loading}
              className="mt-6 w-full flex items-center justify-center gap-3 px-4 py-3 border border-neutral-300 rounded-xl shadow-sm bg-white text-neutral-700 font-medium hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-200"
            >
              <GoogleLogo className="w-5 h-5" />
              <span>Sign in with Google</span>
            </button>
          )}
        </div>

        {/* Sign Up Tab */}
        {activeTab === 'signup' && (
          <form onSubmit={handleSignUp} className="space-y-5">
            <Input
              label="Email Address"
              type="email"
              placeholder="you@example.com"
              value={signupEmail}
              onChange={(e) => setSignupEmail(e.target.value)}
              required
              disabled={loading}
              autoComplete="email"
            />

            <Input
              label="Username"
              type="text"
              placeholder="Your display name"
              value={signupUsername}
              onChange={(e) => setSignupUsername(e.target.value)}
              required
              disabled={loading}
              hint="2-30 characters"
              autoComplete="username"
            />

            <div className="space-y-1">
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={signupPassword}
                onChange={(e) => setSignupPassword(e.target.value)}
                required
                disabled={loading}
                autoComplete="new-password"
                icon={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="p-1 -mr-1 text-neutral-400 hover:text-primary-600 transition-colors rounded-md"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                }
                iconPosition="right"
              />
              <div className="px-1 pt-1">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Strength</span>
                  <span className={`text-xs font-bold ${signupPassword.length === 0
                    ? 'text-neutral-400'
                    : passwordStrength.strength === 'weak'
                      ? 'text-error-500'
                      : passwordStrength.strength === 'fair'
                        ? 'text-warning-500'
                        : 'text-success-500'
                    }`}>
                    {passwordStrength.message}
                  </span>
                </div>
                <div className="h-2 w-full bg-neutral-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 ease-out ${signupPassword.length === 0
                      ? 'w-0'
                      : passwordStrength.strength === 'weak'
                        ? 'w-1/3 bg-error-500'
                        : passwordStrength.strength === 'fair'
                          ? 'w-2/3 bg-warning-500'
                          : 'w-full bg-success-500'
                      }`}
                  />
                </div>
              </div>
            </div>

            <Input
              label="Confirm Password"
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={signupConfirmPassword}
              onChange={(e) => setSignupConfirmPassword(e.target.value)}
              required
              disabled={loading}
              autoComplete="new-password"
              icon={
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="text-neutral-400 hover:text-neutral-600"
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              }
              iconPosition="right"
            />

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={signupTerms}
                onChange={(e) => setSignupTerms(e.target.checked)}
                disabled={loading}
                className="mt-1 w-4 h-4 rounded-sm border-2 border-primary-500 text-primary-600 cursor-pointer focus:ring-2 focus:ring-primary-500/20"
              />
              <span className="text-sm text-neutral-600">
                I agree to the{' '}
                <a href="#" className="text-primary-600 hover:text-primary-700 font-semibold">
                  Terms & Conditions
                </a>
              </span>
            </label>

            <Button type="submit" fullWidth isLoading={loading} className="mt-4 py-3 text-lg">
              Create Account
            </Button>

            <p className="text-center text-sm text-neutral-500 mt-4">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => setActiveTab('login')}
                className="text-primary-600 hover:text-primary-700 font-bold transition-colors"
              >
                Sign in here
              </button>
            </p>
          </form>
        )}

        {/* Loading State */}
        {loading && <Loading fullScreen message="Please wait..." />}
      </Card>
    </div>
  );
}

export default LoginScreen;
