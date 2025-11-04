# 🎓 Complete Beginner's Guide to AI Slides Platform
## From Zero to Running Full-Stack Application

---

# 📚 Table of Contents

1. [What You're Building](#what-youre-building)
2. [What You Need to Install](#what-you-need-to-install)
3. [Step-by-Step Installation](#step-by-step-installation)
4. [Getting the Code](#getting-the-code)
5. [Setting Up the Backend](#setting-up-the-backend)
6. [Setting Up the Frontend](#setting-up-the-frontend)
7. [Running the Full Application](#running-the-full-application)
8. [Testing Your Application](#testing-your-application)
9. [Understanding the Application](#understanding-the-application)
10. [Troubleshooting Common Issues](#troubleshooting-common-issues)
11. [Next Steps](#next-steps)

---

# 🎯 What You're Building

You're setting up a **complete full-stack AI-powered slide generation SaaS platform** that includes:

## Frontend (User Interface)
✅ **Beautiful landing page** with modern design  
✅ **User registration and login** system  
✅ **Dashboard** showing credits and presentations  
✅ **Create presentations** from text prompts OR uploaded documents  
✅ **Responsive design** works on desktop, tablet, and mobile  

## Backend (Server & AI Logic)
✅ **Express.js API server** handling all requests  
✅ **MongoDB database** storing users and presentations  
✅ **Google Gemini AI** generating slide content  
✅ **Document processing** for PDF, DOCX, DOC, TXT files  
✅ **Credit system** managing subscription and usage  
✅ **JWT authentication** securing all endpoints  

**Status**: Complete full-stack application ready to run!

---

# 💻 What You Need to Install

## Required Software (Must Have)

### 1. **Node.js** - Runs JavaScript code
- **What it is**: Runtime environment for JavaScript
- **Why you need it**: Both frontend and backend use JavaScript
- **Download**: https://nodejs.org/
- **Version needed**: 18 or higher
- **File size**: ~50 MB

**How to verify after installation:**
```bash
node --version    # Should show v18.x.x or higher
npm --version     # Should show 9.x.x or higher
```

### 2. **Git** - Version control system
- **What it is**: Tool to download code from GitHub
- **Why you need it**: To clone the repository
- **Download**: https://git-scm.com/downloads
- **File size**: ~45 MB

**How to verify:**
```bash
git --version    # Should show git version 2.x.x
```

### 3. **Docker Desktop** - Container platform
- **What it is**: Runs MongoDB and Redis without manual installation
- **Why you need it**: Simplifies database setup
- **Download**: https://www.docker.com/products/docker-desktop/
- **File size**: ~500 MB
- **Note**: Requires system restart after installation

**How to verify:**
```bash
docker --version           # Should show Docker version 20.x.x
docker-compose --version   # Should show version 2.x.x
```

### 4. **Code Editor** (Choose one)
- **VS Code** (Recommended): https://code.visualstudio.com/
- **Sublime Text**: https://www.sublimetext.com/
- **Notepad++**: https://notepad-plus-plus.org/

### 5. **Google Gemini API Key** (FREE)
- **What it is**: Your personal key to access Google's AI
- **Why you need it**: Powers the AI slide generation
- **Get it**: https://makersuite.google.com/app/apikey
- **Cost**: FREE (60 requests per minute limit)

**Steps to get API key:**
1. Visit https://makersuite.google.com/app/apikey
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the key (looks like: `AIzaSyD...`)
5. Save it somewhere safe - you'll need it later!

---

# 🚀 Step-by-Step Installation

## Step 1: Install Node.js

### For Windows:
1. Go to https://nodejs.org/
2. Click "Download Node.js (LTS)" green button
3. Open the downloaded `.msi` file
4. Click "Next" through the installer
5. Accept license agreement
6. Click "Install" (enter admin password if asked)
7. Wait 2-3 minutes
8. Click "Finish"

### For Mac:
1. Go to https://nodejs.org/
2. Download macOS installer
3. Open the `.pkg` file
4. Follow installation steps
5. Enter your Mac password when asked
6. Click "Install"

### For Linux:
```bash
# Ubuntu/Debian
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Fedora
sudo dnf install nodejs

# Verify
node --version
npm --version
```

---

## Step 2: Install Git

### For Windows:
1. Download from https://git-scm.com/download/win
2. Run the installer
3. Accept all default options (just keep clicking "Next")
4. Click "Install"
5. Click "Finish"

### For Mac:
```bash
# Install Xcode Command Line Tools
xcode-select --install

# Or use Homebrew
brew install git
```

### For Linux:
```bash
# Ubuntu/Debian
sudo apt-get install git

# Fedora
sudo dnf install git
```

**Verify installation:**
```bash
git --version
```

---

## Step 3: Install Docker Desktop

### For Windows:
1. Go to https://www.docker.com/products/docker-desktop/
2. Click "Download for Windows"
3. Run the installer
4. Follow the installation wizard
5. **Restart your computer** when prompted
6. Open Docker Desktop after restart
7. Accept the service agreement
8. Wait for Docker to start (green icon in system tray)

### For Mac:
1. Go to https://www.docker.com/products/docker-desktop/
2. Download for Mac (Intel or Apple Silicon)
3. Open the `.dmg` file
4. Drag Docker to Applications folder
5. Open Docker from Applications
6. Enter password when asked
7. Wait for Docker to start

### For Linux:
```bash
# Ubuntu/Debian
sudo apt-get update
sudo apt-get install docker.io docker-compose
sudo systemctl start docker
sudo systemctl enable docker

# Add your user to docker group
sudo usermod -aG docker $USER
# Log out and back in for this to take effect
```

**Verify Docker is running:**
```bash
docker --version
docker-compose --version
docker ps    # Should show empty list, not an error
```

---

## Step 4: Install Code Editor (VS Code Recommended)

1. Go to https://code.visualstudio.com/
2. Click "Download"
3. Install like any other program
4. Open VS Code
5. (Optional) Install extensions:
   - "ESLint" for code quality
   - "Prettier" for code formatting
   - "GitLens" for Git integration

---

# 📥 Getting the Code

## Option 1: Clone from GitHub (Recommended)

Open **Terminal** (Mac/Linux) or **Command Prompt** (Windows):

```bash
# Navigate to where you want the project
cd Desktop    # Or any folder you prefer

# Clone the repository
git clone <YOUR_GITHUB_REPOSITORY_URL>

# Navigate into project
cd webapp

# Verify files are there
ls    # Mac/Linux
dir   # Windows
```

## Option 2: Download ZIP from GitHub

1. Go to your GitHub repository
2. Click the green "Code" button
3. Click "Download ZIP"
4. Extract the ZIP file
5. Open the extracted folder

---

# 🔧 Setting Up the Backend

## Step 1: Navigate to Backend Directory

```bash
cd webapp/backend
```

## Step 2: Install Backend Dependencies

This will download all necessary packages (Express, MongoDB, AI libraries, etc.):

```bash
npm install
```

**Wait time**: 2-5 minutes depending on internet speed

**You should see:**
```
added 234 packages in 3m
```

## Step 3: Create Environment Configuration

Create a file named `.env` in the `backend` directory:

```bash
# Copy the example file
cp .env.example .env

# Or create manually if cp doesn't work
# On Windows: copy .env.example .env
```

Now **EDIT the `.env` file** with your settings:

```env
# Server Configuration
NODE_ENV=development
PORT=5000

# Database (Don't change these for local development)
MONGODB_URI=mongodb://localhost:27017/ai-slides-platform

# Redis (Don't change these for local development)
REDIS_HOST=localhost
REDIS_PORT=6379

# JWT Authentication - CHANGE THESE!
# Generate random strings: https://randomkeygen.com/
JWT_SECRET=your_very_secure_random_string_change_this_12345
JWT_REFRESH_SECRET=another_different_random_string_67890
JWT_EXPIRE=15m
JWT_REFRESH_EXPIRE=7d

# Google Gemini AI - PASTE YOUR API KEY HERE!
GEMINI_API_KEY=AIzaSyD_your_actual_api_key_here

# CORS (Frontend URL)
CORS_ORIGIN=http://localhost:3000

# File Upload
MAX_FILE_SIZE=524288000
UPLOAD_DIR=./uploads

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

**Important**: Replace:
- `JWT_SECRET` with a random string (min 32 characters)
- `JWT_REFRESH_SECRET` with another random string
- `GEMINI_API_KEY` with your actual API key from Google

---

# 🎨 Setting Up the Frontend

## Step 1: Navigate to Frontend Directory

```bash
# From project root
cd webapp/frontend

# Or from backend directory
cd ../frontend
```

## Step 2: Verify Frontend Files

You should see these files:
- `index.html` - The main HTML page
- `app.js` - JavaScript logic
- `package.json` - Project configuration

```bash
ls -la    # Mac/Linux
dir       # Windows
```

## Step 3: No Installation Needed!

The frontend uses vanilla JavaScript and CDN libraries, so **NO npm install** is required for the frontend. All dependencies (TailwindCSS, Font Awesome, Axios) are loaded via CDN links in the HTML.

---

# 🚀 Running the Full Application

Now you'll start **3 things** in order:
1. Docker containers (MongoDB + Redis)
2. Backend server (Express API)
3. Frontend (HTML in browser)

## Step 1: Start Docker Containers

Open a **NEW terminal** and navigate to project root:

```bash
cd webapp

# Start MongoDB and Redis
docker-compose up -d
```

**The `-d` means "detached mode" (runs in background)**

**Wait for**: "✔ Container mongodb Started" and "✔ Container redis Started"

**Verify containers are running:**
```bash
docker-compose ps
```

You should see:
```
NAME      SERVICE    STATUS       PORTS
mongodb   mongodb    running      0.0.0.0:27017->27017/tcp
redis     redis      running      0.0.0.0:6379->6379/tcp
```

---

## Step 2: Start Backend Server

Open a **NEW terminal** (keep Docker terminal running):

```bash
cd webapp/backend

# Start backend in development mode
npm run dev
```

**You should see:**
```
[INFO] Server running on port 5000
[INFO] MongoDB connected: localhost
[INFO] Redis connected: localhost:6379
```

**Keep this terminal open!** Don't close it while using the app.

**To stop backend later**: Press `Ctrl + C`

---

## Step 3: Start Frontend

### Option A: Simple HTTP Server (Recommended)

Open a **NEW terminal** (keep backend terminal running):

```bash
cd webapp/frontend

# Start a simple web server
python3 -m http.server 3000

# Or if you have Node.js http-server
npx http-server -p 3000
```

**You should see:**
```
Serving HTTP on 0.0.0.0 port 3000 ...
```

### Option B: Open Directly in Browser

1. Navigate to `webapp/frontend` folder
2. **Right-click** on `index.html`
3. Choose "Open With" → Your web browser

**Note**: Some features may not work without a proper server due to CORS restrictions. Option A is recommended.

---

## Step 4: Open in Browser

Open your web browser and go to:

```
http://localhost:3000
```

**You should see:**
- Beautiful landing page with purple gradient
- "AI Slides Platform" logo
- "Sign Up" and "Login" buttons
- Features and pricing sections

---

# 🧪 Testing Your Application

## Test 1: Register a New Account

1. Click **"Sign Up"** button on the landing page
2. Fill in the registration form:
   - **Name**: Your Name
   - **Email**: test@example.com
   - **Password**: SecurePass123!
3. Click **"Create Account"**

**What should happen:**
- Success notification appears
- You're automatically logged in
- Dashboard appears showing your 50 trial credits

---

## Test 2: View Dashboard

After logging in, you should see:

- **Credits Balance**: 50 credits
- **Presentations Created**: 0
- **Create New Presentation** button
- Empty presentations list

---

## Test 3: Create Presentation from Prompt

1. Click **"Create New Presentation"** button
2. Enter a title: "Introduction to AI"
3. Select **"Text Prompt"** method
4. Enter prompt: "Create a presentation about artificial intelligence, covering history, types, applications, and future trends"
5. Select **10 slides**
6. Click **"Generate Presentation"**

**What should happen:**
- "Generating presentation..." message appears
- Credits are deducted (10 slides = 10 credits)
- Presentation appears in your list
- Success notification shows

---

## Test 4: Create Presentation from Document

1. Click **"Create New Presentation"** button
2. Enter a title: "Document Summary"
3. Select **"Document Upload"** method
4. Click **"Choose File"**
5. Select a PDF, DOCX, or TXT file
6. Select **15 slides**
7. Click **"Generate Presentation"**

**What should happen:**
- File uploads successfully
- Document is processed
- AI generates outline from document content
- Presentation is created

---

## Test 5: Backend API Test (Advanced)

Open a **NEW terminal** and test the API directly:

```bash
# Health check
curl http://localhost:5000/health

# Register user via API
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "API Test User",
    "email": "apitest@example.com",
    "password": "TestPass123!"
  }'

# Login via API
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "apitest@example.com",
    "password": "TestPass123!"
  }'
```

**You should get JSON responses** with tokens and user data.

---

# 📖 Understanding the Application

## Application Architecture

```
┌─────────────────────────────────────────────────┐
│                  FRONTEND                       │
│  (HTML + JavaScript + TailwindCSS)             │
│  http://localhost:3000                          │
│                                                  │
│  - Landing Page                                 │
│  - Login/Register Modals                        │
│  - Dashboard                                    │
│  - Create Presentation Modal                    │
└─────────────────┬───────────────────────────────┘
                  │ HTTP Requests (Axios)
                  │ (Login, Create, Get Data)
                  ▼
┌─────────────────────────────────────────────────┐
│                  BACKEND                        │
│  (Express.js API Server)                        │
│  http://localhost:5000                          │
│                                                  │
│  - Authentication (JWT)                         │
│  - Presentation CRUD                            │
│  - Document Processing                          │
│  - Credit Management                            │
└───┬──────────────────┬──────────────────┬───────┘
    │                  │                  │
    ▼                  ▼                  ▼
┌────────┐      ┌─────────────┐    ┌────────────┐
│MongoDB │      │   Redis     │    │ Google     │
│Database│      │   Cache     │    │ Gemini AI  │
│        │      │             │    │            │
│Users   │      │Rate Limits  │    │Slide Gen   │
│Presents│      │Sessions     │    │            │
└────────┘      └─────────────┘    └────────────┘
   :27017          :6379            API Cloud
```

## How It Works

### 1. **User Registration & Login**
- User enters credentials in frontend form
- Frontend sends POST request to `/api/v1/auth/register` or `/login`
- Backend validates data, hashes password
- Creates user in MongoDB with 50 trial credits
- Returns JWT token
- Frontend stores token in LocalStorage
- Token included in all future requests

### 2. **Creating Presentation**
- User clicks "Create Presentation"
- Enters title and prompt OR uploads document
- Frontend sends request to `/api/v1/presentations` or `/presentations/upload`
- Backend checks user credits (10 credits per 10 slides)
- If sufficient credits:
  - Deducts credits from user
  - Sends prompt to Google Gemini AI
  - AI generates slide outline
  - Saves presentation to MongoDB
  - Returns presentation data
- Frontend displays success and updates dashboard

### 3. **Dashboard Display**
- Frontend requests user data from `/api/v1/auth/me`
- Backend verifies JWT token
- Returns user info (name, credits, presentations count)
- Frontend requests presentations from `/api/v1/presentations`
- Displays list of user's presentations

---

# 🐛 Troubleshooting Common Issues

## Problem: "Cannot connect to MongoDB"

**Symptoms:**
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```

**Solutions:**
1. Check if Docker is running:
   ```bash
   docker ps
   ```
   
2. Start Docker containers if not running:
   ```bash
   cd webapp
   docker-compose up -d
   ```

3. Verify MongoDB container is running:
   ```bash
   docker-compose ps
   # Should show mongodb as "running"
   ```

4. Check Docker Desktop application - should have green icon

---

## Problem: "Cannot connect to Redis"

**Symptoms:**
```
Error: connect ECONNREFUSED 127.0.0.1:6379
```

**Solutions:**
1. Same as MongoDB - check Docker containers
2. Restart Docker:
   ```bash
   docker-compose down
   docker-compose up -d
   ```

---

## Problem: "CORS Error" in Browser Console

**Symptoms:**
```
Access to XMLHttpRequest at 'http://localhost:5000' from origin 'http://localhost:3000' has been blocked by CORS policy
```

**Solutions:**
1. Check `backend/.env` file:
   ```env
   CORS_ORIGIN=http://localhost:3000
   ```
   
2. Ensure backend is running on port 5000
3. Ensure frontend is running on port 3000
4. Restart backend server after changing `.env`

---

## Problem: "Gemini API Error"

**Symptoms:**
```
Error generating slides: API key not valid
```

**Solutions:**
1. Check your API key in `backend/.env`:
   ```env
   GEMINI_API_KEY=AIzaSy...
   ```

2. Verify API key is valid:
   - Go to https://makersuite.google.com/app/apikey
   - Check if key is still active
   - Generate new key if needed

3. Restart backend after updating key:
   ```bash
   # In backend terminal, press Ctrl+C
   npm run dev
   ```

---

## Problem: "Port 5000 already in use"

**Symptoms:**
```
Error: listen EADDRINUSE: address already in use :::5000
```

**Solutions:**

**On Mac/Linux:**
```bash
# Find and kill process on port 5000
lsof -i :5000
kill -9 <PID>

# Or change port in backend/.env
PORT=5001
```

**On Windows:**
```bash
# Find process
netstat -ano | findstr :5000

# Kill process (replace PID)
taskkill /PID <PID> /F

# Or change port in .env
PORT=5001
```

---

## Problem: "Frontend shows blank page"

**Solutions:**
1. Check browser console (F12 → Console tab)
2. Verify frontend server is running
3. Try opening `index.html` directly
4. Check if files exist:
   ```bash
   cd webapp/frontend
   ls -la
   # Should show index.html and app.js
   ```

---

## Problem: "npm install fails"

**Symptoms:**
```
npm ERR! code EACCES
npm ERR! errno -13
```

**Solutions:**

**On Mac/Linux:**
```bash
# Fix permissions
sudo chown -R $USER ~/.npm
sudo chown -R $USER ~/webapp

# Try again
npm install
```

**On Windows:**
- Run Command Prompt as Administrator
- Navigate to project
- Run `npm install` again

---

## Problem: "Login not working"

**Solutions:**
1. Check browser console for errors (F12)
2. Verify backend is running (`curl http://localhost:5000/health`)
3. Check backend terminal for error messages
4. Verify MongoDB is running (`docker-compose ps`)
5. Check `frontend/app.js` - API_URL should be `http://localhost:5000/api/v1`

---

## Problem: "Docker won't start"

**Solutions:**

**On Windows:**
1. Enable WSL 2:
   - Open PowerShell as Administrator
   - Run: `wsl --install`
   - Restart computer

2. Enable Virtualization in BIOS:
   - Restart computer
   - Enter BIOS (usually F2, F10, or DEL key)
   - Find "Virtualization Technology" option
   - Enable it
   - Save and exit

**On Mac:**
1. Check System Requirements:
   - macOS 10.15 or higher
   - 4GB RAM minimum

2. Allow Docker in System Preferences:
   - System Preferences → Security & Privacy
   - Allow Docker

**On Linux:**
```bash
# Start Docker service
sudo systemctl start docker

# Enable on boot
sudo systemctl enable docker

# Add user to docker group
sudo usermod -aG docker $USER
# Log out and back in
```

---

# ✅ Verification Checklist

Use this checklist to verify everything is working:

- [ ] Node.js installed (`node --version` works)
- [ ] Git installed (`git --version` works)
- [ ] Docker installed (`docker --version` works)
- [ ] Docker containers running (`docker-compose ps` shows 2 services)
- [ ] Backend dependencies installed (`webapp/backend/node_modules` exists)
- [ ] `.env` file created with Gemini API key
- [ ] Backend server running (terminal shows "Server running on port 5000")
- [ ] Frontend server running (terminal shows "Serving HTTP on port 3000")
- [ ] Browser shows landing page at `http://localhost:3000`
- [ ] Can register new account
- [ ] Can login successfully
- [ ] Dashboard shows 50 trial credits
- [ ] Can create presentation from prompt
- [ ] Can upload document

---

# 🎯 Next Steps

## 1. Learn How It Works

Read these files to understand the code:
- `backend/src/server.js` - Main Express application
- `backend/src/routes/authRoutes.js` - Authentication routes
- `backend/src/controllers/presentationController.js` - Presentation logic
- `frontend/app.js` - Frontend JavaScript logic
- `frontend/index.html` - User interface

## 2. Customize the Application

### Change Colors
Edit `frontend/index.html` - find `.gradient-bg`:
```css
.gradient-bg {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    /* Change to your colors */
}
```

### Change Logo/Name
Edit `frontend/index.html` - find the logo section:
```html
<div class="text-2xl font-bold">
    <i class="fas fa-presentation mr-2"></i>AI Slides
</div>
```

### Adjust Credit Costs
Edit `backend/src/utils/creditSystem.js`:
```javascript
// Change slide generation cost
calculateSlideGenerationCost(slideCount, useAI = true, usePremiumTemplate = false) {
  if (!useAI) return 0;
  const baseCredits = slideCount * 1;  // Change this number
  // ...
}
```

## 3. Add New Features

Some ideas to extend the platform:
- Export presentations to PDF/PPTX
- Add slide templates
- Implement payment integration (Stripe)
- Add collaboration features
- Create mobile app version
- Add analytics dashboard

## 4. Deploy to Production

### Backend Deployment
- **Heroku**: https://devcenter.heroku.com/articles/deploying-nodejs
- **DigitalOcean**: https://www.digitalocean.com/community/tutorials
- **AWS**: https://aws.amazon.com/getting-started/

### Frontend Deployment
- **Netlify**: https://www.netlify.com/ (Drag & drop)
- **Vercel**: https://vercel.com/ (One click)
- **GitHub Pages**: Free hosting for static sites

### Database Hosting
- **MongoDB Atlas**: https://www.mongodb.com/cloud/atlas (Free tier)
- **Redis Labs**: https://redis.com/try-free/ (Free tier)

## 5. Learn More

**Recommended Resources:**
- **Express.js**: https://expressjs.com/en/starter/basic-routing.html
- **MongoDB**: https://university.mongodb.com/ (Free courses)
- **JavaScript**: https://javascript.info/
- **REST APIs**: https://restfulapi.net/
- **Docker**: https://docs.docker.com/get-started/

---

# 📞 Getting Help

## Official Documentation
- **This Project**: Check `README.md` in project root
- **Express.js**: https://expressjs.com/
- **MongoDB**: https://docs.mongodb.com/
- **Google Gemini**: https://ai.google.dev/docs

## Common Commands Reference

```bash
# Start everything
cd webapp
docker-compose up -d
cd backend && npm run dev
cd ../frontend && python3 -m http.server 3000

# Stop everything
# Press Ctrl+C in each terminal
docker-compose down

# View Docker logs
docker-compose logs mongodb
docker-compose logs redis

# View backend logs
cd backend
cat logs/combined.log

# Restart backend
# In backend terminal: Ctrl+C
npm run dev

# Check running containers
docker-compose ps

# Check running processes
# Mac/Linux:
ps aux | grep node
lsof -i :5000
lsof -i :3000

# Windows:
netstat -ano | findstr :5000
netstat -ano | findstr :3000
```

---

# 🎊 Congratulations!

You now have a fully functional AI-powered slide generation platform running on your computer!

**What you've accomplished:**
✅ Installed all required software  
✅ Set up a complete full-stack application  
✅ Connected frontend to backend  
✅ Integrated Google Gemini AI  
✅ Set up MongoDB and Redis databases  
✅ Created your first AI-generated presentation  

**You're now ready to:**
- Customize the platform for your needs
- Add new features
- Deploy to production
- Learn more about full-stack development

---

**Last Updated**: December 2024  
**Version**: 2.0 (Complete Full-Stack)  
**Support**: Check README.md or open GitHub issue
