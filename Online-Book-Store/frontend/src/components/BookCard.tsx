import React from 'react';
import { Star, ShoppingBag, Eye, Check } from 'lucide-react';
import type { Book } from '../types';

interface BookCardProps {
  book: Book;
  onAddToCart: (book: Book) => void;
  onQuickView: (book: Book) => void;
  isInCart?: boolean;
}

export const BookCard: React.FC<BookCardProps> = ({
  book,
  onAddToCart,
  onQuickView,
  isInCart = false,
}) => {
  return (
    <div className="glass-card group flex flex-col overflow-hidden relative">
      {/* Cover Image Container */}
      <div className="relative h-64 overflow-hidden bg-slate-900/80">
        <img
          src={book.coverImage}
          alt={book.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

        {/* Category Pill */}
        <span className="absolute top-3 left-3 badge badge-primary font-semibold backdrop-blur-md">
          {book.category}
        </span>

        {/* Rating Badge */}
        <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-md bg-slate-950/80 backdrop-blur-md border border-amber-500/30 text-amber-400 text-xs font-bold">
          <Star className="w-3.5 h-3.5 fill-amber-400" />
          <span>{book.rating.toFixed(1)}</span>
        </div>

        {/* Action Overlay */}
        <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={() => onQuickView(book)}
            className="p-3 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-transform hover:scale-110"
            title="Quick View Details"
          >
            <Eye className="w-5 h-5" />
          </button>
          <button
            onClick={() => onAddToCart(book)}
            className="p-3 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/50 transition-transform hover:scale-110"
            title="Add to Cart"
          >
            <ShoppingBag className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Details Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <h3 
            onClick={() => onQuickView(book)}
            className="text-base font-bold text-slate-100 line-clamp-1 group-hover:text-indigo-400 cursor-pointer transition-colors"
          >
            {book.title}
          </h3>
          <p className="text-xs text-slate-400 mt-1 font-medium">by {book.author}</p>
        </div>

        <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
          {book.description}
        </p>

        {/* Price & Add Button */}
        <div className="pt-2 border-t border-white/5 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 block font-medium">Price</span>
            <span className="text-lg font-extrabold text-white">
              ${book.price.toFixed(2)}
            </span>
          </div>

          <button
            onClick={() => onAddToCart(book)}
            className={`btn-primary py-2 px-3 text-xs ${
              isInCart ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/30' : ''
            }`}
          >
            {isInCart ? (
              <>
                <Check className="w-3.5 h-3.5" /> Added
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" /> Add to Cart
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
