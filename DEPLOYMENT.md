# 🚀 Deployment Guide - AI Slides Platform

This guide covers deploying your AI Slides Platform to your own domain for production use.

---

## 🎯 Deployment Options

### Option 1: VPS (Recommended for Full Control)
- **Providers**: DigitalOcean, Linode, Vultr, Hetzner
- **Cost**: $5-20/month
- **Best For**: Complete control, custom configuration

### Option 2: Platform as a Service (Easiest)
- **Providers**: Railway, Render, Fly.io
- **Cost**: Free tier available, then $5-15/month
- **Best For**: Quick deployment, auto-scaling

### Option 3: Containerized (Most Scalable)
- **Providers**: AWS ECS, Google Cloud Run, Azure Container Instances
- **Cost**: Varies, pay-as-you-go
- **Best For**: High traffic, enterprise use

---

## 📋 Pre-Deployment Checklist

### 1. Environment Variables
```bash
# Production .env file
NODE_ENV=production
PORT=5000

# Strong secrets (generate new ones!)
JWT_SECRET=$(openssl rand -base64 32)
JWT_REFRESH_SECRET=$(openssl rand -base64 32)

# Production MongoDB (e.g., MongoDB Atlas)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ai-slides-platform

# Production Redis (e.g., Redis Cloud)
REDIS_HOST=redis-xxxxx.cloud.redislabs.com
REDIS_PORT=xxxxx
REDIS_PASSWORD=your-redis-password

# Your domain
API_URL=https://api.yourdomain.com
FRONTEND_URL=https://yourdomain.com
CORS_ORIGIN=https://yourdomain.com

# Gemini API
GEMINI_API_KEY=your-production-gemini-key
```

### 2. Database Setup
- Sign up for [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (free tier available)
- Create a cluster
- Create database user
- Whitelist your server IP
- Get connection string

### 3. Redis Setup
- Sign up for [Redis Cloud](https://redis.com/try-free/) (free tier available)
- Create database
- Get connection details (host, port, password)

### 4. Domain & SSL
- Purchase domain from Namecheap, GoDaddy, etc.
- Set up DNS records pointing to your server
- SSL certificate (Let's Encrypt - free)

---

## 🖥️ Option 1: VPS Deployment (DigitalOcean Example)

### Step 1: Create Droplet

1. Go to [DigitalOcean](https://www.digitalocean.com/)
2. Create account (get $200 credit with referral)
3. Create Droplet:
   - **Image**: Ubuntu 22.04 LTS
   - **Plan**: Basic $6/month (1GB RAM, 1 CPU)
   - **Location**: Nearest to your users
   - **Authentication**: SSH Key (recommended)

### Step 2: Server Setup

```bash
# SSH into your server
ssh root@your-server-ip

# Update system
apt update && apt upgrade -y

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
apt install -y nodejs

# Install MongoDB (local, or use Atlas)
# For production, MongoDB Atlas is recommended
# Skip this if using Atlas

# Install Redis (local, or use Redis Cloud)
# For production, Redis Cloud is recommended
# Skip this if using Redis Cloud

# Install Nginx (reverse proxy)
apt install -y nginx

# Install Certbot (SSL certificates)
apt install -y certbot python3-certbot-nginx

# Install PM2 globally
npm install -g pm2

# Install Git
apt install -y git
```

### Step 3: Deploy Application

```bash
# Clone your repository
cd /var/www
git clone https://github.com/yourusername/ai-slides-platform.git
cd ai-slides-platform

# Install backend dependencies
cd backend
npm install --production

# Create .env file
nano .env
# Paste your production environment variables
# Save and exit (Ctrl+X, Y, Enter)

# Create logs directory
mkdir -p logs

# Start with PM2
pm2 start src/server.js --name ai-slides-api
pm2 save
pm2 startup

# Check status
pm2 status
pm2 logs ai-slides-api
```

### Step 4: Configure Nginx

```bash
# Create Nginx configuration
nano /etc/nginx/sites-available/ai-slides

# Paste this configuration:
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Timeouts for long-running AI requests
        proxy_connect_timeout 300;
        proxy_send_timeout 300;
        proxy_read_timeout 300;
    }
}

# Enable site
ln -s /etc/nginx/sites-available/ai-slides /etc/nginx/sites-enabled/

# Test configuration
nginx -t

# Restart Nginx
systemctl restart nginx
```

### Step 5: Setup SSL Certificate

```bash
# Get free SSL certificate from Let's Encrypt
certbot --nginx -d api.yourdomain.com

# Follow prompts
# Certificate will auto-renew

# Test auto-renewal
certbot renew --dry-run
```

### Step 6: Configure Firewall

```bash
# Setup UFW firewall
ufw allow ssh
ufw allow http
ufw allow https
ufw enable

# Check status
ufw status
```

### Step 7: Test Deployment

```bash
# Test API
curl https://api.yourdomain.com/health

# Should return:
# {"success":true,"message":"Server is healthy",...}
```

---

## ☁️ Option 2: Railway Deployment (Easiest)

### Step 1: Prepare Repository

```bash
# Ensure your code is in GitHub
cd /home/user/webapp
git remote add origin https://github.com/yourusername/ai-slides-platform.git
git push -u origin main
```

### Step 2: Deploy to Railway

1. Go to [Railway.app](https://railway.app/)
2. Sign up with GitHub
3. Click "New Project"
4. Select "Deploy from GitHub repo"
5. Choose your repository
6. Railway will auto-detect your app

### Step 3: Configure Environment

1. Go to project settings
2. Click "Variables"
3. Add all environment variables from `.env`
4. Add production values for MongoDB and Redis

### Step 4: Add MongoDB & Redis

1. Click "New" → "Database" → "Add MongoDB"
2. Copy connection string to `MONGODB_URI`
3. Click "New" → "Database" → "Add Redis"
4. Copy connection details

### Step 5: Deploy

1. Railway auto-deploys on push
2. Get your app URL: `https://your-app.railway.app`
3. Configure custom domain in settings

---

## 🔧 Option 3: Docker Deployment

### Dockerfile (already created)

```dockerfile
# backend/Dockerfile
FROM node:18-alpine

RUN apk add --no-cache chromium nss freetype harfbuzz ca-certificates ttf-freefont

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .

RUN mkdir -p uploads exports logs

EXPOSE 5000

CMD ["npm", "start"]
```

### Build and Run

```bash
# Build image
docker build -t ai-slides-backend ./backend

# Run container
docker run -d \
  --name ai-slides-api \
  -p 5000:5000 \
  --env-file .env \
  ai-slides-backend

# Check logs
docker logs -f ai-slides-api
```

### Docker Compose Production

```yaml
# docker-compose.prod.yml
version: '3.8'

services:
  backend:
    build: ./backend
    restart: always
    ports:
      - "5000:5000"
    environment:
      NODE_ENV: production
    env_file:
      - .env.production
    depends_on:
      - mongodb
      - redis

  mongodb:
    image: mongo:7.0
    restart: always
    volumes:
      - mongodb_data:/data/db
    environment:
      MONGO_INITDB_DATABASE: ai-slides-platform

  redis:
    image: redis:7-alpine
    restart: always
    volumes:
      - redis_data:/data

  nginx:
    image: nginx:alpine
    restart: always
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl

volumes:
  mongodb_data:
  redis_data:
```

---

## 🔐 Production Security

### 1. Environment Security
```bash
# Never commit .env files
# Use strong, unique secrets
# Rotate secrets regularly
# Use environment variables in deployment platform
```

### 2. Database Security
```bash
# Use strong passwords
# Enable authentication
# Whitelist IP addresses only
# Enable SSL/TLS connections
# Regular backups
```

### 3. API Security
```bash
# Rate limiting (already implemented)
# Input validation (already implemented)
# CORS properly configured
# HTTPS only in production
# Monitor for suspicious activity
```

### 4. Server Security
```bash
# Keep system updated
apt update && apt upgrade -y

# Configure firewall (UFW)
ufw enable

# Disable root login
nano /etc/ssh/sshd_config
# Set: PermitRootLogin no

# Use SSH keys only
# Set: PasswordAuthentication no

# Install fail2ban (brute force protection)
apt install fail2ban
```

---

## 📊 Monitoring & Maintenance

### Application Monitoring

```bash
# PM2 monitoring
pm2 monit

# View logs
pm2 logs ai-slides-api

# Restart app
pm2 restart ai-slides-api

# View stats
pm2 show ai-slides-api
```

### Server Monitoring

```bash
# CPU and Memory
htop

# Disk usage
df -h

# Network connections
netstat -tuln

# Check Nginx logs
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log
```

### Database Monitoring

```bash
# MongoDB (if local)
mongosh
db.stats()
db.currentOp()

# Redis (if local)
redis-cli info
redis-cli monitor
```

---

## 🔄 Updates & Deployment

### Update Application

```bash
# SSH into server
cd /var/www/ai-slides-platform

# Pull latest changes
git pull origin main

# Install new dependencies
cd backend
npm install --production

# Restart application
pm2 restart ai-slides-api

# Check logs
pm2 logs ai-slides-api --lines 100
```

### Automated Deployment (GitHub Actions)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to server
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.SERVER_HOST }}
          username: ${{ secrets.SERVER_USER }}
          key: ${{ secrets.SSH_PRIVATE_KEY }}
          script: |
            cd /var/www/ai-slides-platform
            git pull origin main
            cd backend
            npm install --production
            pm2 restart ai-slides-api
```

---

## 🆘 Troubleshooting Production

### App Won't Start

```bash
# Check logs
pm2 logs ai-slides-api

# Check environment variables
pm2 env 0

# Test manually
cd /var/www/ai-slides-platform/backend
node src/server.js
```

### Database Connection Issues

```bash
# Test MongoDB connection
mongosh "your-connection-string"

# Check Redis connection
redis-cli -h host -p port -a password ping
```

### High Memory Usage

```bash
# Check PM2 stats
pm2 status

# Restart if needed
pm2 restart ai-slides-api

# Configure max memory limit
pm2 start src/server.js --name ai-slides-api --max-memory-restart 500M
```

---

## 💰 Cost Estimates

### Minimal Setup (Hobbyist)
- VPS: $5-6/month (DigitalOcean, Linode)
- MongoDB Atlas: Free tier
- Redis Cloud: Free tier
- Domain: $10-15/year
- **Total**: ~$6-8/month

### Production Setup (Small Business)
- VPS: $12-20/month (2GB RAM, 2 CPU)
- MongoDB Atlas: $9-25/month
- Redis Cloud: $5-10/month
- Domain: $10-15/year
- Backups: $5/month
- **Total**: ~$30-60/month

### Enterprise Setup
- Multiple servers with load balancer
- Managed database clusters
- CDN for static assets
- Advanced monitoring
- **Total**: $200-500/month

---

## ✅ Post-Deployment Checklist

- [ ] Application accessible via HTTPS
- [ ] Database connection working
- [ ] Redis connection working
- [ ] User registration working
- [ ] User login working
- [ ] API endpoints responding
- [ ] Logs being generated
- [ ] SSL certificate valid
- [ ] Firewall configured
- [ ] Backups scheduled
- [ ] Monitoring setup
- [ ] Error tracking configured
- [ ] Domain configured
- [ ] Email working (if implemented)
- [ ] Payment processing (if implemented)

---

## 📚 Additional Resources

- [DigitalOcean Tutorials](https://www.digitalocean.com/community/tutorials)
- [PM2 Documentation](https://pm2.keymetrics.io/docs/)
- [Nginx Configuration](https://nginx.org/en/docs/)
- [Let's Encrypt](https://letsencrypt.org/getting-started/)
- [MongoDB Atlas](https://docs.atlas.mongodb.com/)
- [Redis Cloud](https://docs.redis.com/latest/rc/)

---

**Your application is now live!** 🎉

Monitor it regularly, keep it updated, and watch your users create amazing presentations!
