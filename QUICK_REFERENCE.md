# 🚀 Quick Reference - AI Slides Platform

## 📍 Project Location
```bash
cd /home/user/webapp
```

## ⚡ Quick Commands

### Start Development
```bash
# Start MongoDB + Redis
docker-compose up -d mongodb redis

# Install dependencies (first time only)
cd backend && npm install

# Start backend server
npm run dev
```

### Test API
```bash
# Health check
curl http://localhost:5000/health

# Register user
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"Test1234!","name":"Test User"}'

# Login
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"Test1234!"}'
```

### Docker Commands
```bash
# View logs
docker-compose logs -f mongodb
docker-compose logs -f redis

# Stop services
docker-compose down

# Restart services
docker-compose restart mongodb redis

# Check status
docker-compose ps
```

### MongoDB Commands
```bash
# Connect to MongoDB
docker exec -it ai-slides-mongodb mongosh ai-slides-platform

# Inside MongoDB:
db.users.find().pretty()          # View all users
db.users.countDocuments()         # Count users
db.presentations.find().pretty()  # View presentations
exit                              # Exit MongoDB
```

### Redis Commands
```bash
# Connect to Redis
docker exec -it ai-slides-redis redis-cli

# Inside Redis:
KEYS *                 # List all keys
GET key_name          # Get specific key
FLUSHALL              # Clear all data
exit                  # Exit Redis
```

## 🔑 Important Files

```
webapp/
├── .env                        # Configuration (add GEMINI_API_KEY here)
├── README.md                   # Full documentation
├── GETTING_STARTED.md          # Setup guide
├── IMPLEMENTATION_GUIDE.md     # Feature development
├── PROJECT_OVERVIEW.md         # Status & roadmap
└── backend/
    ├── src/server.js           # Main entry point
    ├── logs/                   # Application logs
    └── package.json            # Dependencies
```

## 🔧 Configuration

**Edit `.env` file**:
```bash
nano .env
```

**Required settings**:
- `GEMINI_API_KEY` - Get from https://makersuite.google.com/app/apikey
- `JWT_SECRET` - Change in production
- `MONGODB_URI` - mongodb://mongodb:27017/ai-slides-platform (for Docker)

## 📊 API Endpoints

### Working Endpoints ✅
```
POST   /api/v1/auth/register      # Create account
POST   /api/v1/auth/login         # Login
GET    /api/v1/auth/me            # Get profile (requires token)
PUT    /api/v1/auth/profile       # Update profile
PUT    /api/v1/auth/password      # Change password
GET    /api/v1/credits/balance    # Check credits
GET    /api/v1/credits/costs      # Get pricing
```

### To Implement 🚧
```
POST   /api/v1/presentations            # Create presentation
GET    /api/v1/presentations            # List presentations
GET    /api/v1/presentations/:id        # Get details
POST   /api/v1/presentations/upload     # Upload document
POST   /api/v1/presentations/:id/export/pdf   # Export PDF
POST   /api/v1/presentations/:id/export/pptx  # Export PPTX
```

## 💳 Credit System

### Costs
- Slide Generation: 10 credits
- AI Research: 5 credits/slide
- Customization: 15 credits
- PDF Export: 20 credits
- PPTX Export: 30 credits
- Document Processing: 1 credit/MB

### Plans
- **Trial**: 50 credits (7 days)
- **Starter**: 500 credits/month ($9.99)
- **Professional**: 2000 credits/month ($29.99)
- **Enterprise**: 10000 credits/month ($99.99)

## 🐛 Troubleshooting

### Port 5000 in use
```bash
lsof -ti:5000 | xargs kill -9
```

### MongoDB not connecting
```bash
docker-compose restart mongodb
docker-compose logs mongodb
```

### Redis not connecting
```bash
docker-compose restart redis
docker exec -it ai-slides-redis redis-cli ping
```

### View application logs
```bash
cd /home/user/webapp/backend
tail -f logs/error.log
tail -f logs/combined.log
```

## 📚 Documentation

1. **GETTING_STARTED.md** - Setup instructions (START HERE!)
2. **README.md** - Complete documentation
3. **IMPLEMENTATION_GUIDE.md** - How to build remaining features
4. **PROJECT_OVERVIEW.md** - Status and roadmap
5. **QUICK_REFERENCE.md** - This file!

## ✅ Status: 60% Complete

**Completed**:
- ✅ Backend infrastructure
- ✅ Authentication system
- ✅ Database models
- ✅ Credit system
- ✅ Document processing
- ✅ AI integration
- ✅ Security & rate limiting
- ✅ Docker setup

**Remaining**:
- 🚧 Presentation controller
- 🚧 Slide generation jobs
- 🚧 Export services (PDF/PPTX)
- 🚧 Frontend (Next.js)
- 🚧 Admin dashboard

## 🎯 Next Steps

1. **Test the backend**: Follow GETTING_STARTED.md
2. **Add your Gemini API key**: Edit `.env` file
3. **Start implementing**: Follow IMPLEMENTATION_GUIDE.md
4. **Build the frontend**: Create Next.js app in frontend/

## 📞 Useful Links

- [Google Gemini API Key](https://makersuite.google.com/app/apikey)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- [Redis Cloud](https://redis.com/try-free/)
- [Next.js Docs](https://nextjs.org/docs)
- [Shadcn/ui](https://ui.shadcn.com/)

---

**Ready to start?** Run:
```bash
cd /home/user/webapp
cat GETTING_STARTED.md
```
