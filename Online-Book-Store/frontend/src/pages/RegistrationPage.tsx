import React, { useState } from 'react';
import { UserPlus, User as UserIcon, Mail, Lock, Heart, CheckCircle2, AlertCircle } from 'lucide-react';
import type { Page, User } from '../types';
import { registerUser } from '../services/api';

interface RegistrationPageProps {
  setCurrentPage: (page: Page) => void;
  onRegisterSuccess: (user: User) => void;
}

export const RegistrationPage: React.FC<RegistrationPageProps> = ({
  setCurrentPage,
  onRegisterSuccess,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [favoriteGenre, setFavoriteGenre] = useState('Technology');
  const [agreedTerms, setAgreedTerms] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please re-enter your password.');
      return;
    }

    if (!agreedTerms) {
      setErrorMessage('Please accept the Terms of Service to create your account.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await registerUser({
        name,
        email,
        password,
        favoriteGenre,
      });

      if (res.success && res.user) {
        setSuccessMessage(res.message || 'Registration successful! Database account created.');
        setTimeout(() => {
          onRegisterSuccess(res.user!);
          setCurrentPage('catalogue');
        }, 1200);
      } else {
        setErrorMessage(res.message || 'Registration failed. Please try again.');
      }
    } catch (err) {
      setErrorMessage('Failed to connect to database server.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full flex-1 min-h-[70vh] flex items-center justify-center px-4 py-12 animate-fade-in">
      <div className="w-full max-w-lg glass-panel p-8 rounded-3xl space-y-6 relative border-pink-500/20 shadow-2xl">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-pink-500 to-indigo-600 flex items-center justify-center mx-auto shadow-lg shadow-pink-500/30">
            <UserPlus className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-slate-100">Create Account</h2>
          <p className="text-xs text-slate-400">
            Join BookVerse to save reading history to MongoDB database
          </p>
        </div>

        {/* Alerts */}
        {errorMessage && (
          <div className="p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-medium flex items-center gap-2 animate-fade-in">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-medium flex items-center gap-2 animate-fade-in">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 block">Full Name</label>
            <div className="relative">
              <input
                type="text"
                required
                placeholder="Jane Reader"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="form-input pl-10 py-2.5 text-sm"
              />
              <UserIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 block">Email Address</label>
            <div className="relative">
              <input
                type="email"
                required
                placeholder="jane@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input pl-10 py-2.5 text-sm"
              />
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 block">Password</label>
              <div className="relative">
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-input pl-10 py-2.5 text-sm"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 block">Confirm Password</label>
              <div className="relative">
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`form-input pl-10 py-2.5 text-sm ${
                    confirmPassword && password !== confirmPassword ? 'border-rose-500/80 focus:border-rose-500' : ''
                  }`}
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 block">Favorite Reading Genre</label>
            <div className="relative">
              <select
                value={favoriteGenre}
                onChange={(e) => setFavoriteGenre(e.target.value)}
                className="form-input pl-10 py-2.5 text-sm cursor-pointer bg-slate-900/90 text-slate-200"
              >
                <option value="Technology">Technology & Programming</option>
                <option value="Sci-Fi">Science Fiction & Fantasy</option>
                <option value="Self-Help">Self-Help & Mindset</option>
                <option value="History">History & Biography</option>
                <option value="Fiction">Classics & Fiction</option>
              </select>
              <Heart className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="terms"
              checked={agreedTerms}
              onChange={(e) => setAgreedTerms(e.target.checked)}
              className="rounded bg-slate-900 border-white/20 text-indigo-600 focus:ring-indigo-500 accent-indigo-500 cursor-pointer"
            />
            <label htmlFor="terms" className="text-xs text-slate-400 cursor-pointer select-none">
              I agree to the <a href="#" onClick={(e) => e.preventDefault()} className="text-indigo-400 underline">Terms of Service</a> & <a href="#" onClick={(e) => e.preventDefault()} className="text-indigo-400 underline">Privacy Policy</a>
            </label>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full btn-primary py-3 text-sm font-bold shadow-lg mt-2 bg-gradient-to-r from-pink-600 to-indigo-600"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Registering to MongoDB...
              </span>
            ) : (
              'Create My Account'
            )}
          </button>
        </form>

        {/* Footer Prompt */}
        <div className="pt-4 border-t border-white/10 text-center text-xs text-slate-400">
          <span>Already registered? </span>
          <button
            onClick={() => setCurrentPage('login')}
            className="text-indigo-400 font-bold hover:underline"
          >
            Sign in instead
          </button>
        </div>
      </div>
    </div>
  );
};
