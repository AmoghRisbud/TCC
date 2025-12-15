# TCC LMS Backend Architecture

## Overview

The TCC LMS backend is built using Go with a clean, layered architecture that separates concerns and follows Go best practices.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                         Clients                             │
│  (Next.js Frontend, Mobile Apps, Third-party Integrations)  │
└────────────────────────┬────────────────────────────────────┘
                         │ HTTP/HTTPS
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                      API Gateway                            │
│                   (port 8080/8443)                          │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                      Middleware Layer                        │
│  ┌──────────┐  ┌──────────┐  ┌─────────────────┐          │
│  │  CORS    │  │ Logging  │  │ Authentication  │          │
│  └──────────┘  └──────────┘  └─────────────────┘          │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                      Handler Layer                           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │     Auth     │  │   Courses    │  │ Enrollments  │     │
│  │   Handler    │  │   Handler    │  │   Handler    │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │    Quiz      │  │   Payment    │  │ Certificate  │     │
│  │   Handler    │  │   Handler    │  │   Handler    │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                      Service Layer                           │
│  ┌──────────────────┐  ┌──────────────────┐                │
│  │  Auth Service    │  │  Email Service   │                │
│  │  (JWT + bcrypt)  │  │   (SMTP/SES)     │                │
│  └──────────────────┘  └──────────────────┘                │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                       Model Layer                            │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐            │
│  │   User     │  │  Course    │  │ Enrollment │            │
│  │  Store     │  │   Store    │  │   Store    │            │
│  └────────────┘  └────────────┘  └────────────┘            │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐            │
│  │   Quiz     │  │  Payment   │  │Certificate │            │
│  │  Store     │  │   Store    │  │   Store    │            │
│  └────────────┘  └────────────┘  └────────────┘            │
└────────────────────────┬────────────────────────────────────┘
                         │ SQL Queries
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                    PostgreSQL Database                       │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │  users   │  │ courses  │  │enrollments│ │  quizzes │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │ lessons  │  │ payments │  │certificates│ │ progress │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
└─────────────────────────────────────────────────────────────┘
```

## Component Responsibilities

### 1. Handler Layer (`internal/handlers/`)
- Receives HTTP requests
- Validates input data
- Extracts authentication claims
- Calls appropriate model stores
- Returns HTTP responses
- Error handling

**Files:**
- `auth.go` - User registration, login, profile
- `courses.go` - Course CRUD operations
- `enrollments.go` - Enrollment management
- `quizzes.go` - Quiz creation and attempts

### 2. Middleware Layer (`internal/middleware/`)
- Request/response preprocessing
- Cross-cutting concerns
- Authentication validation
- Request logging

**Files:**
- `auth.go` - JWT validation, role checking
- `cors.go` - CORS headers
- `logging.go` - Request/response logging

### 3. Model Layer (`internal/models/`)
- Database interactions
- Business logic
- Data validation
- CRUD operations

**Files:**
- `user.go` - User management
- `course.go` - Course operations
- `enrollment.go` - Enrollment tracking
- `quiz.go` - Quiz and attempts

### 4. Service Layer (`internal/auth/`, `internal/config/`)
- Reusable business logic
- Third-party integrations
- Authentication services

**Files:**
- `auth/auth.go` - JWT generation/validation, password hashing
- `config/config.go` - Configuration management
- `database/database.go` - Database connection and schema

## Data Flow

### Example: Student Enrolls in a Course

```
1. Client → POST /api/enrollments
   Body: {"course_id": 1}
   Headers: Authorization: Bearer <token>

2. Middleware Layer:
   - CORS: Add CORS headers
   - Logging: Log request details
   - Auth: Validate JWT token, extract user claims

3. Handler Layer (enrollments.go):
   - Parse request body
   - Verify user role (must be student)
   - Check if course exists (via courseStore)
   - Check if course is published
   - Check if already enrolled
   - Check enrollment limits

4. Model Layer (enrollment.go):
   - Create enrollment record in database
   - Return enrollment details

5. Handler Layer:
   - Format response
   - Return 201 Created

6. Middleware Layer:
   - Log response
   - Send response to client
```

## Authentication Flow

```
┌──────────┐          ┌──────────┐          ┌──────────┐
│  Client  │          │   API    │          │ Database │
└────┬─────┘          └────┬─────┘          └────┬─────┘
     │                     │                     │
     │ POST /auth/register │                     │
     ├────────────────────>│                     │
     │                     │ Hash password       │
     │                     │ (bcrypt)            │
     │                     │                     │
     │                     │ INSERT user         │
     │                     ├────────────────────>│
     │                     │                     │
     │                     │ User ID             │
     │                     │<────────────────────┤
     │                     │                     │
     │                     │ Generate JWT        │
     │                     │ (includes user_id,  │
     │                     │  email, role)       │
     │                     │                     │
     │ JWT + User Details  │                     │
     │<────────────────────┤                     │
     │                     │                     │
     │ POST /enrollments   │                     │
     │ (with JWT token)    │                     │
     ├────────────────────>│                     │
     │                     │ Validate JWT        │
     │                     │ Extract claims      │
     │                     │                     │
     │                     │ Process request     │
     │                     │ using user_id       │
     │                     │                     │
```

## Database Schema Relationships

```
users (1) ──────< enrollments >────── (1) courses
  │                    │                      │
  │                    │                      │
  │                    │                      └──< course_modules
  │                    │                              │
  │                    │                              └──< lessons
  │                    │                                      │
  │                    └────< lesson_progress                 └──< quizzes
  │                                                                 │
  │                                                                 ├──< quiz_questions
  │                                                                 │        │
  └──────────────────────────────────────< quiz_attempts          │        └──< quiz_question_options
                                                    │               │
                                                    └──< quiz_answers
```

## Technology Choices

### Why Go?
- **Performance**: Fast execution, efficient memory usage
- **Concurrency**: Built-in goroutines for handling multiple requests
- **Simplicity**: Easy to learn, readable code
- **Standard Library**: Robust HTTP server, database drivers
- **Static Typing**: Catch errors at compile time
- **Deployment**: Single binary, no runtime dependencies

### Why PostgreSQL?
- **ACID Compliance**: Data integrity for financial transactions
- **Relations**: Complex relationships between courses, users, enrollments
- **JSON Support**: Flexible for storing quiz questions and metadata
- **Performance**: Excellent for read-heavy workloads (course listings)
- **Scalability**: Can handle millions of records

### Why JWT?
- **Stateless**: No server-side session storage
- **Scalable**: Works across multiple servers
- **Cross-domain**: Can be used by web and mobile apps
- **Payload**: Contains user info, reducing database lookups

## Security Considerations

### Password Security
- Passwords hashed with bcrypt (cost factor: 10)
- Never store plain text passwords
- Password hash never exposed in API responses

### Authentication
- JWT tokens expire after 24 hours
- Tokens signed with HMAC-SHA256
- Secret key stored in environment variables

### Authorization
- Role-based access control (RBAC)
- Three roles: student, instructor, admin
- Each endpoint checks user role
- Students can only access their own data
- Instructors can access their courses and enrolled students
- Admins have full access

### SQL Injection Prevention
- All queries use prepared statements
- User input never directly interpolated into queries

## Scalability Considerations

### Horizontal Scaling
The API is stateless and can be scaled horizontally:
- Deploy multiple instances behind a load balancer
- No shared state between instances
- JWT tokens work across all instances

### Database Scaling
- Use read replicas for heavy read operations (course listings)
- Use connection pooling (max 25 connections per instance)
- Add database indexes on frequently queried columns

### Caching Strategy (Future)
- Cache course listings (Redis)
- Cache user sessions
- Cache quiz questions
- Invalidate on updates

## Future Enhancements

### Planned Features
1. **Microservices Split**
   - Auth service
   - Course service
   - Quiz service
   - Payment service

2. **Message Queue**
   - RabbitMQ or Kafka for async operations
   - Email notifications
   - Certificate generation
   - Analytics events

3. **File Storage**
   - S3 for course materials
   - CloudFront for video streaming
   - Image optimization

4. **Observability**
   - Prometheus metrics
   - Grafana dashboards
   - Distributed tracing (Jaeger)
   - Error tracking (Sentry)

5. **API Gateway**
   - Rate limiting
   - API versioning
   - Request throttling
   - API documentation (Swagger)

## Development Workflow

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Local     │────>│   Docker    │────>│  Production │
│ Development │     │  Compose    │     │    (AWS)    │
└─────────────┘     └─────────────┘     └─────────────┘
      │                   │                     │
      │                   │                     │
   go run            docker-compose         Kubernetes
   cmd/api/              up                  Deployment
   main.go                                   with Helm
```

## Deployment Architecture (Production)

```
                    ┌──────────────┐
                    │   Route 53   │
                    │     (DNS)    │
                    └──────┬───────┘
                           │
                           ▼
                    ┌──────────────┐
                    │  CloudFront  │
                    │     (CDN)    │
                    └──────┬───────┘
                           │
                           ▼
                    ┌──────────────┐
                    │  API Gateway │
                    │ or ALB/NLB   │
                    └──────┬───────┘
                           │
           ┌───────────────┼───────────────┐
           ▼               ▼               ▼
    ┌──────────┐    ┌──────────┐    ┌──────────┐
    │   ECS    │    │   ECS    │    │   ECS    │
    │ Instance │    │ Instance │    │ Instance │
    │  (Go API)│    │  (Go API)│    │  (Go API)│
    └──────────┘    └──────────┘    └──────────┘
           │               │               │
           └───────────────┼───────────────┘
                           │
                           ▼
                    ┌──────────────┐
                    │     RDS      │
                    │  PostgreSQL  │
                    │  (Multi-AZ)  │
                    └──────────────┘
```

## Monitoring & Logging

### Application Logs
- Request/response logging
- Error tracking
- Performance metrics

### Infrastructure Logs
- Database query performance
- Connection pool stats
- Memory/CPU usage

### Alerts
- High error rates
- Slow response times
- Database connection issues
- Memory/CPU thresholds

## Contributing Guidelines

When adding new features:

1. **Create a new model** in `internal/models/`
2. **Add handler** in `internal/handlers/`
3. **Register routes** in `cmd/api/main.go`
4. **Update database schema** in `internal/database/database.go`
5. **Add tests** (unit and integration)
6. **Update API documentation** in README.md and API_EXAMPLES.md
7. **Add migration scripts** if schema changes

## Contact

For architecture questions or suggestions, please open an issue on the GitHub repository.
