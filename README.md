# AI Slides Platform - Complete Full-Stack SaaS

> Generate professional presentations with AI using Google Gemini, document upload, and credit-based subscription system.

## 🚀 Project Overview

A complete full-stack SaaS platform that generates presentation slides from prompts or uploaded documents using AI. Built with Express.js backend and vanilla JavaScript frontend.

**Live Demo:** [Not yet deployed]
**GitHub:** [Your repository URL]

---

## ✨ Features

### 🎯 Core Features
- **AI-Powered Slide Generation** - Generate slides from text prompts using Google Gemini
- **Document Upload** - Upload PDF, DOCX, DOC, or TXT files for automatic slide creation
- **Credit-Based System** - Flexible subscription plans with credit tracking
- **User Authentication** - Secure JWT-based authentication with access & refresh tokens
- **Dashboard** - View presentations, credits, and subscription status
- **Responsive UI** - Beautiful, modern interface built with TailwindCSS

### 💼 Subscription Plans
- **Trial** - 50 credits (free)
- **Starter** - 500 credits/month ($9/month)
- **Professional** - 2000 credits/month ($29/month)
- **Enterprise** - 10000 credits/month ($99/month)

### 🔒 Security Features
- Password hashing with bcrypt (12 rounds)
- JWT access tokens (15 min) + refresh tokens (7 days)
- Rate limiting on all endpoints
- Helmet.js security headers
- CORS protection
- Input validation with Joi

---

## 🛠️ Technology Stack

### Backend
- **Framework:** Express.js (Node.js)
- **Database:** MongoDB with Mongoose ODM
- **Cache:** Redis with IORedis
- **AI:** Google Gemini Pro API
- **Authentication:** JWT (jsonwebtoken)
- **Security:** Helmet, bcryptjs, express-rate-limit
- **File Processing:** pdf-parse, mammoth, multer
- **Logging:** Winston

### Frontend
- **HTML5/CSS3** with TailwindCSS
- **Vanilla JavaScript** (no framework)
- **HTTP Client:** Axios
- **Icons:** Font Awesome

### Infrastructure
- **Containerization:** Docker & Docker Compose
- **Development:** Nodemon, PM2
- **Testing:** Jest (configured)

---

## 📋 Prerequisites

Before you begin, ensure you have:

1. **Node.js** (v18 or higher)
   - Download: https://nodejs.org/
   - Verify: `node --version && npm --version`

2. **Docker & Docker Compose**
   - Download: https://www.docker.com/get-started
   - Verify: `docker --version && docker-compose --version`

3. **Git**
   - Download: https://git-scm.com/
   - Verify: `git --version`

4. **Google Gemini API Key**
   - Get it free: https://makersuite.google.com/app/apikey
   - Sign in with Google account
   - Click "Create API Key"

---

## 🚀 Quick Start

### 1. Clone Repository

```bash
git clone <your-repo-url>
cd webapp
```

### 2. Setup Backend

```bash
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env and add your configuration:
# - GEMINI_API_KEY=your_actual_api_key_here
# - JWT_SECRET=your_random_secret_string
# - JWT_REFRESH_SECRET=your_random_refresh_secret
```

### 3. Start Infrastructure Services

```bash
# From project root directory
docker-compose up -d

# Verify services are running
docker-compose ps
```

You should see:
- `mongodb` running on port 27017
- `redis` running on port 6379

### 4. Start Backend Server

```bash
cd backend

# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

Backend will run on: **http://localhost:5000**

### 5. Start Frontend

```bash
# Open another terminal
cd frontend

# Open index.html in browser
# Option 1: Double-click index.html
# Option 2: Use a local server
python3 -m http.server 3000
# or
npx http-server -p 3000
```

Frontend will run on: **http://localhost:3000**

---

## 📁 Project Structure

```
webapp/
├── backend/                    # Express.js Backend
│   ├── src/
│   │   ├── config/            # Database and Redis configuration
│   │   │   ├── database.js
│   │   │   └── redis.js
│   │   ├── controllers/       # Request handlers
│   │   │   ├── authController.js
│   │   │   └── presentationController.js
│   │   ├── middleware/        # Auth and rate limiting
│   │   │   ├── auth.js
│   │   │   └── rateLimiter.js
│   │   ├── models/            # MongoDB schemas
│   │   │   ├── User.js
│   │   │   ├── Presentation.js
│   │   │   ├── Transaction.js
│   │   │   └── SystemLog.js
│   │   ├── routes/            # API routes
│   │   │   ├── authRoutes.js
│   │   │   ├── presentationRoutes.js
│   │   │   ├── creditRoutes.js
│   │   │   └── adminRoutes.js
│   │   ├── services/          # Business logic
│   │   │   ├── geminiService.js
│   │   │   └── documentService.js
│   │   ├── utils/             # Helper functions
│   │   │   ├── creditSystem.js
│   │   │   ├── jwtUtils.js
│   │   │   └── logger.js
│   │   └── server.js          # Express app entry point
│   ├── uploads/               # Temporary file uploads
│   ├── logs/                  # Application logs
│   ├── package.json
│   └── .env.example
│
├── frontend/                  # Vanilla JS Frontend
│   ├── index.html             # Main HTML (landing, dashboard, modals)
│   ├── app.js                 # JavaScript logic
│   └── package.json
│
├── docker-compose.yml         # MongoDB + Redis containers
├── .env.example              # Environment variables template
├── .gitignore                # Git ignore rules
├── README.md                 # This file
└── BEGINNER_COMPLETE_GUIDE.md # Detailed setup guide

```

---

## 🔧 Configuration

### Backend Environment Variables (.env)

```env
# Server Configuration
NODE_ENV=development
PORT=5000

# Database
MONGODB_URI=mongodb://localhost:27017/ai-slides-platform

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# JWT Authentication
JWT_SECRET=your_very_secure_random_string_here_change_this
JWT_REFRESH_SECRET=your_very_secure_refresh_string_here_change_this
JWT_EXPIRE=15m
JWT_REFRESH_EXPIRE=7d

# Google Gemini AI
GEMINI_API_KEY=your_gemini_api_key_here

# CORS
CORS_ORIGIN=http://localhost:3000

# File Upload
MAX_FILE_SIZE=524288000  # 500MB in bytes
UPLOAD_DIR=./uploads

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000  # 15 minutes
RATE_LIMIT_MAX_REQUESTS=100
```

### Frontend Configuration (app.js)

The API URL is configured at the top of `frontend/app.js`:

```javascript
const API_URL = 'http://localhost:5000/api/v1';
```

For production, change this to your production backend URL.

---

## 🧪 Testing

### Test Backend API

```bash
# Health check
curl http://localhost:5000/health

# Register a user
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "SecurePass123!"
  }'

# Login
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "SecurePass123!"
  }'

# Get user info (replace TOKEN with actual token from login)
curl http://localhost:5000/api/v1/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Test Frontend

1. Open `http://localhost:3000` in browser
2. Click "Sign Up" and create an account
3. Login with your credentials
4. View dashboard with your 50 trial credits
5. Click "Create Presentation" to test slide generation

---

## 📊 API Endpoints

### Authentication (`/api/v1/auth`)
- `POST /register` - Register new user
- `POST /login` - Login user
- `POST /logout` - Logout user
- `GET /me` - Get current user
- `POST /refresh-token` - Refresh access token
- `PUT /profile` - Update user profile
- `PUT /change-password` - Change password

### Presentations (`/api/v1/presentations`)
- `GET /` - Get all user presentations
- `GET /:id` - Get single presentation
- `POST /` - Create presentation from prompt
- `POST /upload` - Upload document and create presentation
- `PUT /:id` - Update presentation
- `DELETE /:id` - Delete presentation

### Credits (`/api/v1/credits`)
- `GET /balance` - Get credit balance
- `GET /history` - Get transaction history
- `POST /purchase` - Purchase credit package (admin)

### Admin (`/api/v1/admin`)
- `GET /users` - List all users
- `GET /stats` - Platform statistics
- `PUT /users/:id/credits` - Adjust user credits
- `PUT /users/:id/subscription` - Update subscription

---

## 🎨 Frontend Features

### Landing Page
- Hero section with call-to-action
- Features showcase
- Pricing plans
- Login/Register modals

### Dashboard
- Credit balance display
- Presentations count
- Recent presentations list
- Quick actions

### Create Presentation
- **Method 1:** Text prompt input
- **Method 2:** Document upload (PDF, DOCX, DOC, TXT)
- Slide count selection (1-30 slides)
- Real-time credit cost calculation

### Presentation View
- Slide thumbnails
- Edit capabilities
- Export options (coming soon)

---

## 💾 Database Models

### User Model
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String (user, premium, admin),
  subscription: {
    plan: String (trial, starter, professional, enterprise),
    status: String,
    startDate: Date,
    endDate: Date
  },
  credits: Number,
  usage: {
    presentationsCreated: Number,
    slidesGenerated: Number,
    documentsProcessed: Number
  }
}
```

### Presentation Model
```javascript
{
  user: ObjectId,
  title: String,
  sourceType: String (prompt, document, url),
  sourcePrompt: String,
  sourceDocument: {
    filename: String,
    filepath: String,
    mimetype: String,
    size: Number
  },
  outline: Array,
  slides: [{
    slideNumber: Number,
    title: String,
    content: Object,
    notes: String
  }],
  status: String (draft, analyzing, outlining, sketching, generating, completed, failed),
  metadata: Object
}
```

---

## 🔐 Security Best Practices

1. **Never commit `.env` files** - Always use `.env.example` as template
2. **Use strong JWT secrets** - Generate random strings for JWT_SECRET
3. **Change default passwords** - Update MongoDB/Redis passwords in production
4. **Enable HTTPS** - Use SSL certificates in production
5. **Rate limiting** - Already configured for all endpoints
6. **Input validation** - All inputs are validated with Joi
7. **Password requirements** - Minimum 8 characters enforced

---

## 🚢 Production Deployment

### Backend Deployment (Heroku Example)

```bash
# Install Heroku CLI
# https://devcenter.heroku.com/articles/heroku-cli

# Login
heroku login

# Create app
heroku create your-app-name

# Add MongoDB addon
heroku addons:create mongolab:sandbox

# Add Redis addon
heroku addons:create heroku-redis:hobby-dev

# Set environment variables
heroku config:set JWT_SECRET=your_production_secret
heroku config:set GEMINI_API_KEY=your_gemini_key
heroku config:set CORS_ORIGIN=https://your-frontend-domain.com

# Deploy
git push heroku main

# View logs
heroku logs --tail
```

### Frontend Deployment (Netlify/Vercel)

**Netlify:**
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy frontend directory
cd frontend
netlify deploy --prod

# Update API_URL in app.js to your backend URL
```

**Vercel:**
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy frontend directory
cd frontend
vercel --prod
```

**Important:** Update `API_URL` in `frontend/app.js` to your production backend URL before deploying.

---

## 🐛 Troubleshooting

### Backend Issues

**Problem:** MongoDB connection error
```bash
# Solution: Check if MongoDB container is running
docker-compose ps
docker-compose logs mongodb
```

**Problem:** Redis connection error
```bash
# Solution: Check if Redis container is running
docker-compose logs redis
```

**Problem:** Gemini API error
```bash
# Solution: Verify your API key
curl -H "x-goog-api-key: YOUR_API_KEY" \
  https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent
```

### Frontend Issues

**Problem:** CORS errors in browser console
```bash
# Solution: Ensure backend CORS_ORIGIN matches frontend URL
# Check backend/.env: CORS_ORIGIN=http://localhost:3000
```

**Problem:** Login not working
```bash
# Solution: Check browser console for errors
# Verify backend is running on http://localhost:5000
# Check API_URL in frontend/app.js
```

### Docker Issues

**Problem:** Port already in use
```bash
# Solution: Stop existing services
docker-compose down
# Or change ports in docker-compose.yml
```

---

## 📈 Monitoring & Logs

### Backend Logs

Logs are stored in `backend/logs/` directory:
- `error.log` - Error logs
- `combined.log` - All logs

View logs:
```bash
cd backend
tail -f logs/combined.log
```

### Docker Logs

```bash
# View all service logs
docker-compose logs

# View specific service
docker-compose logs mongodb
docker-compose logs redis

# Follow logs
docker-compose logs -f
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 🆘 Support

For issues and questions:
1. Check the troubleshooting section above
2. Review `BEGINNER_COMPLETE_GUIDE.md` for detailed setup instructions
3. Open an issue on GitHub
4. Contact: [your email or support channel]

---

## 🎯 Roadmap

### Completed ✅
- User authentication and authorization
- Credit-based subscription system
- AI slide generation from prompts
- Document upload and processing
- Dashboard UI
- Rate limiting and security

### In Progress 🚧
- Export to PDF/PPTX
- Slide editor interface
- Payment integration (Stripe)

### Planned 📋
- Template library
- Collaboration features
- Advanced AI customization
- Mobile app
- Analytics dashboard

---

## 👨‍💻 Development Team

Built with ❤️ for creating amazing presentations with AI.

---

## 📚 Additional Documentation

- `BEGINNER_COMPLETE_GUIDE.md` - Step-by-step setup for beginners
- `DEPLOYMENT.md` - Detailed deployment instructions
- `API_DOCUMENTATION.md` - Complete API reference (coming soon)

---

**Last Updated:** December 2024
**Version:** 1.0.0
