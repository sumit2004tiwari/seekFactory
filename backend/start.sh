#!/bin/bash

echo "🚀 Starting Backend API Server..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "⚠️ .env file not found. Copying from .env.example..."
    cp .env.example .env
    echo "📝 Please update the .env file with your MongoDB URI and JWT secret"
fi

# Start the development server
echo "🔥 Starting development server..."
npm run dev
