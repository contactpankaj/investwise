#!/bin/bash

set -e  # Exit immediately if a command exits with a non-zero status

echo "🔧 Setting up Python backend..."
cd backend_1

if [ ! -d "venv" ]; then
    echo "📦 Creating virtual environment..."
    python3 -m venv venv
fi

source venv/bin/activate
echo "📦 Installing backend dependencies..."
pip install -r requirements.txt
deactivate
cd ..

echo "🔧 Setting up React frontend..."
cd folder_1
echo "📦 Installing frontend dependencies..."
npm install
npm install groq-sdk
npm install chartjs-chart-matrix chartjs-adapter-date-fns

echo "⚙️ Building React app..."
npm run build

echo "🚀 Deploying to Netlify..."
netlify deploy --prod --dir=build  # ✅ build is the default for Create React App