#!/bin/bash
echo "Starting SeekFactory Backend Server..."
echo "Environment: ${NODE_ENV:-development}"
echo "Port: ${PORT:-5000}"
echo "MongoDB URI: ${MONGODB_URI:0:20}..."
echo ""
npm run dev
