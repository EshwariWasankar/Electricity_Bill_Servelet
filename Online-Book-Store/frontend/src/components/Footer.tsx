import React, { useState } from 'react';
import { BookOpen, Send, Heart, Shield, Truck, RefreshCw, CheckCircle2 } from 'lucide-react';
import type { Page } from '../types';

interface FooterProps {
  setCurrentPage: (page: Page) => void;
}

export const Footer: React.FC<FooterProps> = ({ setCurrentPage }) => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail) {
      setSubscribed(true);
      setTimeout(() => {
        setNewsletterEmail('');
        setSubscribed(false);
      }, 4000);
    }
  };

  return (
    <footer className="w-full mt-24 border-t border-[var(--border-color)] bg-slate-950/80 backdrop-blur-xl">
      {/* Top Value Propositions */}
      <div className="border-b border-white/5 py-8">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-4 p-4 rounded-xl bg-white/[0.02]">
            <div className="p-3 rounded-lg bg-indigo-500/10 text-indigo-400">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-200">Express Delivery</h4>
              <p className="text-xs text-slate-400">Free shipping on orders over $35</p>
            </div>
          </div>
          <div className="flex items-center justify-center sm:justify-start gap-4 p-4 rounded-xl bg-white/[0.02]">
            <div className="p-3 rounded-lg bg-pink-500/10 text-pink-400">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-200">Secure Payments</h4>
              <p className="text-xs text-slate-400">256-bit encrypted transactions</p>
            </div>
          </div>
          <div className="flex items-center justify-center sm:justify-start gap-4 p-4 rounded-xl bg-white/[0.02]">
            <div className="p-3 rounded-lg bg-emerald-500/10 text-emerald-400">
              <RefreshCw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-200">30-Day Guarantee</h4>
              <p className="text-xs text-slate-400">Hassle-free returns & refunds</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand Column */}
        <div className="space-y-4 md:col-span-1">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-indigo-600 to-pink-500 flex items-center justify-center shadow-lg">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight gradient-text">BOOKVERSE</span>
          </div>
          <p className="text-sm text-slate-400 leading-relaxed">
            Your premier destination for digital & physical literature. Powered by React, TypeScript, Spring Boot, and MongoDB.
          </p>
          <div className="flex items-center gap-3 text-slate-400">
            <span className="text-xs uppercase tracking-wider font-semibold text-slate-500">Tech Stack:</span>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">React TS</span>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">Spring Boot</span>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-green-500/20 text-green-300 border border-green-500/30">MongoDB</span>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-sm font-bold text-slate-200 uppercase tracking-wider mb-4">Store Pages</h4>
          <ul className="space-y-2.5 text-sm text-slate-400">
            <li>
              <button onClick={() => setCurrentPage('home')} className="hover:text-indigo-400 transition-colors">
                Home Page
              </button>
            </li>
            <li>
              <button onClick={() => setCurrentPage('catalogue')} className="hover:text-indigo-400 transition-colors">
                Book Catalogue
              </button>
            </li>
            <li>
              <button onClick={() => setCurrentPage('login')} className="hover:text-indigo-400 transition-colors">
                Member Login
              </button>
            </li>
            <li>
              <button onClick={() => setCurrentPage('register')} className="hover:text-indigo-400 transition-colors">
                New User Registration
              </button>
            </li>
          </ul>
        </div>

        {/* Genres */}
        <div>
          <h4 className="text-sm font-bold text-slate-200 uppercase tracking-wider mb-4">Popular Genres</h4>
          <ul className="space-y-2.5 text-sm text-slate-400">
            <li><button onClick={() => setCurrentPage('catalogue')} className="hover:text-pink-400 transition-colors">Technology & Coding</button></li>
            <li><button onClick={() => setCurrentPage('catalogue')} className="hover:text-pink-400 transition-colors">Science Fiction & Fantasy</button></li>
            <li><button onClick={() => setCurrentPage('catalogue')} className="hover:text-pink-400 transition-colors">Self-Help & Productivity</button></li>
            <li><button onClick={() => setCurrentPage('catalogue')} className="hover:text-pink-400 transition-colors">History & Biography</button></li>
          </ul>
        </div>

        {/* Newsletter Column */}
        <div className="space-y-4">
          <h4 className="text-sm font-bold text-slate-200 uppercase tracking-wider">Stay Connected</h4>
          <p className="text-xs text-slate-400">
            Subscribe for exclusive author interviews, weekly book discounts, and recommendations.
          </p>

          {subscribed ? (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-sm font-medium animate-fade-in">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span>Thank you for subscribing! Check your inbox soon.</span>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <input
                type="email"
                required
                placeholder="Enter your email"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                className="form-input py-2 text-sm text-slate-200"
              />
              <button type="submit" className="btn-primary py-2 px-3">
                <Send className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Bottom copyright */}
      <div className="border-t border-white/5 py-6 text-center text-xs text-slate-500">
        <p className="flex items-center justify-center gap-1">
          Designed with <Heart className="w-3.5 h-3.5 text-pink-500 fill-pink-500" /> for WT Assignment — React TS + Spring Boot + MongoDB
        </p>
      </div>
    </footer>
  );
};
