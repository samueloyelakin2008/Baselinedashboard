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

## 📦 Project Structure

```
baseline-dashboard/
├── backend/                 # Node.js Express server
│   ├── server.js           # Main server file
│   ├── middleware/         # Authentication middleware
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   ├── lib/               # Feature scanner logic
│   └── package.json       # Backend dependencies
├── src/                   # React frontend
│   ├── components/        # React components
│   ├── contexts/          # React contexts
│   ├── pages/            # Page components
│   ├── services/         # API services
│   └── config/           # Firebase config
├── .env.example          # Frontend environment variables
└── README.md
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- MongoDB database (local or Atlas)
- Firebase project with Authentication enabled
- Google OAuth configured in Firebase

### 1. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Copy environment file and configure
cp .env.example .env
# Edit .env with your MongoDB URI and Firebase service account
```

### 2. Frontend Setup

```bash
# Install frontend dependencies (from root)
npm install

# Copy environment file and configure
cp .env.example .env.local
# Edit .env.local with your Firebase config and API URL
```

### 3. Firebase Configuration

1. Create a Firebase project at https://console.firebase.google.com
2. Enable Authentication > Sign-in method > Google
3. Get Web app config from Project Settings
4. Generate service account key for backend
5. Update environment variables in both `.env` files

### 4. MongoDB Setup

**Option A: Local MongoDB**
```bash
# Install and start MongoDB locally
mongod --dbpath /path/to/data/directory
```

**Option B: MongoDB Atlas**
1. Create cluster at https://cloud.mongodb.com
2. Get connection string
3. Update MONGO_URI in backend .env

### 5. Development

```bash
# Start backend server (from backend directory)
npm run dev

# Start frontend (from root directory)
npm run dev
```

Visit http://localhost:5173 to see the application.

## 🔧 Environment Variables

### Backend (.env)
```bash
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
MONGO_URI=mongodb://localhost:27017/baseline-dashboard
FIREBASE_SERVICE_ACCOUNT={"type":"service_account"...}
```

### Frontend (.env.local)
```bash
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef
VITE_API_URL=http://localhost:5000
```

## 🚀 Deployment

### Backend Deployment (Render)

1. Create new Web Service on Render
2. Connect your repository
3. Configure environment variables:
   - `MONGO_URI`: MongoDB Atlas connection string
   - `FIREBASE_SERVICE_ACCOUNT`: Firebase service account JSON
   - `FRONTEND_URL`: Your Vercel app URL
   - `NODE_ENV`: production
4. Deploy with build command: `npm install`
5. Start command: `npm start`

### Frontend Deployment (Vercel)

1. Connect repository to Vercel
2. Configure environment variables:
   - All `VITE_FIREBASE_*` variables
   - `VITE_API_URL`: Your Render backend URL
3. Deploy with build command: `npm run build`
4. Output directory: `dist`

## 🔍 API Endpoints

### Authentication Required

All API endpoints require a valid Firebase JWT token in the Authorization header:
```
Authorization: Bearer <firebase-jwt-token>
```

### POST /api/analyze
Analyze JavaScript or CSS code for modern web features.

**Request Body:**
```json
{
  "code": "const data = await fetch('/api/users');",
  "codeType": "javascript"
}
```

**Response:**
```json
{
  "success": true,
  "analysis": {
    "features": [...],
    "summary": {
      "totalFeatures": 12,
      "detectedFeatures": 3,
      "baselineCompliant": 2,
      "modernFeatures": 1
    }
  },
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### GET /api/reports
Get user's analysis reports with pagination.

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10, max: 50)
- `codeType`: Filter by 'javascript' or 'css'

### GET /api/reports/:reportId
Get specific report by ID.

### DELETE /api/reports/:reportId
Delete specific report.

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

## 📊 Database Schema

### Report Collection
```javascript
{
  userId: String,           // Firebase user ID
  userEmail: String,        // User email
  codeType: String,         // 'javascript' or 'css'
  codeContent: String,      // Original code (max 50KB)
  features: [{              // Detected features array
    feature: String,
    detected: Boolean,
    baseline: {
      status: String,       // 'available', 'limited', 'unknown'
      since: String,        // Date when baseline
      description: String
    },
    browserSupport: {
      chrome: String,
      firefox: String,
      safari: String,
      edge: String
    }
  }],
  summary: {                // Analysis summary
    totalFeatures: Number,
    detectedFeatures: Number,
    baselineCompliant: Number,
    modernFeatures: Number
  },
  createdAt: Date           // Auto-expires after 90 days
}
```

## 🔒 Security Features

- Firebase Authentication with JWT verification
- MongoDB Row Level Security through user ID filtering
- Input validation and sanitization
- Rate limiting ready
- CORS configuration
- Environment variable protection
- Code size limits (50KB max)
- Auto-expiring reports (90 days TTL)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes and commit: `git commit -am 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙋‍♂️ Support

For support, please open an issue in the GitHub repository or contact the development team.

---

Built with ❤️ for modern web development