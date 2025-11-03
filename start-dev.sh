#!/bin/bash

echo "🚀 Starting AI Slides Platform Development Environment..."
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "⚠️  .env file not found. Creating from .env.example..."
    cp .env.example .env
    echo "✅ Created .env file. Please configure your API keys!"
    echo ""
fi

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

echo "📦 Starting Docker services (MongoDB + Redis)..."
docker-compose up -d mongodb redis

echo "⏳ Waiting for services to be ready..."
sleep 5

echo "📂 Installing backend dependencies..."
cd backend
npm install

echo "🎯 Starting backend server..."
npm run dev
