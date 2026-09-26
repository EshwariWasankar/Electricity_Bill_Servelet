import type { Book, AuthResponse, User } from '../types';

const API_BASE_URL = 'http://localhost:8080/api';

// Initial fallback datasets for offline / demo mode
export const MOCK_BOOKS: Book[] = [
  {
    id: '1',
    title: 'The Pragmatic Programmer',
    author: 'Andy Hunt & Dave Thomas',
    category: 'Technology',
    price: 49.99,
    rating: 4.9,
    coverImage: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=600&q=80',
    description: 'Your journey to mastery in software craftsmanship. Covers best practices, mindset, and practical architectural patterns for modern developers.',
    isbn: '978-0135957059',
    inStock: true,
  },
  {
    id: '2',
    title: 'Clean Code: Handbook of Software Craftsmanship',
    author: 'Robert C. Martin',
    category: 'Technology',
    price: 42.50,
    rating: 4.8,
    coverImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80',
    description: "Even bad code can function. But if code isn't clean, it can bring a development organization to its knees. Learn to write clean, refactored code.",
    isbn: '978-0132350884',
    inStock: true,
  },
  {
    id: '3',
    title: 'Dune Chronicles: Book One',
    author: 'Frank Herbert',
    category: 'Sci-Fi',
    price: 24.99,
    rating: 4.9,
    coverImage: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80',
    description: 'Set on the desert planet Arrakis, Dune is the story of Paul Atreides, heir to a noble family in a vast interstellar empire battling over spice.',
    isbn: '978-0441172719',
    inStock: true,
  },
  {
    id: '4',
    title: 'Atomic Habits',
    author: 'James Clear',
    category: 'Self-Help',
    price: 21.00,
    rating: 4.9,
    coverImage: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=600&q=80',
    description: 'An easy & proven way to build good habits & break bad ones. Tiny changes produce remarkable compound results over time.',
    isbn: '978-0735211292',
    inStock: true,
  },
  {
    id: '5',
    title: 'Sapiens: A Brief History of Humankind',
    author: 'Yuval Noah Harari',
    category: 'History',
    price: 29.99,
    rating: 4.7,
    coverImage: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=600&q=80',
    description: '100,000 years ago, at least six human species inhabited the earth. Today there is just one. Us. Homo sapiens. Explore how we conquered the planet.',
    isbn: '978-0062316097',
    inStock: true,
  },
  {
    id: '6',
    title: 'Designing Data-Intensive Applications',
    author: 'Martin Kleppmann',
    category: 'Technology',
    price: 54.99,
    rating: 4.9,
    coverImage: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&q=80',
    description: 'The definitive guide to system architecture, distributed databases, streaming pipelines, and fault-tolerant cloud design.',
    isbn: '978-1449373320',
    inStock: true,
  },
  {
    id: '7',
    title: 'Project Hail Mary',
    author: 'Andy Weir',
    category: 'Sci-Fi',
    price: 27.50,
    rating: 4.8,
    coverImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80',
    description: 'A lone astronaut must save humanity from extinction in an impossible interstellar mission from the author of The Martian.',
    isbn: '978-0593135204',
    inStock: true,
  },
  {
    id: '8',
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    category: 'Fiction',
    price: 14.99,
    rating: 4.6,
    coverImage: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=600&q=80',
    description: 'A masterpiece of American literature capturing the exuberance, romance, and tragedy of the Roaring Twenties in Long Island.',
    isbn: '978-0743273565',
    inStock: true,
  }
];

// Helper to check if backend is accessible
export async function getBooks(): Promise<{ books: Book[]; isLiveBackend: boolean }> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);
    
    const res = await fetch(`${API_BASE_URL}/books`, { 
      signal: controller.signal,
      headers: { 'Accept': 'application/json' }
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const books = await res.json();
      if (Array.isArray(books) && books.length > 0) {
        return { books, isLiveBackend: true };
      }
    }
  } catch (err) {
    console.warn('Spring Boot backend not connected on http://localhost:8080/api. Operating in local database mode.');
  }
  return { books: MOCK_BOOKS, isLiveBackend: false };
}

export async function registerUser(userData: {
  name: string;
  email: string;
  password: string;
  favoriteGenre?: string;
}): Promise<AuthResponse> {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    const data = await res.json();
    return data;
  } catch (err) {
    console.warn('Backend unavailable, simulating registration in local state:', err);
    // Local fallback persistence
    const mockUsersStr = localStorage.getItem('bookstore_mock_users') || '[]';
    const mockUsers = JSON.parse(mockUsersStr);
    
    if (mockUsers.some((u: any) => u.email === userData.email.toLowerCase())) {
      return { success: false, message: 'An account with this email already exists!' };
    }

    const newUser: User = {
      id: `user-${Date.now()}`,
      name: userData.name,
      email: userData.email,
      favoriteGenre: userData.favoriteGenre || 'General',
      role: 'USER',
    };

    mockUsers.push({ ...newUser, password: userData.password });
    localStorage.setItem('bookstore_mock_users', JSON.stringify(mockUsers));

    return {
      success: true,
      message: 'Registration successful! (Saved to local database mode)',
      token: `mock-jwt-token-${Date.now()}`,
      user: newUser,
    };
  }
}

export async function loginUser(credentials: {
  email: string;
  password: string;
}): Promise<AuthResponse> {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    const data = await res.json();
    return data;
  } catch (err) {
    console.warn('Backend unavailable, simulating login with local mock store:', err);
    const mockUsersStr = localStorage.getItem('bookstore_mock_users') || '[]';
    const mockUsers = JSON.parse(mockUsersStr);

    const match = mockUsers.find(
      (u: any) => u.email.toLowerCase() === credentials.email.toLowerCase() && u.password === credentials.password
    );

    if (match) {
      const { password, ...safeUser } = match;
      return {
        success: true,
        message: 'Login successful!',
        token: `mock-jwt-token-${Date.now()}`,
        user: safeUser,
      };
    } else if (credentials.email === 'demo@bookstore.com' && credentials.password === 'password123') {
      return {
        success: true,
        message: 'Welcome back Demo User!',
        token: 'mock-jwt-demo-token',
        user: { id: 'demo-1', name: 'Demo Reader', email: 'demo@bookstore.com', favoriteGenre: 'Technology' },
      };
    }

    return {
      success: false,
      message: 'Invalid email or password. Please check your credentials or register a new account.',
    };
  }
}
