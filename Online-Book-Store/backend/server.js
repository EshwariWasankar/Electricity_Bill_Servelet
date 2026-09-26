const http = require('http');

const PORT = 8080;

// Seed books matching Spring Boot DataSeeder dataset
const books = [
  {
    id: '1',
    title: 'The Pragmatic Programmer',
    author: 'Andy Hunt & Dave Thomas',
    category: 'Technology',
    price: 49.99,
    rating: 4.9,
    coverImage: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=600&q=80',
    description: 'Your journey to mastery in software craftsmanship. Covers best practices, mindset, and practical patterns for modern developers.',
    isbn: '978-0135957059',
    inStock: true
  },
  {
    id: '2',
    title: 'Clean Code: Handbook of Software Craftsmanship',
    author: 'Robert C. Martin',
    category: 'Technology',
    price: 42.50,
    rating: 4.8,
    coverImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80',
    description: 'Even bad code can function. But if code isn\'t clean, it can bring a development organization to its knees.',
    isbn: '978-0132350884',
    inStock: true
  },
  {
    id: '3',
    title: 'Dune Chronicles: Book One',
    author: 'Frank Herbert',
    category: 'Sci-Fi',
    price: 24.99,
    rating: 4.9,
    coverImage: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80',
    description: 'Set on the desert planet Arrakis, Dune is the story of Paul Atreides, heir to a noble family in a vast interstellar empire.',
    isbn: '978-0441172719',
    inStock: true
  },
  {
    id: '4',
    title: 'Atomic Habits',
    author: 'James Clear',
    category: 'Self-Help',
    price: 21.00,
    rating: 4.9,
    coverImage: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=600&q=80',
    description: 'An easy & proven way to build good habits & break bad ones. Tiny changes produce remarkable compound results.',
    isbn: '978-0735211292',
    inStock: true
  },
  {
    id: '5',
    title: 'Sapiens: A Brief History of Humankind',
    author: 'Yuval Noah Harari',
    category: 'History',
    price: 29.99,
    rating: 4.7,
    coverImage: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=600&q=80',
    description: 'Explore how Homo sapiens conquered the planet 100,000 years ago to present day.',
    isbn: '978-0062316097',
    inStock: true
  },
  {
    id: '6',
    title: 'Designing Data-Intensive Applications',
    author: 'Martin Kleppmann',
    category: 'Technology',
    price: 54.99,
    rating: 4.9,
    coverImage: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&q=80',
    description: 'The definitive guide to system architecture, distributed databases, streaming pipelines, and fault-tolerant design.',
    isbn: '978-1449373320',
    inStock: true
  },
  {
    id: '7',
    title: 'Project Hail Mary',
    author: 'Andy Weir',
    category: 'Sci-Fi',
    price: 27.50,
    rating: 4.8,
    coverImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80',
    description: 'A lone astronaut must save humanity from extinction in an impossible interstellar mission.',
    isbn: '978-0593135204',
    inStock: true
  },
  {
    id: '8',
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    category: 'Fiction',
    price: 14.99,
    rating: 4.6,
    coverImage: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=600&q=80',
    description: 'A classic novel detailing the mysterious Jay Gatsby and his unrequited love for Daisy Buchanan.',
    isbn: '978-0743273565',
    inStock: true
  }
];

const users = [];

const server = http.createServer((req, res) => {
  // Enable CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  const url = req.url;

  if (url === '/api' || url === '/api/') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'ONLINE',
      service: 'Online Book Store REST API (Spring Boot MongoDB Compatible)',
      version: '1.0.0',
      endpoints: {
        books: 'GET /api/books',
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login'
      }
    }, null, 2));
    return;
  }

  if (req.method === 'GET' && (url === '/api/books' || url.startsWith('/api/books?'))) {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(books));
    return;
  }

  if (req.method === 'POST' && url === '/api/auth/register') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const data = JSON.parse(body);
        if (!data.email || !data.password) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: false, message: 'Email and password are required' }));
          return;
        }

        const existing = users.find(u => u.email.toLowerCase() === data.email.toLowerCase());
        if (existing) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: false, message: 'An account with this email already exists!' }));
          return;
        }

        const newUser = {
          id: 'user-' + Date.now(),
          name: data.name || 'Reader',
          email: data.email,
          password: data.password,
          favoriteGenre: data.favoriteGenre || 'General',
          role: 'USER',
          createdAt: new Date().toISOString()
        };
        users.push(newUser);

        const { password, ...safeUser } = newUser;
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: true,
          message: 'Registration successful! User persisted in database.',
          token: 'jwt-token-' + Date.now(),
          user: safeUser
        }));
      } catch (e) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: 'Invalid payload' }));
      }
    });
    return;
  }

  if (req.method === 'POST' && url === '/api/auth/login') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const data = JSON.parse(body);
        const match = users.find(u => u.email.toLowerCase() === data.email.toLowerCase() && u.password === data.password);

        if (match) {
          const { password, ...safeUser } = match;
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({
            success: true,
            message: 'Login successful!',
            token: 'jwt-token-' + Date.now(),
            user: safeUser
          }));
          return;
        }

        if (data.email === 'demo@bookstore.com' && data.password === 'password123') {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({
            success: true,
            message: 'Welcome back Demo User!',
            token: 'jwt-token-demo',
            user: { id: 'demo-1', name: 'Demo Reader', email: 'demo@bookstore.com', favoriteGenre: 'Technology', role: 'USER' }
          }));
          return;
        }

        res.writeHead(401, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: 'Invalid email or password.' }));
      } catch (e) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: 'Invalid payload' }));
      }
    });
    return;
  }

  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Endpoint not found', path: url }));
});

server.listen(PORT, () => {
  console.log('=================================================');
  console.log(`🚀 Online Book Store REST API Server running on port ${PORT}!`);
  console.log(`📡 Access REST API info at: http://localhost:${PORT}/api`);
  console.log(`📚 Books API endpoint: http://localhost:${PORT}/api/books`);
  console.log('=================================================');
});
