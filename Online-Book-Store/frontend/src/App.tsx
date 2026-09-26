import { useState, useEffect } from 'react';
import type { Page, Book, CartItem, User } from './types';
import { getBooks } from './services/api';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { BookModal } from './components/BookModal';

import { HomePage } from './pages/HomePage';
import { CataloguePage } from './pages/CataloguePage';
import { LoginPage } from './pages/LoginPage';
import { RegistrationPage } from './pages/RegistrationPage';

export function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [books, setBooks] = useState<Book[]>([]);
  const [isLiveBackend, setIsLiveBackend] = useState<boolean>(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Fetch books on mount
  useEffect(() => {
    async function loadBooks() {
      const data = await getBooks();
      setBooks(data.books);
      setIsLiveBackend(data.isLiveBackend);
    }
    loadBooks();
  }, []);

  // Show floating toast notification
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Cart operations
  const handleAddToCart = (book: Book, quantity: number = 1) => {
    setCartItems((prevItems) => {
      const existing = prevItems.find((item) => item.book.id === book.id);
      if (existing) {
        return prevItems.map((item) =>
          item.book.id === book.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prevItems, { book, quantity }];
    });
    showToast(`Added "${book.title}" to your cart!`);
  };

  const handleUpdateCartQuantity = (bookId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveCartItem(bookId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) => (item.book.id === bookId ? { ...item, quantity } : item))
    );
  };

  const handleRemoveCartItem = (bookId: string) => {
    setCartItems((prev) => prev.filter((item) => item.book.id !== bookId));
    showToast('Item removed from cart.');
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-dark)] text-[var(--text-main)] selection:bg-indigo-500 selection:text-white">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 glass-panel bg-slate-900/90 border border-indigo-500/40 text-slate-100 text-xs font-bold px-4 py-3 rounded-xl shadow-2xl animate-fade-in flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Global Header / Navigation */}
      <Navbar
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        currentUser={currentUser}
        onLogout={() => {
          setCurrentUser(null);
          showToast('Signed out successfully.');
        }}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        isLiveBackend={isLiveBackend}
      />

      {/* Main Page View Renderer */}
      <main className="w-full flex-1 flex flex-col items-center justify-start">
        {currentPage === 'home' && (
          <HomePage
            books={books}
            setCurrentPage={setCurrentPage}
            onAddToCart={(b) => handleAddToCart(b, 1)}
            onQuickView={setSelectedBook}
            setSelectedCategory={setSelectedCategory}
          />
        )}

        {currentPage === 'catalogue' && (
          <CataloguePage
            books={books}
            onAddToCart={(b) => handleAddToCart(b, 1)}
            onQuickView={setSelectedBook}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
        )}

        {currentPage === 'login' && (
          <LoginPage
            setCurrentPage={setCurrentPage}
            onLoginSuccess={(user) => {
              setCurrentUser(user);
              showToast(`Welcome back, ${user.name}!`);
            }}
          />
        )}

        {currentPage === 'register' && (
          <RegistrationPage
            setCurrentPage={setCurrentPage}
            onRegisterSuccess={(user) => {
              setCurrentUser(user);
              showToast(`Account created for ${user.name}!`);
            }}
          />
        )}
      </main>

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={handleClearCart}
        setCurrentPage={setCurrentPage}
      />

      {/* Book Quick View Modal */}
      <BookModal
        book={selectedBook}
        onClose={() => setSelectedBook(null)}
        onAddToCart={(b, q) => handleAddToCart(b, q)}
      />

      {/* Footer */}
      <Footer setCurrentPage={setCurrentPage} />
    </div>
  );
}

export default App;
