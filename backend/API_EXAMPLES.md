# TCC LMS API Examples

This document provides curl examples for all API endpoints.

## Setup

First, set your base URL:
```bash
export BASE_URL="http://localhost:8080"
```

## Authentication

### 1. Register a new student
```bash
curl -X POST $BASE_URL/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "student@example.com",
    "password": "password123",
    "first_name": "John",
    "last_name": "Doe",
    "role": "student"
  }'
```

### 2. Register an instructor
```bash
curl -X POST $BASE_URL/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "instructor@example.com",
    "password": "password123",
    "first_name": "Jane",
    "last_name": "Smith",
    "role": "instructor"
  }'
```

### 3. Login
```bash
curl -X POST $BASE_URL/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "student@example.com",
    "password": "password123"
  }'
```

**Save the token from the response:**
```bash
export TOKEN="your-jwt-token-here"
```

### 4. Get current user info
```bash
curl -X GET $BASE_URL/api/auth/me \
  -H "Authorization: Bearer $TOKEN"
```

## Courses

### 5. List all courses (public)
```bash
curl -X GET "$BASE_URL/api/courses?limit=10&offset=0"
```

### 6. Filter courses
```bash
# By category
curl -X GET "$BASE_URL/api/courses?category=programming"

# By level
curl -X GET "$BASE_URL/api/courses?level=beginner"

# By instructor
curl -X GET "$BASE_URL/api/courses?instructor_id=2"

# Combined filters
curl -X GET "$BASE_URL/api/courses?category=programming&level=beginner&limit=20"
```

### 7. Create a course (instructor/admin only)
```bash
curl -X POST $BASE_URL/api/courses/create \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Introduction to Go Programming",
    "slug": "intro-to-go",
    "short_description": "Learn Go from scratch",
    "description": "A comprehensive course covering Go fundamentals, concurrency, web development, and more.",
    "category": "programming",
    "level": "beginner",
    "price": 49.99,
    "currency": "USD",
    "is_published": true,
    "duration_hours": 20
  }'
```

### 8. Get course by ID
```bash
curl -X GET $BASE_URL/api/courses/1 \
  -H "Authorization: Bearer $TOKEN"
```

### 9. Get course by slug
```bash
curl -X GET $BASE_URL/api/courses/intro-to-go \
  -H "Authorization: Bearer $TOKEN"
```

### 10. Update a course (instructor/admin only)
```bash
curl -X PUT $BASE_URL/api/courses/1 \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Introduction to Go Programming - Updated",
    "price": 59.99,
    "is_published": true
  }'
```

### 11. Delete a course (admin only)
```bash
curl -X DELETE $BASE_URL/api/courses/1 \
  -H "Authorization: Bearer $TOKEN"
```

## Enrollments

### 12. Enroll in a course (student only)
```bash
curl -X POST $BASE_URL/api/enrollments \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "course_id": 1
  }'
```

### 13. List my enrollments
```bash
# All enrollments
curl -X GET $BASE_URL/api/enrollments/me \
  -H "Authorization: Bearer $TOKEN"

# Filter by status
curl -X GET "$BASE_URL/api/enrollments/me?status=active" \
  -H "Authorization: Bearer $TOKEN"

# With pagination
curl -X GET "$BASE_URL/api/enrollments/me?limit=20&offset=0" \
  -H "Authorization: Bearer $TOKEN"
```

### 14. Get enrollment by ID
```bash
curl -X GET $BASE_URL/api/enrollments/1 \
  -H "Authorization: Bearer $TOKEN"
```

### 15. List course enrollments (instructor/admin only)
```bash
curl -X GET $BASE_URL/api/courses/1/enrollments \
  -H "Authorization: Bearer $TOKEN"

# Filter by status
curl -X GET "$BASE_URL/api/courses/1/enrollments?status=active" \
  -H "Authorization: Bearer $TOKEN"
```

## Quizzes

### 16. Create a quiz (instructor/admin only)
```bash
curl -X POST $BASE_URL/api/quizzes \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "lesson_id": 1,
    "title": "Module 1 Quiz",
    "description": "Test your understanding of Go basics",
    "passing_score": 70,
    "time_limit_minutes": 30,
    "max_attempts": 3
  }'
```

### 17. Get quiz details
```bash
curl -X GET $BASE_URL/api/quizzes/1 \
  -H "Authorization: Bearer $TOKEN"
```

### 18. Start a quiz attempt
```bash
curl -X POST $BASE_URL/api/quizzes/1/attempts \
  -H "Authorization: Bearer $TOKEN"
```

**Response includes:**
- Attempt ID
- Questions with options (correct answers hidden)
- Time limit information

**Save the attempt ID:**
```bash
export ATTEMPT_ID=1
```

### 19. Submit quiz answers
```bash
curl -X POST $BASE_URL/api/quizzes/attempts/$ATTEMPT_ID/submit \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '[
    {
      "question_id": 1,
      "selected_option_id": 3
    },
    {
      "question_id": 2,
      "selected_option_id": 7
    },
    {
      "question_id": 3,
      "selected_option_id": 11
    }
  ]'
```

**Response includes:**
- Final score (percentage)
- Pass/fail status
- Completion timestamp

### 20. Get my quiz attempts
```bash
curl -X GET $BASE_URL/api/quizzes/1/attempts/me \
  -H "Authorization: Bearer $TOKEN"
```

## Complete Example Workflow

Here's a complete workflow from registration to quiz completion:

```bash
# Setup
export BASE_URL="http://localhost:8080"

# 1. Register as a student
REGISTER_RESPONSE=$(curl -s -X POST $BASE_URL/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newstudent@example.com",
    "password": "password123",
    "first_name": "Alice",
    "last_name": "Johnson",
    "role": "student"
  }')

# Extract token
export TOKEN=$(echo $REGISTER_RESPONSE | jq -r '.token')

# 2. List available courses
curl -s -X GET "$BASE_URL/api/courses?limit=10" | jq

# 3. Enroll in a course (assuming course ID 1 exists)
curl -s -X POST $BASE_URL/api/enrollments \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"course_id": 1}' | jq

# 4. List my enrollments
curl -s -X GET $BASE_URL/api/enrollments/me \
  -H "Authorization: Bearer $TOKEN" | jq

# 5. Start a quiz (assuming quiz ID 1 exists)
ATTEMPT_RESPONSE=$(curl -s -X POST $BASE_URL/api/quizzes/1/attempts \
  -H "Authorization: Bearer $TOKEN")

export ATTEMPT_ID=$(echo $ATTEMPT_RESPONSE | jq -r '.attempt.id')

# 6. Submit answers
curl -s -X POST $BASE_URL/api/quizzes/attempts/$ATTEMPT_ID/submit \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '[
    {"question_id": 1, "selected_option_id": 1},
    {"question_id": 2, "selected_option_id": 5}
  ]' | jq

# 7. View my quiz attempts
curl -s -X GET $BASE_URL/api/quizzes/1/attempts/me \
  -H "Authorization: Bearer $TOKEN" | jq
```

## Testing with HTTPie

If you prefer HTTPie over curl:

```bash
# Register
http POST $BASE_URL/api/auth/register \
  email=student@example.com \
  password=password123 \
  first_name=John \
  last_name=Doe \
  role=student

# Login
http POST $BASE_URL/api/auth/login \
  email=student@example.com \
  password=password123

# Use token
export TOKEN="your-token"
http GET $BASE_URL/api/enrollments/me \
  Authorization:"Bearer $TOKEN"
```

## Error Responses

All endpoints return standard HTTP status codes:

- `200 OK` - Success
- `201 Created` - Resource created successfully
- `400 Bad Request` - Invalid request data
- `401 Unauthorized` - Missing or invalid authentication
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Resource not found
- `409 Conflict` - Resource already exists
- `500 Internal Server Error` - Server error

Error response format:
```json
{
  "error": "Error message here"
}
```

## Notes

- All timestamps are in ISO 8601 format
- All monetary values are decimal numbers
- Pagination uses `limit` and `offset` parameters
- Token expiration is set to 24 hours by default
- Quiz auto-grading only works for multiple choice and true/false questions
- Short answer questions require manual grading (not implemented yet)
