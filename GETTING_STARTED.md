# 🚀 Getting Started with AI Slides Platform

This guide will help you get the AI Slides Platform running on your localhost.

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

1. **Node.js 18+**: [Download here](https://nodejs.org/)
2. **Docker Desktop**: [Download here](https://www.docker.com/products/docker-desktop/)
3. **Google Gemini API Key**: [Get free key here](https://makersuite.google.com/app/apikey)

## ⚡ Quick Start (5 minutes)

### Step 1: Configure Environment

The project is located at `/home/user/webapp`. A `.env` file already exists, but you need to add your Gemini API key:

```bash
cd /home/user/webapp
nano .env
```

Find this line:
```env
GEMINI_API_KEY=your-gemini-api-key-here
```

Replace `your-gemini-api-key-here` with your actual Gemini API key, then save (Ctrl+X, Y, Enter).

### Step 2: Start MongoDB and Redis

```bash
cd /home/user/webapp
docker-compose up -d mongodb redis
```

Wait about 10 seconds for services to start.

### Step 3: Install Backend Dependencies

```bash
cd /home/user/webapp/backend
npm install
```

This will take 2-3 minutes.

### Step 4: Start the Backend Server

```bash
npm run dev
```

You should see:
```
Server running on port 5000 in development mode
MongoDB Connected: mongodb
Redis client connected
```

### Step 5: Test the API

Open a new terminal and test:

```bash
# Health check
curl http://localhost:5000/health

# Expected response:
# {"success":true,"message":"Server is healthy","timestamp":"...","env":"development"}
```

## 🎯 Testing Authentication

### 1. Register a New User

```bash
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test1234!",
    "name": "Test User"
  }'
```

Expected response:
```json
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "user": {
      "_id": "...",
      "email": "test@example.com",
      "name": "Test User",
      "role": "user",
      "credits": 50,
      "subscription": {
        "plan": "trial",
        "status": "trialing"
      }
    },
    "token": "eyJhbGciOi...",
    "refreshToken": "eyJhbGciOi..."
  }
}
```

### 2. Login

```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test1234!"
  }'
```

Copy the `token` from the response for the next step.

### 3. Get User Profile

```bash
# Replace YOUR_TOKEN with the actual token from login
curl http://localhost:5000/api/v1/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 4. Check Credit Balance

```bash
curl http://localhost:5000/api/v1/credits/balance \
  -H "Authorization: Bearer YOUR_TOKEN"
```

Expected response:
```json
{
  "success": true,
  "data": {
    "credits": 50,
    "subscription": {
      "plan": "trial",
      "status": "trialing",
      "startDate": "...",
      "endDate": "..."
    }
  }
}
```

## 📁 Project Structure Overview

```
/home/user/webapp/
├── backend/                 # Backend API (Express + MongoDB)
│   ├── src/
│   │   ├── controllers/     # Request handlers
│   │   ├── models/          # MongoDB schemas
│   │   ├── routes/          # API endpoints
│   │   ├── services/        # AI, documents, exports
│   │   ├── middleware/      # Auth, rate limiting
│   │   ├── utils/           # Helper functions
│   │   ├── config/          # Database, Redis
│   │   └── server.js        # Main entry point
│   ├── uploads/             # Temp file storage
│   ├── exports/             # Generated files
│   └── logs/                # Application logs
├── frontend/                # Frontend (To be built)
├── docker-compose.yml       # Docker orchestration
└── .env                     # Environment config
```

## 🔑 Available API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Create account
- `POST /api/v1/auth/login` - Sign in
- `POST /api/v1/auth/logout` - Sign out
- `GET /api/v1/auth/me` - Get profile
- `PUT /api/v1/auth/profile` - Update profile
- `PUT /api/v1/auth/password` - Change password

### Presentations (Requires Auth Token)
- `GET /api/v1/presentations` - List presentations
- `POST /api/v1/presentations` - Create presentation
- `GET /api/v1/presentations/:id` - Get details
- `POST /api/v1/presentations/upload` - Upload document

### Credits (Requires Auth Token)
- `GET /api/v1/credits/balance` - Check balance
- `GET /api/v1/credits/transactions` - View history
- `GET /api/v1/credits/costs` - Get pricing

### Admin (Requires Admin Role)
- `GET /api/v1/admin/stats` - Dashboard stats
- `GET /api/v1/admin/users` - Manage users
- `GET /api/v1/admin/logs` - System logs

## 🔧 Useful Commands

### Docker Management
```bash
# Start services
docker-compose up -d mongodb redis

# Stop services
docker-compose down

# View logs
docker-compose logs -f mongodb
docker-compose logs -f redis

# Restart services
docker-compose restart mongodb redis

# Check status
docker-compose ps
```

### Backend Development
```bash
cd /home/user/webapp/backend

# Start dev server (auto-reload)
npm run dev

# Start production server
npm start

# Run tests
npm test

# View logs
tail -f logs/combined.log
tail -f logs/error.log
```

### MongoDB Management
```bash
# Connect to MongoDB
docker exec -it ai-slides-mongodb mongosh ai-slides-platform

# Inside MongoDB shell:
# Show all users
db.users.find().pretty()

# Count users
db.users.countDocuments()

# Find user by email
db.users.findOne({ email: "test@example.com" })

# Exit
exit
```

### Redis Management
```bash
# Connect to Redis
docker exec -it ai-slides-redis redis-cli

# Inside Redis:
# List all keys
KEYS *

# Get specific key
GET rl:general:127.0.0.1

# Clear all data
FLUSHALL

# Exit
exit
```

## 🐛 Troubleshooting

### Issue: Port 5000 already in use

```bash
# Find and kill process on port 5000
lsof -ti:5000 | xargs kill -9

# Or use different port in .env
PORT=5001
```

### Issue: MongoDB connection failed

```bash
# Check if MongoDB is running
docker ps | grep mongodb

# Restart MongoDB
docker-compose restart mongodb

# Check MongoDB logs
docker-compose logs mongodb
```

### Issue: Redis connection failed

```bash
# Check if Redis is running
docker ps | grep redis

# Restart Redis
docker-compose restart redis

# Test Redis connection
docker exec -it ai-slides-redis redis-cli ping
```

### Issue: Gemini API errors

```bash
# Verify API key is set
cat .env | grep GEMINI_API_KEY

# Test API key manually
curl https://generativelanguage.googleapis.com/v1/models?key=YOUR_KEY
```

### Issue: npm install fails

```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

## 📊 Monitoring

### Check Application Health
```bash
# Health endpoint
curl http://localhost:5000/health

# MongoDB status
docker exec ai-slides-mongodb mongosh --eval "db.adminCommand('ping')"

# Redis status
docker exec ai-slides-redis redis-cli ping
```

### View Real-time Logs
```bash
# Backend logs
cd /home/user/webapp/backend
tail -f logs/combined.log

# Docker logs
docker-compose logs -f backend
```

## 🎯 Next Steps

Now that your backend is running, you can:

1. **Test all API endpoints** using the examples above
2. **Create test users** with different subscription plans
3. **Upload documents** to test processing (when controller is implemented)
4. **Build the frontend** using Next.js (see README.md)
5. **Implement remaining features**:
   - Presentation controller
   - Slide generation engine
   - Export services (PDF, PPTX)
   - Background job queue (BullMQ)
   - Admin dashboard

## 📚 Additional Resources

- [MongoDB Documentation](https://docs.mongodb.com/)
- [Redis Documentation](https://redis.io/documentation)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)
- [Google Gemini API](https://ai.google.dev/docs)
- [Docker Compose](https://docs.docker.com/compose/)

## 🆘 Need Help?

1. Check logs: `tail -f backend/logs/error.log`
2. Verify environment: `cat .env`
3. Test services: `docker-compose ps`
4. Review README.md for architecture details

---

**You're all set!** 🎉 The backend API is running and ready for development.
