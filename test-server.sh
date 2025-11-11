#!/bin/bash

echo "🚀 Starting DMV Test Web Server..."
echo ""
echo "📍 Server will run at: http://localhost:8000"
echo "📁 Serving from: $(pwd)"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""
echo "─────────────────────────────────────────"

python3 -m http.server 8000
