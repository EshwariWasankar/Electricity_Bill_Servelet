import React from 'react';
import { ArrowRight, Sparkles, Star, TrendingUp, Award, Zap, Compass } from 'lucide-react';
import type { Book, Page } from '../types';
import { BookCard } from '../components/BookCard';

interface HomePageProps {
  books: Book[];
  setCurrentPage: (page: Page) => void;
  onAddToCart: (book: Book) => void;
  onQuickView: (book: Book) => void;
  setSelectedCategory: (category: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  books,
  setCurrentPage,
  onAddToCart,
  onQuickView,
  setSelectedCategory,
}) => {
  const topBooks = books.slice(0, 4);

  const categories = [
    { name: 'Technology', count: '1,240+ Books', icon: Zap, color: 'from-indigo-500 to-purple-600' },
    { name: 'Sci-Fi', count: '890+ Books', icon: Compass, color: 'from-cyan-500 to-blue-600' },
    { name: 'Self-Help', count: '650+ Books', icon: Sparkles, color: 'from-amber-500 to-rose-500' },
    { name: 'History', count: '430+ Books', icon: Award, color: 'from-emerald-500 to-teal-600' },
  ];

  const handleCategoryClick = (catName: string) => {
    setSelectedCategory(catName);
    setCurrentPage('catalogue');
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-20 pb-16 animate-fade-in">
      {/* Hero Section */}
      <section className="relative pt-12 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
        {/* Background Glowing Orbs */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-indigo-600/20 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-[400px] h-[250px] bg-pink-500/15 blur-[100px] rounded-full pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Hero Left Content */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left relative z-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold">
              <Sparkles className="w-4 h-4 text-pink-400" />
              <span>Discover Your Next Favorite Read</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-100 tracking-tight leading-[1.1]">
              Explore Endless Worlds Through <span className="gradient-text">Modern Literature</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
              Welcome to <strong className="text-white">BookVerse</strong>, your ultimate digital online bookstore. Explore thousands of bestselling titles, tech guides, sci-fi sagas, and timeless classics with instant checkout.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                onClick={() => setCurrentPage('catalogue')}
                className="btn-primary py-3.5 px-7 text-base font-bold shadow-lg shadow-indigo-600/30"
              >
                <span>Browse Full Catalogue</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              <button
                onClick={() => setCurrentPage('register')}
                className="btn-secondary py-3.5 px-6 text-base font-semibold"
              >
                Create Account
              </button>
            </div>

            {/* Key Metrics */}
            <div className="pt-8 border-t border-white/10 grid grid-cols-3 gap-4 max-w-lg mx-auto lg:mx-0 text-center lg:text-left">
              <div>
                <div className="text-2xl font-black text-white">50k+</div>
                <div className="text-xs text-slate-400">Available Titles</div>
              </div>
              <div>
                <div className="text-2xl font-black text-indigo-400">100k+</div>
                <div className="text-xs text-slate-400">Active Readers</div>
              </div>
              <div>
                <div className="text-2xl font-black text-pink-400">4.9 ★</div>
                <div className="text-xs text-slate-400">Customer Rating</div>
              </div>
            </div>
          </div>

          {/* Hero Right Graphic Card Stack */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              <div className="glass-card p-6 border-indigo-500/30 relative z-10 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="badge badge-cyan">Featured Highlight</span>
                  <div className="flex items-center gap-1 text-amber-400 text-xs font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span>4.9 / 5.0</span>
                  </div>
                </div>

                <div className="flex gap-4 items-center">
                  <img
                    src="https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=400&q=80"
                    alt="Featured Book"
                    className="w-24 h-32 object-cover rounded-lg shadow-md border border-white/10"
                  />
                  <div className="space-y-1">
                    <h3 className="text-base font-bold text-slate-100">The Pragmatic Programmer</h3>
                    <p className="text-xs text-indigo-400 font-semibold">by Andy Hunt & Dave Thomas</p>
                    <p className="text-xs text-slate-400 line-clamp-2">
                      Your journey to mastery in modern software craftsmanship and architecture.
                    </p>
                    <div className="pt-2 text-lg font-extrabold text-white">$49.99</div>
                  </div>
                </div>

                <button
                  onClick={() => setCurrentPage('catalogue')}
                  className="w-full btn-primary py-2.5 text-xs font-bold"
                >
                  View Details in Catalogue
                </button>
              </div>

              {/* Decorative Backdrops */}
              <div className="absolute -top-4 -right-4 w-full h-full glass-card bg-indigo-900/20 border-white/5 pointer-events-none" />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-100">Popular Categories</h2>
            <p className="text-sm text-slate-400 mt-1">Explore books curated by genre and topic</p>
          </div>
          <button
            onClick={() => {
              setSelectedCategory('all');
              setCurrentPage('catalogue');
            }}
            className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 self-start md:self-auto"
          >
            <span>View All Categories</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat) => {
            const IconComp = cat.icon;
            return (
              <div
                key={cat.name}
                onClick={() => handleCategoryClick(cat.name)}
                className="glass-card p-6 cursor-pointer group hover:scale-[1.02] transition-all"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${cat.color} flex items-center justify-center mb-4 shadow-lg`}>
                  <IconComp className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-slate-100 group-hover:text-indigo-400 transition-colors">
                  {cat.name}
                </h3>
                <p className="text-xs text-slate-400 mt-1 font-medium">{cat.count}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Trending Bestsellers Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-pink-400 uppercase tracking-wider mb-1">
              <TrendingUp className="w-4 h-4" /> Top Choices
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-100">Trending Bestsellers</h2>
          </div>
          <button
            onClick={() => setCurrentPage('catalogue')}
            className="btn-outline text-xs"
          >
            View Full Catalogue
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {topBooks.map((book) => (
            <BookCard
              key={book.id}
              book={book}
              onAddToCart={onAddToCart}
              onQuickView={onQuickView}
            />
          ))}
        </div>
      </section>

      {/* Special Promotional Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-panel p-8 sm:p-12 rounded-3xl relative overflow-hidden bg-gradient-to-r from-indigo-950/80 via-slate-900/90 to-purple-950/80 border-indigo-500/30">
          <div className="max-w-2xl space-y-4 relative z-10">
            <span className="badge badge-emerald">Spring Reading Sale</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">
              Get 20% Off Your First Order When You Register Today!
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Create your free BookVerse reader account to unlock personalized recommendations, member discounts, and synchronized database reading lists.
            </p>
            <div className="pt-2">
              <button
                onClick={() => setCurrentPage('register')}
                className="btn-primary py-3 px-8 text-sm font-bold shadow-xl"
              >
                Register Now & Save 20%
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
