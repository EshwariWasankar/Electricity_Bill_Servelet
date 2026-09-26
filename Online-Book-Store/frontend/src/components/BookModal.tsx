import React, { useState } from 'react';
import { X, Star, ShoppingBag, CheckCircle, Tag, ShieldCheck } from 'lucide-react';
import type { Book } from '../types';

interface BookModalProps {
  book: Book | null;
  onClose: () => void;
  onAddToCart: (book: Book, quantity: number) => void;
}

export const BookModal: React.FC<BookModalProps> = ({ book, onClose, onAddToCart }) => {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  if (!book) return null;

  const handleAdd = () => {
    onAddToCart(book, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div 
        className="glass-panel w-full max-w-3xl rounded-2xl overflow-hidden border border-white/10 relative shadow-2xl animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-slate-900/70 border border-white/10 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 p-6 sm:p-8">
          {/* Cover Image Column */}
          <div className="md:col-span-2 relative rounded-xl overflow-hidden bg-slate-900 max-h-[360px] md:max-h-full">
            <img
              src={book.coverImage}
              alt={book.title}
              className="w-full h-full object-cover"
            />
            <span className="absolute top-3 left-3 badge badge-primary">
              {book.category}
            </span>
          </div>

          {/* Details Column */}
          <div className="md:col-span-3 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center gap-2 text-amber-400 text-sm font-bold mb-1">
                <Star className="w-4 h-4 fill-amber-400" />
                <span>{book.rating.toFixed(1)} / 5.0 Rating</span>
              </div>

              <h2 className="text-2xl font-bold text-slate-100 leading-tight">
                {book.title}
              </h2>
              <p className="text-sm text-indigo-400 font-semibold mt-1">by {book.author}</p>

              <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-slate-400">
                <span className="flex items-center gap-1 bg-white/5 px-2.5 py-1 rounded-md border border-white/5">
                  <Tag className="w-3.5 h-3.5 text-indigo-400" /> ISBN: {book.isbn}
                </span>
                <span className="flex items-center gap-1 bg-emerald-500/10 text-emerald-400 px-2.5 py-1 rounded-md border border-emerald-500/20">
                  <ShieldCheck className="w-3.5 h-3.5" /> In Stock & Ready to Ship
                </span>
              </div>

              <p className="text-sm text-slate-300 mt-4 leading-relaxed font-normal">
                {book.description}
              </p>
            </div>

            {/* Price & Quantity & Actions */}
            <div className="pt-4 border-t border-white/10 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-400 font-medium">Price per copy</span>
                  <div className="text-3xl font-black text-white">
                    ${book.price.toFixed(2)}
                  </div>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center gap-3 bg-slate-900/80 px-3 py-1.5 rounded-xl border border-white/10">
                  <span className="text-xs text-slate-400 font-semibold">Qty:</span>
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-7 h-7 rounded-md bg-white/5 text-slate-200 hover:bg-white/10 flex items-center justify-center font-bold"
                  >
                    -
                  </button>
                  <span className="w-6 text-center text-sm font-bold text-white">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-7 h-7 rounded-md bg-white/5 text-slate-200 hover:bg-white/10 flex items-center justify-center font-bold"
                  >
                    +
                  </button>
                </div>
              </div>

              <button
                onClick={handleAdd}
                className={`w-full btn-primary py-3 text-sm font-bold ${
                  added ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/30' : ''
                }`}
              >
                {added ? (
                  <>
                    <CheckCircle className="w-5 h-5" /> Added {quantity} {quantity > 1 ? 'copies' : 'copy'} to cart!
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-5 h-5" /> Add to Shopping Cart — ${(book.price * quantity).toFixed(2)}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
