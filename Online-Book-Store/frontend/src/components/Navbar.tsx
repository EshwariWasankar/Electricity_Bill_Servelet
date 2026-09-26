import React from 'react';
import { BookOpen, ShoppingBag, Search, LogOut, Database } from 'lucide-react';
import type { Page, User } from '../types';

interface NavbarProps {
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
  cartCount: number;
  onOpenCart: () => void;
  currentUser: User | null;
  onLogout: () => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  isLiveBackend: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  setCurrentPage,
  cartCount,
  onOpenCart,
  currentUser,
  onLogout,
  searchQuery,
  setSearchQuery,
  isLiveBackend,
}) => {
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentPage !== 'catalogue') {
      setCurrentPage('catalogue');
    }
  };

  return (
    <header className="w-full sticky top-0 z-40 glass-panel border-b border-[var(--border-color)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div 
          onClick={() => setCurrentPage('home')}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-indigo-600 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/30 group-hover:scale-105 transition-transform duration-300">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold tracking-tight gradient-text">BOOKVERSE</span>
              <span className="hidden sm:inline-block text-[10px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                PRO
              </span>
            </div>
            <p className="text-[11px] text-[var(--text-subtle)] font-medium -mt-1">
              Online Book Store & Library
            </p>
          </div>
        </div>

        {/* Global Search Bar */}
        <form onSubmit={handleSearchSubmit} className="hidden md:flex flex-1 max-w-md relative">
          <input
            type="text"
            placeholder="Search by title, author, or ISBN..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="form-input pr-10 py-2.5 rounded-full text-sm bg-slate-900/60 focus:bg-slate-900"
          />
          <button 
            type="submit" 
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-400 transition-colors"
          >
            <Search className="w-4 h-4" />
          </button>
        </form>

        {/* Navigation & Actions */}
        <nav className="flex items-center gap-2 sm:gap-4">
          <button
            onClick={() => setCurrentPage('home')}
            className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-all ${
              currentPage === 'home'
                ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            Home
          </button>

          <button
            onClick={() => setCurrentPage('catalogue')}
            className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-all ${
              currentPage === 'catalogue'
                ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            Catalogue
          </button>

          {/* Cart Icon Button */}
          <button
            onClick={onOpenCart}
            className="relative p-2.5 rounded-xl bg-slate-900/60 border border-[var(--border-color)] text-slate-200 hover:text-white hover:border-indigo-500/50 transition-all group"
            title="View Shopping Cart"
          >
            <ShoppingBag className="w-5 h-5 group-hover:scale-110 transition-transform" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-gradient-to-r from-pink-500 to-indigo-600 text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-lg border border-slate-900 animate-bounce">
                {cartCount}
              </span>
            )}
          </button>

          {/* Authentication Navigation / User Profile */}
          {currentUser ? (
            <div className="flex items-center gap-3 pl-2 border-l border-white/10">
              <div className="hidden sm:flex flex-col text-right">
                <span className="text-xs font-bold text-slate-200">{currentUser.name}</span>
                <span className="text-[10px] text-indigo-400 font-medium capitalize">{currentUser.favoriteGenre || 'Reader'}</span>
              </div>
              <button
                onClick={onLogout}
                className="p-2.5 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500/20 transition-all"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 pl-2 border-l border-white/10">
              <button
                onClick={() => setCurrentPage('login')}
                className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                  currentPage === 'login'
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                Login
              </button>
              <button
                onClick={() => setCurrentPage('register')}
                className="hidden sm:inline-flex btn-primary py-2 px-4 text-sm"
              >
                Register
              </button>
            </div>
          )}

          {/* Database Live Status Badge */}
          <div 
            className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border"
            style={{
              backgroundColor: isLiveBackend ? 'rgba(16, 185, 129, 0.12)' : 'rgba(245, 158, 11, 0.12)',
              borderColor: isLiveBackend ? 'rgba(16, 185, 129, 0.3)' : 'rgba(245, 158, 11, 0.3)',
              color: isLiveBackend ? '#6ee7b7' : '#fcd34d'
            }}
            title={isLiveBackend ? "Connected to Spring Boot & MongoDB Live Server" : "Operating in Responsive Offline/Mock DB Mode"}
          >
            <Database className="w-3 h-3" />
            <span>{isLiveBackend ? 'Spring MongoDB' : 'Mock DB'}</span>
          </div>
        </nav>
      </div>
    </header>
  );
};
