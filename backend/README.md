# TCC Learning Management System - Backend API

A Go-based RESTful API for the Learning Management System (LMS) built for The Collective Counsel.

## Features

### Phase 1 - Core Infrastructure ✅
- [x] Go backend directory structure
- [x] Database schema (PostgreSQL)
- [x] Basic API server with routing
- [x] Configuration management
- [x] Logging and middleware (CORS, Auth, Logging)

### Phase 2 - Authentication & User Management ✅
- [x] JWT-based authentication
- [x] User registration and login endpoints
- [x] Role-based access control (Student, Instructor, Admin)
- [x] User profile management

### Phase 3 - Course Management ✅
- [x] Course CRUD operations
- [x] Course listing with filtering (by category, level, instructor)
- [x] Course modules and lessons structure

### Phase 4 - Enrollment & Learning Features ✅
- [x] Course enrollment system
- [x] Student enrollment tracking
- [x] Enrollment listing for students and instructors
- [x] Quiz/assessment system with auto-grading
- [x] Multiple choice and true/false questions
- [x] Quiz attempts with scoring
- [x] Progress tracking framework

### Upcoming Features
- [ ] Lesson progress tracking implementation
- [ ] Student and instructor dashboards
- [ ] Certificate generation
- [ ] Payment integration
- [ ] Email notifications
- [ ] File storage integration

## Technology Stack

- **Language**: Go 1.21+
- **Database**: PostgreSQL
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcrypt
- **API Style**: RESTful

## Prerequisites

- Go 1.21 or higher
- PostgreSQL 13+
- Make (optional, for running make commands)

## Getting Started

### 1. Install Dependencies

```bash
cd backend
go mod download
```

### 2. Setup Database

Create a PostgreSQL database:

```sql
CREATE DATABASE tcc_lms;
```

### 3. Configure Environment

Copy `.env.example` to `.env` and update the values:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
# Server
SERVER_PORT=8080
ENV=development

# Database
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=tcc_lms
DB_SSL_MODE=disable

# JWT
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRATION=24

# Email (for future features)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
EMAIL_FROM=noreply@tcc.com
EMAIL_PASSWORD=

# Storage
STORAGE_TYPE=local
STORAGE_LOCAL_PATH=./uploads
```

### 4. Run the Server

```bash
go run cmd/api/main.go
```

The server will start on `http://localhost:8080`.

### 5. Test the API

Health check:
```bash
curl http://localhost:8080/health
```

## API Endpoints

### Authentication

#### Register a new user
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "student@example.com",
  "password": "securepassword",
  "first_name": "John",
  "last_name": "Doe",
  "role": "student"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "student@example.com",
  "password": "securepassword"
}
```

Response:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "student@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "role": "student",
    "is_active": true
  }
}
```

#### Get current user
```http
GET /api/auth/me
Authorization: Bearer <token>
```

### Courses

#### List courses
```http
GET /api/courses?category=programming&level=beginner&limit=20&offset=0
```

#### Get course by ID or slug
```http
GET /api/courses/1
GET /api/courses/intro-to-go
```

#### Create course (Instructor/Admin only)
```http
POST /api/courses/create
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Introduction to Go Programming",
  "slug": "intro-to-go",
  "short_description": "Learn Go from scratch",
  "description": "A comprehensive course on Go programming...",
  "category": "programming",
  "level": "beginner",
  "price": 49.99,
  "currency": "USD",
  "is_published": true,
  "duration_hours": 20
}
```

#### Update course (Instructor/Admin only)
```http
PUT /api/courses/1
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Updated Course Title",
  "price": 59.99
}
```

#### Delete course (Admin only)
```http
DELETE /api/courses/1
Authorization: Bearer <token>
```

### Enrollments

#### Enroll in a course (Student only)
```http
POST /api/enrollments
Authorization: Bearer <token>
Content-Type: application/json

{
  "course_id": 1
}
```

#### List my enrollments
```http
GET /api/enrollments/me?status=active&limit=20&offset=0
Authorization: Bearer <token>
```

#### Get enrollment by ID
```http
GET /api/enrollments/1
Authorization: Bearer <token>
```

#### List course enrollments (Instructor/Admin only)
```http
GET /api/courses/1/enrollments?status=active&limit=50&offset=0
Authorization: Bearer <token>
```

### Quizzes

#### Create quiz (Instructor/Admin only)
```http
POST /api/quizzes
Authorization: Bearer <token>
Content-Type: application/json

{
  "lesson_id": 1,
  "title": "Module 1 Quiz",
  "description": "Test your knowledge",
  "passing_score": 70,
  "time_limit_minutes": 30,
  "max_attempts": 3
}
```

#### Get quiz
```http
GET /api/quizzes/1
Authorization: Bearer <token>
```

#### Start quiz attempt
```http
POST /api/quizzes/1/attempts
Authorization: Bearer <token>
```

Response includes attempt details and quiz questions with options.

#### Submit quiz answers
```http
POST /api/quizzes/attempts/1/submit
Authorization: Bearer <token>
Content-Type: application/json

[
  {
    "question_id": 1,
    "selected_option_id": 3
  },
  {
    "question_id": 2,
    "selected_option_id": 7
  }
]
```

Returns the graded attempt with score and pass/fail status.

#### Get my quiz attempts
```http
GET /api/quizzes/1/attempts/me
Authorization: Bearer <token>
```

## Database Schema

The database includes the following tables:

- **users**: User accounts with roles (student, instructor, admin)
- **courses**: Course information and metadata
- **course_modules**: Course sections/modules
- **lessons**: Individual lessons within modules
- **enrollments**: Student course enrollments
- **lesson_progress**: Student progress tracking
- **quizzes**: Quiz/assessment information
- **quiz_questions**: Quiz questions
- **quiz_question_options**: Multiple choice options
- **quiz_attempts**: Student quiz attempts
- **quiz_answers**: Student quiz answers
- **certificates**: Course completion certificates
- **payments**: Payment records

## Project Structure

```
backend/
├── cmd/
│   └── api/
│       └── main.go              # Application entry point
├── internal/
│   ├── auth/
│   │   └── auth.go              # Authentication service
│   ├── config/
│   │   └── config.go            # Configuration management
│   ├── database/
│   │   └── database.go          # Database connection and schema
│   ├── handlers/
│   │   ├── auth.go              # Authentication handlers
│   │   ├── courses.go           # Course handlers
│   │   ├── enrollments.go       # Enrollment handlers
│   │   └── quizzes.go           # Quiz handlers
│   ├── middleware/
│   │   ├── auth.go              # Auth middleware
│   │   ├── cors.go              # CORS middleware
│   │   └── logging.go           # Logging middleware
│   └── models/
│       ├── user.go              # User model and store
│       ├── course.go            # Course model and store
│       ├── enrollment.go        # Enrollment model and store
│       └── quiz.go              # Quiz model and store
├── pkg/
│   ├── errors/                  # Custom error types
│   └── types/                   # Shared types
├── go.mod
├── go.sum
└── README.md
```

## Development

### Running Tests

```bash
go test ./...
```

### Building

```bash
go build -o bin/api cmd/api/main.go
```

### Running with Docker

```bash
docker build -t tcc-lms-api .
docker run -p 8080:8080 --env-file .env tcc-lms-api
```

## Security Considerations

- All passwords are hashed using bcrypt
- JWT tokens for stateless authentication
- Role-based access control (RBAC)
- SQL injection prevention using prepared statements
- CORS enabled for cross-origin requests

## Future Enhancements

1. **Enrollment System**: Allow students to enroll in courses
2. **Quiz Engine**: Auto-graded quizzes with multiple question types
3. **Progress Tracking**: Detailed student progress analytics
4. **Certificate Generation**: PDF certificate generation on course completion
5. **Payment Integration**: Stripe/Razorpay for course payments
6. **Email Notifications**: Account verification, course updates, etc.
7. **File Upload**: Support for course materials, assignments
8. **Video Streaming**: Integration with video platforms
9. **Discussion Forums**: Course-specific discussion boards
10. **Analytics Dashboard**: Comprehensive analytics for instructors and admins

## Contributing

This is an internal project for The Collective Counsel. Please follow the established coding standards and submit pull requests for review.

## License

Internal project. No license header added.
