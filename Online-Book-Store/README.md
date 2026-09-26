# 📚 Online Book Store Assignment

A responsive full-stack online bookstore application built with **React (TypeScript)**, **Spring Boot**, and **MongoDB**.

---

## 🎨 Features & Pages
1. **Home Page**: Hero banner, popular category cards, trending bestseller book grid, value propositions, and promotion banners.
2. **Catalogue Page**: Live search by title/author/ISBN, category filter buttons, price range slider, rating filter, sorting options, and grid/list view switcher.
3. **Login Page**: Member login form with show/hide password toggle, remember me checkbox, demo credential auto-fill, and Spring Boot authentication integration.
4. **Registration Page**: User registration form (Name, Email, Password, Password confirmation check, Favorite Genre) persisting users to MongoDB `users` collection.
5. **Interactive Shopping Cart Drawer & Book Modal**: Real-time cart quantity controls, tax calculations, simulated checkout, and quick view details popups.

---

## 🚀 How to Run

### 1. Frontend (React + TypeScript)
```bash
cd frontend
npm install
npm run dev
```
Open **http://localhost:5173/** in your browser.

### 2. Backend (Spring Boot + MongoDB / REST API)
```bash
cd backend
# Spring Boot Maven:
mvn spring-boot:run
# Or Node REST API fallback:
node server.js
```
REST API live on **http://localhost:8080/api**.
