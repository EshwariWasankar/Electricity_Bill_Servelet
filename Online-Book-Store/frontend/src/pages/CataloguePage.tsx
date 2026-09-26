import React, { useState, useMemo } from 'react';
import { Search, Filter, Grid, List as ListIcon, RotateCcw, BookOpen, Star, ShoppingBag, Eye } from 'lucide-react';
import type { Book } from '../types';
import { BookCard } from '../components/BookCard';

interface CataloguePageProps {
  books: Book[];
  onAddToCart: (book: Book) => void;
  onQuickView: (book: Book) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const CataloguePage: React.FC<CataloguePageProps> = ({
  books,
  onAddToCart,
  onQuickView,
  selectedCategory,
  setSelectedCategory,
  searchQuery,
  setSearchQuery,
}) => {
  const [maxPrice, setMaxPrice] = useState<number>(100);
  const [minRating, setMinRating] = useState<number>(0);
  const [sortBy, setSortBy] = useState<string>('featured');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Extract unique categories dynamically
  const categories = useMemo(() => {
    const set = new Set<string>();
    books.forEach((b) => set.add(b.category));
    return ['all', ...Array.from(set)];
  }, [books]);

  // Filter & Sort Logic
  const filteredBooks = useMemo(() => {
    return books
      .filter((book) => {
        const matchesCategory =
          selectedCategory === 'all' ||
          book.category.toLowerCase() === selectedCategory.toLowerCase();
        const matchesQuery =
          searchQuery.trim() === '' ||
          book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
          book.isbn.includes(searchQuery);
        const matchesPrice = book.price <= maxPrice;
        const matchesRating = book.rating >= minRating;

        return matchesCategory && matchesQuery && matchesPrice && matchesRating;
      })
      .sort((a, b) => {
        if (sortBy === 'price-low') return a.price - b.price;
        if (sortBy === 'price-high') return b.price - a.price;
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'title') return a.title.localeCompare(b.title);
        return 0; // Default order
      });
  }, [books, selectedCategory, searchQuery, maxPrice, minRating, sortBy]);

  const handleResetFilters = () => {
    setSelectedCategory('all');
    setSearchQuery('');
    setMaxPrice(100);
    setMinRating(0);
    setSortBy('featured');
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16 space-y-8 animate-fade-in">
      {/* Header Banner */}
      <div className="space-y-2">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-100">Book Catalogue</h1>
        <p className="text-sm text-slate-400">
          Discover and filter through our digital library collection
        </p>
      </div>

      {/* Filter Toolbar */}
      <div className="glass-panel p-5 rounded-2xl space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          {/* Search Box */}
          <div className="md:col-span-5 relative">
            <input
              type="text"
              placeholder="Search by title, author, or ISBN..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-input pr-10 py-2.5 text-sm"
            />
            <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
          </div>

          {/* Sort Selector */}
          <div className="md:col-span-4 flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-400 whitespace-nowrap">Sort By:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="form-input py-2.5 text-sm cursor-pointer bg-slate-900/90 text-slate-200"
            >
              <option value="featured">Featured Popularity</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="title">Title: A to Z</option>
            </select>
          </div>

          {/* View Switcher & Reset Button */}
          <div className="md:col-span-3 flex items-center justify-end gap-3">
            <button
              onClick={handleResetFilters}
              className="btn-secondary py-2 px-3 text-xs font-semibold"
              title="Reset all filters"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset
            </button>

            <div className="flex bg-slate-900/80 p-1 rounded-xl border border-white/10">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg text-xs transition-colors ${
                  viewMode === 'grid' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
                title="Grid View"
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg text-xs transition-colors ${
                  viewMode === 'list' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
                title="List View"
              >
                <ListIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Category Pills & Sliders */}
        <div className="pt-4 border-t border-white/10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Category Badges */}
          <div className="lg:col-span-8 flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-slate-400 mr-2 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5 text-indigo-400" /> Genre:
            </span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold capitalize transition-all ${
                  selectedCategory.toLowerCase() === cat.toLowerCase()
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/40 border border-indigo-400'
                    : 'bg-white/5 text-slate-300 hover:bg-white/10 border border-white/5'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Price Range Slider */}
          <div className="lg:col-span-4 flex items-center gap-3">
            <span className="text-xs font-semibold text-slate-400 whitespace-nowrap">
              Max Price: <strong className="text-white">${maxPrice}</strong>
            </span>
            <input
              type="range"
              min="10"
              max="100"
              step="5"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-indigo-500 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Results Header */}
      <div className="flex justify-between items-center text-xs text-slate-400 px-1">
        <span>
          Showing <strong className="text-slate-200">{filteredBooks.length}</strong> books
          {selectedCategory !== 'all' && ` in ${selectedCategory}`}
        </span>
      </div>

      {/* Book Grid / List Output */}
      {filteredBooks.length === 0 ? (
        <div className="glass-panel p-16 text-center space-y-4 rounded-2xl">
          <BookOpen className="w-12 h-12 text-slate-500 mx-auto" />
          <h3 className="text-lg font-bold text-slate-200">No matching books found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Try adjusting your search query, increasing max price limit, or selecting a different category.
          </p>
          <button onClick={handleResetFilters} className="btn-primary py-2 px-5 text-xs font-bold">
            Clear Filters
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredBooks.map((book) => (
            <BookCard
              key={book.id}
              book={book}
              onAddToCart={onAddToCart}
              onQuickView={onQuickView}
            />
          ))}
        </div>
      ) : (
        /* List View */
        <div className="space-y-4">
          {filteredBooks.map((book) => (
            <div
              key={book.id}
              className="glass-card p-5 flex flex-col sm:flex-row gap-5 items-center justify-between"
            >
              <div className="flex gap-4 items-center w-full sm:w-auto">
                <img
                  src={book.coverImage}
                  alt={book.title}
                  className="w-20 h-28 object-cover rounded-lg bg-slate-900 shadow-md"
                />
                <div className="space-y-1">
                  <span className="badge badge-primary">{book.category}</span>
                  <h3 className="text-base font-bold text-slate-100">{book.title}</h3>
                  <p className="text-xs text-indigo-400 font-medium">by {book.author}</p>
                  <p className="text-xs text-slate-400 line-clamp-2 max-w-xl">
                    {book.description}
                  </p>
                </div>
              </div>

              <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-4 pt-4 sm:pt-0 border-t sm:border-t-0 border-white/10">
                <div className="text-right">
                  <div className="flex items-center gap-1 text-amber-400 text-xs font-bold justify-end">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span>{book.rating.toFixed(1)}</span>
                  </div>
                  <div className="text-xl font-extrabold text-white mt-1">
                    ${book.price.toFixed(2)}
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => onQuickView(book)}
                    className="btn-secondary py-2 px-3 text-xs"
                    title="Quick View"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onAddToCart(book)}
                    className="btn-primary py-2 px-4 text-xs font-bold"
                  >
                    <ShoppingBag className="w-4 h-4" /> Add
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
