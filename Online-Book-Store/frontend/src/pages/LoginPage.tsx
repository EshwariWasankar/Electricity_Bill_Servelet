import React, { useState } from 'react';
import { LogIn, Eye, EyeOff, Lock, Mail, AlertCircle, Sparkles, CheckCircle2 } from 'lucide-react';
import type { Page, User } from '../types';
import { loginUser } from '../services/api';

interface LoginPageProps {
  setCurrentPage: (page: Page) => void;
  onLoginSuccess: (user: User) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ setCurrentPage, onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setIsLoading(true);

    try {
      const res = await loginUser({ email, password });
      if (res.success && res.user) {
        setSuccessMessage(res.message || 'Login successful!');
        setTimeout(() => {
          onLoginSuccess(res.user!);
          setCurrentPage('catalogue');
        }, 1000);
      } else {
        setErrorMessage(res.message || 'Invalid email or password.');
      }
    } catch (err) {
      setErrorMessage('Failed to connect to authentication service.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoFill = () => {
    setEmail('demo@bookstore.com');
    setPassword('password123');
  };

  return (
    <div className="w-full flex-1 min-h-[70vh] flex items-center justify-center px-4 py-16 animate-fade-in">
      <div className="w-full max-w-md glass-panel p-8 rounded-3xl space-y-6 relative border-indigo-500/20 shadow-2xl">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-pink-500 flex items-center justify-center mx-auto shadow-lg shadow-indigo-600/30">
            <LogIn className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-slate-100">Welcome Back</h2>
          <p className="text-xs text-slate-400">
            Sign in to access your BookVerse account & order history
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

        {/* Demo Auto-fill Helper */}
        <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-between text-xs text-indigo-300">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-pink-400" />
            <span>Want to test quickly?</span>
          </div>
          <button
            type="button"
            onClick={handleDemoFill}
            className="font-bold underline hover:text-white transition-colors"
          >
            Auto-fill Demo Credentials
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 block">Email Address</label>
            <div className="relative">
              <input
                type="email"
                required
                placeholder="reader@bookstore.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input pl-10 py-2.5 text-sm"
              />
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-xs font-semibold text-slate-300 block">Password</label>
              <a href="#" onClick={(e) => e.preventDefault()} className="text-[11px] text-indigo-400 hover:underline">
                Forgot password?
              </a>
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input pl-10 pr-10 py-2.5 text-sm"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="remember"
              className="rounded bg-slate-900 border-white/20 text-indigo-600 focus:ring-indigo-500 accent-indigo-500 cursor-pointer"
            />
            <label htmlFor="remember" className="text-xs text-slate-400 cursor-pointer select-none">
              Remember me on this device
            </label>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full btn-primary py-3 text-sm font-bold shadow-lg mt-2"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Authenticating...
              </span>
            ) : (
              'Sign In to Account'
            )}
          </button>
        </form>

        {/* Footer Prompt */}
        <div className="pt-4 border-t border-white/10 text-center text-xs text-slate-400">
          <span>Don't have an account yet? </span>
          <button
            onClick={() => setCurrentPage('register')}
            className="text-indigo-400 font-bold hover:underline"
          >
            Register a new account
          </button>
        </div>
      </div>
    </div>
  );
};
