import React, { useState } from 'react';
import { X, ShoppingBag, Trash2, ArrowRight, CheckCircle2 } from 'lucide-react';
import type { CartItem, Page } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (bookId: string, quantity: number) => void;
  onRemoveItem: (bookId: string) => void;
  onClearCart: () => void;
  setCurrentPage: (page: Page) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  setCurrentPage,
}) => {
  const [checkoutCompleted, setCheckoutCompleted] = useState(false);

  if (!isOpen) return null;

  const subtotal = cartItems.reduce((acc, item) => acc + item.book.price * item.quantity, 0);
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  const handleCheckout = () => {
    setCheckoutCompleted(true);
    setTimeout(() => {
      onClearCart();
      setCheckoutCompleted(false);
      onClose();
    }, 3000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md glass-panel bg-slate-950/95 border-l border-white/10 flex flex-col shadow-2xl">
          {/* Header */}
          <div className="p-6 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-400">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-100">Your Shopping Cart</h3>
                <p className="text-xs text-slate-400">{cartItems.length} unique titles selected</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Content Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {checkoutCompleted ? (
              <div className="text-center py-16 space-y-4 animate-fade-in">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="text-xl font-bold text-slate-100">Order Placed Successfully!</h4>
                <p className="text-xs text-slate-400 max-w-xs mx-auto">
                  Thank you for shopping at BookVerse. Your invoice receipt and tracking link have been saved.
                </p>
              </div>
            ) : cartItems.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <div className="w-16 h-16 rounded-full bg-indigo-500/10 text-indigo-400 flex items-center justify-center mx-auto border border-indigo-500/20">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h4 className="text-base font-bold text-slate-200">Your cart is empty</h4>
                <p className="text-xs text-slate-400 max-w-xs mx-auto">
                  Explore our curated catalogue and add books to your personal library.
                </p>
                <button
                  onClick={() => {
                    onClose();
                    setCurrentPage('catalogue');
                  }}
                  className="btn-primary py-2.5 px-5 text-xs font-bold mt-2"
                >
                  Browse Catalogue
                </button>
              </div>
            ) : (
              cartItems.map((item) => (
                <div
                  key={item.book.id}
                  className="flex gap-4 p-3.5 rounded-xl bg-slate-900/80 border border-white/5 hover:border-white/10 transition-colors"
                >
                  <img
                    src={item.book.coverImage}
                    alt={item.book.title}
                    className="w-16 h-20 object-cover rounded-lg bg-slate-950"
                  />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-slate-100 line-clamp-1">
                        {item.book.title}
                      </h4>
                      <p className="text-xs text-slate-400">by {item.book.author}</p>
                      <p className="text-xs font-bold text-indigo-400 mt-0.5">
                        ${item.book.price.toFixed(2)} each
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2 bg-slate-950 px-2 py-1 rounded-lg border border-white/10">
                        <button
                          onClick={() => onUpdateQuantity(item.book.id, item.quantity - 1)}
                          className="w-5 h-5 rounded bg-white/5 hover:bg-white/10 text-slate-300 flex items-center justify-center font-bold text-xs"
                        >
                          -
                        </button>
                        <span className="w-4 text-center text-xs font-bold text-white">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.book.id, item.quantity + 1)}
                          className="w-5 h-5 rounded bg-white/5 hover:bg-white/10 text-slate-300 flex items-center justify-center font-bold text-xs"
                        >
                          +
                        </button>
                      </div>

                      {/* Remove item */}
                      <button
                        onClick={() => onRemoveItem(item.book.id)}
                        className="text-slate-500 hover:text-rose-400 transition-colors p-1"
                        title="Remove book"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Subtotal & Checkout */}
          {cartItems.length > 0 && !checkoutCompleted && (
            <div className="p-6 border-t border-white/10 bg-slate-900/60 space-y-4">
              <div className="space-y-2 text-xs text-slate-400">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-slate-200">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated Tax (8%)</span>
                  <span className="font-semibold text-slate-200">${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-emerald-400 font-medium">
                  <span>Shipping</span>
                  <span>FREE</span>
                </div>
                <div className="pt-2 border-t border-white/10 flex justify-between text-base font-bold text-white">
                  <span>Total</span>
                  <span className="gradient-text">${total.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full btn-primary py-3 text-sm font-bold flex items-center justify-center gap-2"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
