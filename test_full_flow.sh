#!/bin/sh

echo "=== Step 1: Testing HTTPS redirect from HTTP ===" 
curl -s -I http://localhost/api/tasks 2>&1 | head -5

echo ""
echo "=== Step 2: Login to get token ==="
LOGIN_RESPONSE=$(curl -s -L http://localhost/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"password123"}')
echo "Login response: $LOGIN_RESPONSE"

TOKEN=$(echo "$LOGIN_RESPONSE" | grep -o '"token":"[^"]*' | sed 's/"token":"//')
echo "Extracted token: ${TOKEN:0:20}..."

echo ""
echo "=== Step 3: Call tasks API with token ==="
curl -s -L "http://localhost/api/tasks" \
  -H "Authorization: Bearer $TOKEN" | head -c 300

echo ""
echo ""
echo "All tests completed!"
