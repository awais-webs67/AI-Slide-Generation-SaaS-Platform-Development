# AI Slides Platform - Complete SaaS Application

A production-ready AI-powered slide generation platform that enables users to create professional presentations through AI automation. Upload documents or provide prompts to generate stunning slides with customization options.

## 🎯 Features

### ✅ Completed Features
- **Authentication System**: JWT-based authentication with refresh tokens
- **User Management**: Role-based access control (user, premium, admin)
- **Credit System**: Flexible credit-based subscription model
- **Document Processing**: Extract text from PDF, DOCX, and TXT files
- **AI Integration**: Google Gemini API for content generation
- **Database Models**: MongoDB schemas for users, presentations, transactions
- **Rate Limiting**: Redis-backed rate limiting for API endpoints
- **Security**: Helmet, CORS, input validation, password hashing
- **Logging**: Winston-based comprehensive logging system
- **Docker Support**: Docker Compose for local development

### 🚧 To Be Implemented
- **Slide Generation Engine**: Complete implementation of AI slide generation
- **Export Services**: PDF and PPTX export functionality
- **Background Jobs**: BullMQ job queue for async processing
- **Frontend Application**: Next.js UI with React components
- **Admin Dashboard**: Analytics and management interface
- **Payment Integration**: Stripe for subscription payments
- **Email Service**: Transactional emails for notifications

## 📋 Technology Stack

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Cache/Queue**: Redis with IORedis
- **Authentication**: JWT (JSON Web Tokens)
- **AI**: Google Gemini API
- **Document Processing**: pdf-parse, mammoth
- **Export**: Puppeteer (PDF), PptxGenJS (PowerPoint)
- **Job Queue**: BullMQ (to be implemented)

### Frontend (To Be Built)
- **Framework**: Next.js 14 with React 18
- **Styling**: Tailwind CSS + Shadcn/ui
- **State Management**: Zustand + React Query
- **Forms**: React Hook Form + Zod validation
- **Charts**: Chart.js or Recharts

### DevOps
- **Containerization**: Docker + Docker Compose
- **Process Management**: PM2 (for production)
- **Monitoring**: Winston logging + Redis monitoring

## 🚀 Quick Start

### Prerequisites

- Node.js 18 or higher
- MongoDB 7.0+ (or Docker)
- Redis 7.0+ (or Docker)
- Google Gemini API key

### Option 1: Docker Compose (Recommended)

1. **Clone and setup**:
```bash
cd /home/user/ai-slides-platform
cp .env.example .env
```

2. **Configure environment variables**:
Edit `.env` file and add your keys:
```env
# Required
GEMINI_API_KEY=your-gemini-api-key-here
JWT_SECRET=your-generated-jwt-secret
JWT_REFRESH_SECRET=your-generated-refresh-secret

# Optional (defaults provided)
NODE_ENV=development
MONGODB_URI=mongodb://mongodb:27017/ai-slides-platform
REDIS_HOST=redis
```

3. **Start services with Docker**:
```bash
docker-compose up -d
```

4. **Install backend dependencies**:
```bash
cd backend
npm install
```

5. **Start backend server**:
```bash
npm run dev
```

6. **Access the application**:
- Backend API: http://localhost:5000
- Health Check: http://localhost:5000/health
- MongoDB: localhost:27017
- Redis: localhost:6379

### Option 2: Local Installation (Without Docker)

1. **Install MongoDB** and **Redis** on your system

2. **Clone and setup**:
```bash
cd /home/user/ai-slides-platform
cp .env.example .env
```

3. **Configure environment variables**:
Edit `.env` with your local settings:
```env
GEMINI_API_KEY=your-api-key
JWT_SECRET=your-secret
MONGODB_URI=mongodb://localhost:27017/ai-slides-platform
REDIS_HOST=localhost
REDIS_PORT=6379
```

4. **Install backend dependencies**:
```bash
cd backend
npm install
```

5. **Start MongoDB and Redis** services on your system

6. **Run backend**:
```bash
npm run dev
```

## 📁 Project Structure

```
ai-slides-platform/
├── backend/
│   ├── src/
│   │   ├── config/          # Database and Redis configuration
│   │   ├── controllers/     # Request handlers
│   │   ├── models/          # MongoDB schemas
│   │   ├── routes/          # API route definitions
│   │   ├── services/        # Business logic (AI, documents, exports)
│   │   ├── jobs/            # Background job processors
│   │   ├── middleware/      # Auth, validation, rate limiting
│   │   ├── utils/           # Helper functions
│   │   └── server.js        # Express app entry point
│   ├── uploads/             # Temporary file storage
│   ├── exports/             # Generated export files
│   ├── logs/                # Application logs
│   └── package.json
├── frontend/                # Next.js application (to be built)
├── docker-compose.yml       # Docker orchestration
├── .env.example             # Environment template
├── .gitignore
└── README.md
```

## 🔑 API Endpoints

### Authentication (`/api/v1/auth`)
- `POST /register` - Register new user
- `POST /login` - Login user
- `POST /logout` - Logout user
- `POST /refresh` - Refresh access token
- `GET /me` - Get current user profile
- `PUT /profile` - Update user profile
- `PUT /password` - Change password

### Presentations (`/api/v1/presentations`)
- `GET /` - List all presentations
- `POST /` - Create new presentation
- `GET /:id` - Get presentation details
- `PUT /:id` - Update presentation
- `DELETE /:id` - Delete presentation
- `POST /upload` - Upload document
- `POST /:id/generate` - Generate slides
- `GET /:id/progress` - Get generation progress
- `PUT /:id/slides/:slideNumber` - Customize slide
- `POST /:id/export/pdf` - Export to PDF
- `POST /:id/export/pptx` - Export to PPTX

### Credits (`/api/v1/credits`)
- `GET /balance` - Get credit balance
- `GET /transactions` - Get transaction history
- `GET /costs` - Get credit cost breakdown

### Admin (`/api/v1/admin`)
- `GET /stats` - Dashboard statistics
- `GET /users` - List all users
- `GET /users/:id` - Get user details
- `PUT /users/:id` - Update user
- `DELETE /users/:id` - Delete user
- `POST /users/:id/credits` - Adjust user credits
- `GET /logs` - System logs
- `GET /health` - System health metrics

## 💳 Credit System

### Operations and Costs
- **Slide Generation**: 10 credits per slide
- **AI Research**: 5 credits per slide
- **Slide Customization**: 15 credits per slide
- **PDF Export**: 20 credits
- **PPTX Export**: 30 credits
- **Document Processing**: 1 credit per MB
- **Premium Template**: 5 credits per slide

### Subscription Plans

#### 🆓 Trial (Free)
- **Duration**: 7 days
- **Credits**: 50
- **Features**: Up to 5 presentations, 10 slides each, 1 export

#### 💼 Starter ($9.99/month)
- **Credits**: 500/month (3-month rollover)
- **Features**: Unlimited presentations, 20 slides max, 10 exports/month

#### 🚀 Professional ($29.99/month)
- **Credits**: 2000/month (6-month rollover)
- **Features**: Unlimited presentations, 50 slides max, unlimited exports

#### 🏢 Enterprise ($99.99/month)
- **Credits**: 10000/month (12-month rollover)
- **Features**: Everything unlimited, custom branding, API access

## 🔧 Configuration

### Environment Variables

```env
# Server
NODE_ENV=development
PORT=5000
API_URL=http://localhost:5000
FRONTEND_URL=http://localhost:3000

# Database
MONGODB_URI=mongodb://localhost:27017/ai-slides-platform

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# Authentication
JWT_SECRET=your-super-secret-key
JWT_REFRESH_SECRET=your-refresh-secret
JWT_EXPIRE=24h
JWT_REFRESH_EXPIRE=30d

# AI Service
GEMINI_API_KEY=your-gemini-api-key
GEMINI_MODEL=gemini-pro

# File Upload
MAX_FILE_SIZE=524288000
UPLOAD_DIR=./uploads
EXPORT_DIR=./exports

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# CORS
CORS_ORIGIN=http://localhost:3000

# Credits
FREE_TRIAL_CREDITS=50
FREE_TRIAL_DAYS=7
```

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test -- authController.test.js
```

## 📊 Monitoring & Logs

### Log Files
- `logs/error.log` - Error logs
- `logs/combined.log` - All logs
- `logs/exceptions.log` - Uncaught exceptions
- `logs/rejections.log` - Unhandled promise rejections

### Check Logs
```bash
# View backend logs
tail -f backend/logs/combined.log

# View error logs only
tail -f backend/logs/error.log

# Docker logs
docker-compose logs -f backend
```

## 🔒 Security Features

- **Password Hashing**: bcrypt with 12 rounds
- **JWT Authentication**: Access + refresh token pattern
- **Rate Limiting**: Redis-backed, plan-based limits
- **Input Validation**: Joi schemas
- **CORS Protection**: Configured origins
- **Helmet**: Security headers
- **Cookie Security**: HttpOnly, Secure, SameSite
- **File Validation**: Type and size checks

## 🚀 Deployment

### Production Checklist

1. **Environment Setup**:
```bash
# Set production environment
NODE_ENV=production

# Use strong secrets
JWT_SECRET=$(openssl rand -base64 32)
JWT_REFRESH_SECRET=$(openssl rand -base64 32)

# Configure production URLs
API_URL=https://api.yourdomain.com
FRONTEND_URL=https://yourdomain.com
```

2. **Database**:
- Use MongoDB Atlas or managed MongoDB
- Enable authentication
- Configure connection pooling
- Set up automated backups

3. **Redis**:
- Use Redis Cloud or managed Redis
- Enable persistence
- Configure maxmemory policies

4. **Security**:
- Enable HTTPS (SSL certificates)
- Set secure cookie flags
- Configure firewall rules
- Enable rate limiting
- Set up API key rotation

5. **Monitoring**:
- Set up error tracking (Sentry)
- Configure uptime monitoring
- Enable performance monitoring
- Set up log aggregation

### Deploy to VPS (DigitalOcean, Linode, etc.)

```bash
# Install Node.js and dependencies
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs mongodb redis

# Clone repository
git clone <your-repo-url>
cd ai-slides-platform

# Install dependencies
cd backend && npm install --production

# Setup PM2
sudo npm install -g pm2
pm2 start src/server.js --name ai-slides-api
pm2 save
pm2 startup

# Configure Nginx reverse proxy
sudo nano /etc/nginx/sites-available/ai-slides
```

### Deploy with Docker

```bash
# Build images
docker-compose build

# Start in production mode
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d

# Scale backend instances
docker-compose up -d --scale backend=3
```

## 🛠️ Development

### Setup Development Environment

```bash
# Install dependencies
cd backend && npm install

# Start in development mode with auto-reload
npm run dev

# Run linter
npm run lint
```

### Creating New Features

1. **Add Model**: Create in `src/models/`
2. **Add Routes**: Create in `src/routes/`
3. **Add Controller**: Create in `src/controllers/`
4. **Add Service**: Create in `src/services/` for business logic
5. **Add Middleware**: Create in `src/middleware/` if needed
6. **Update Tests**: Add tests for new features

## 📝 Next Steps

### Immediate Tasks
1. **Implement Presentation Controller**: Complete CRUD operations
2. **Build Slide Generation Engine**: Integrate Gemini service with job queue
3. **Add Export Services**: Implement Puppeteer and PptxGenJS exporters
4. **Setup BullMQ**: Configure background job processing
5. **Create Frontend**: Build Next.js application
6. **Admin Dashboard**: Implement analytics and management UI
7. **Payment Integration**: Add Stripe for subscriptions
8. **Email Service**: Configure nodemailer for notifications

### Future Enhancements
- **Real-time Collaboration**: Multiple users editing same presentation
- **Template Library**: Pre-built professional templates
- **Image Generation**: AI-generated images for slides
- **Voice Narration**: TTS for slide presentations
- **Analytics**: User behavior and usage analytics
- **API Access**: REST API for enterprise customers
- **Mobile Apps**: iOS and Android applications
- **Integration**: Google Slides, PowerPoint plugins

## 🤝 Contributing

This is a comprehensive foundation for an AI slide generation platform. The architecture is designed for scalability and maintainability. Feel free to extend and customize based on your needs.

## 📄 License

MIT License - feel free to use this for your own projects.

## 🆘 Support

For issues or questions:
- Check logs in `backend/logs/`
- Review environment configuration
- Verify MongoDB and Redis connections
- Check API endpoint responses

## 📞 Contact

Built with ❤️ for creating amazing presentations with AI.

---

**Note**: This is a comprehensive foundation. The backend API structure, authentication, credit system, document processing, and AI integration are complete. The remaining tasks are:
1. Complete presentation controller implementation
2. Build export services
3. Setup BullMQ job queue
4. Develop frontend application
5. Create admin dashboard

The architecture is solid and ready for these implementations!
