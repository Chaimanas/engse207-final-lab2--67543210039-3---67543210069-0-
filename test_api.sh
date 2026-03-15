#!/bin/sh
# Test login
LOGIN=$(curl -s -X POST http://auth-service:3001/api/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"admin@example.com","password":"password123"}')
echo "Login response: $LOGIN"

TOKEN=$(echo "$LOGIN" | grep -o '"token":"[^"]*' | sed 's/"token":"//' | head -1)
echo "Extracted token: $TOKEN"

# Test tasks API
echo ""
echo "Testing tasks API with token:"
curl -s http://task-service:3002/api/tasks \
  -H "Authorization: Bearer $TOKEN" | head -c 500
