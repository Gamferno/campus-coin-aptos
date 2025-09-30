#!/bin/bash

echo "🚀 Campus Coin - Quick Start"
echo "============================"

# Simple cleanup and start - no port checking
pkill -f "python3 -m http.server" 2>/dev/null || true
pkill -f "nodemon" 2>/dev/null || true
sleep 1

echo "Starting backend on port 5000..."
(cd backend && npm run dev > /dev/null 2>&1 &)

echo "Starting frontend on port 3001..."
(cd frontend && python3 -m http.server 3001 > /dev/null 2>&1 &)

sleep 3

echo ""
echo "✅ Servers started!"
echo "📱 Frontend: http://localhost:3001"  
echo "🔧 Backend: http://localhost:5000"
echo ""
echo "Press Ctrl+C to stop or run: pkill -f 'python3\\|nodemon'"