#!/bin/bash

# Configuration
BASE_URL="http://localhost:3000"
COOKIE_FILE="cookies.txt"

echo "🚀 Starting API Tests..."
echo "--------------------------"

# 1. Login
echo "1. Testing Login (Admin)..."
curl -s -X POST "$BASE_URL/auth/login" \
     -c "$COOKIE_FILE" \
     -H "Content-Type: application/json" \
     -d '{"email":"admin@company.com","password":"admin123"}' | jq .
echo -e "\n"

# 2. Auth Me
echo "2. Testing /auth/me..."
curl -s -b "$COOKIE_FILE" "$BASE_URL/auth/me" | jq .
echo -e "\n"

# 3. Get Projects
echo "3. Testing GET /projects..."
curl -s -b "$COOKIE_FILE" "$BASE_URL/projects" | jq .
echo -e "\n"

# 4. Create Check-in
echo "4. Testing POST /check-ins..."
curl -s -X POST "$BASE_URL/check-ins" \
     -b "$COOKIE_FILE" \
     -H "Content-Type: application/json" \
     -d '{
       "status": "in_office",
       "intent": "Completing the core backend infrastructure",
       "isBlocked": false
     }' | jq .
echo -e "\n"

# 5. Get Dashboard Presence
echo "5. Testing GET /dashboard/presence..."
curl -s -b "$COOKIE_FILE" "$BASE_URL/dashboard/presence" | jq .
echo -e "\n"

# 6. Get Dashboard Blockers
echo "6. Testing GET /dashboard/blockers..."
curl -s -b "$COOKIE_FILE" "$BASE_URL/dashboard/blockers" | jq .
echo -e "\n"

echo "--------------------------"
echo "✅ Tests Completed!"
rm "$COOKIE_FILE"
