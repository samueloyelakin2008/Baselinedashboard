# Baseline Dashboard

A production-ready web application for analyzing modern web compatibility in JavaScript and CSS code. Built with React, Node.js, Firebase, and MongoDB.

## 🚀 Features

- **Code Analysis**: Detect modern web features in JavaScript and CSS code
- **Baseline Metadata**: Rich feature information using the `web-features` package
- **Browser Support**: Comprehensive compatibility data for Chrome, Firefox, Safari, and Edge
- **Authentication**: Secure Google Sign-in with Firebase Auth
- **Report History**: Save and track analysis reports over time
- **Responsive Design**: Beautiful UI that works on all devices
- **Production Ready**: Optimized for deployment on Render and Vercel

## 🛠 Tech Stack

### Backend
- Node.js + Express
- MongoDB with Mongoose
- Firebase Admin SDK
- web-features package
- CORS, body-parser, dotenv

### Frontend
- React 18 + TypeScript
- Vite build tool
- Tailwind CSS
- Firebase Auth
- React Router
- Lucide React icons


## 🧪 Features Detected

### JavaScript Features
- fetch API
- String.prototype.replaceAll
- IntersectionObserver
- Intl.RelativeTimeFormat
- Promises & async/await
- Arrow functions
- Template literals
- Destructuring
- Spread operator
- Optional chaining (?.)
- Nullish coalescing (??)

### CSS Features
- CSS Grid
- CSS Subgrid
- CSS Flexbox
- CSS Custom Properties
- CSS Container Queries
- CSS Cascade Layers
- CSS Nesting
- CSS :has() pseudo-class



## 🔒 Security Features

- Firebase Authentication with JWT verification
- MongoDB Row Level Security through user ID filtering
- Input validation and sanitization
- Rate limiting ready
- CORS configuration
- Environment variable protection
- Code size limits (50KB max)
- Auto-expiring reports (90 days TTL)
