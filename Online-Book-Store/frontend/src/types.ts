export interface Book {
  id: string;
  title: string;
  author: string;
  category: string;
  price: number;
  rating: number;
  coverImage: string;
  description: string;
  isbn: string;
  inStock: boolean;
}

export interface User {
  id?: string;
  name: string;
  email: string;
  favoriteGenre?: string;
  role?: string;
  createdAt?: string;
}

export interface CartItem {
  book: Book;
  quantity: number;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: User;
}

export type Page = 'home' | 'catalogue' | 'login' | 'register';
