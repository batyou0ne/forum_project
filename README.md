# 🚀 Full-Stack Social Community App

A modern, interactive full-stack web application built with a robust MVC architecture. This platform allows users to register, create posts, interact through comments, react to content (like/dislike), and view their personalized profiles. 

The application features a highly responsive, premium UI utilizing **Glassmorphism** design principles and animated backgrounds.

## ✨ Features

* **🔐 Secure Authentication:** JWT-based user registration and login system.
* **📝 Post Management (CRUD):** Users can seamlessly create, read, and delete their posts.
* **💬 Interactive Comments:** Dynamic commenting system on individual posts.
* **👍 Reaction System:** "All-in-One" like and dislike toggle functionality with real-time updates.
* **👤 Glassmorphism User Profiles:** A sleek, slide-out profile sidebar displaying user information and activity.
* **🎨 Premium UI/UX:** Features modern CSS techniques, custom Uiverse.io components, and an interactive `DotGrid` animated background.
* **🛡️ Protected Routes:** Middleware implementation to secure backend API endpoints and frontend views.

## 🛠️ Tech Stack

**Frontend:**
* React.js
* React Router DOM
* Modern CSS3 (Glassmorphism, Flexbox, UI animations)

**Backend:**
* Node.js & Express.js
* MVC Architecture (Models, Views, Controllers)
* JWT (JSON Web Tokens) for Authentication

**Database:**
* MySQL (Relational Database with optimized JOINs and Junction Tables)

## 📁 Project Structure (MVC)

```text
├── frontend/
│   ├── src/
│   │   ├── components/    # Reusable UI components (DotGrid, etc.)
│   │   ├── pages/         # React Views (Login, Posts, Profile, PostDetail)
│   │   ├── App.jsx        # Main routing & state
│   │   └── App.css        # Global styles & Glassmorphism effects
│
└── backend/
    ├── src/
    │   ├── config/        # Database connection (db.js)
    │   ├── controllers/   # Business logic (auth, post, comment, like, user)
    │   ├── middlewares/   # Route protection & Auth verification
    │   ├── routes/        # Express API endpoints
    │   └── app.js         # Main server setup
