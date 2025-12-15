# Quick Start Guide - TCC LMS Backend

This guide will help you get the TCC LMS backend up and running in minutes.

## Prerequisites

- Docker and Docker Compose (recommended for quick setup)
- OR Go 1.21+ and PostgreSQL 13+ (for manual setup)

## Option 1: Docker Compose (Recommended)

The easiest way to get started is using Docker Compose, which will set up both the API server and PostgreSQL database.

### 1. Clone the repository

```bash
git clone https://github.com/AmoghRisbud/TCC.git
cd TCC/backend
```

### 2. Start the services

```bash
docker-compose up -d
```

This will:
- Start a PostgreSQL database on port 5432
- Build and start the API server on port 8080
- Initialize the database schema automatically

### 3. Verify it's running

```bash
curl http://localhost:8080/health
```

You should see: `OK`

### 4. Test the API

Register a new user:
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "student@example.com",
    "password": "password123",
    "first_name": "John",
    "last_name": "Doe",
    "role": "student"
  }'
```

Login:
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "student@example.com",
    "password": "password123"
  }'
```

Save the token from the response and use it for authenticated requests:
```bash
TOKEN="<your-token-here>"

curl http://localhost:8080/api/auth/me \
  -H "Authorization: Bearer $TOKEN"
```

### 5. View logs

```bash
docker-compose logs -f api
```

### 6. Stop the services

```bash
docker-compose down
```

To remove the database volume as well:
```bash
docker-compose down -v
```

## Option 2: Manual Setup

If you prefer to run the services manually:

### 1. Setup PostgreSQL

Create a database:
```sql
CREATE DATABASE tcc_lms;
```

### 2. Configure environment

```bash
cp .env.example .env
# Edit .env with your database credentials
```

### 3. Install dependencies

```bash
go mod download
```

### 4. Run the server

```bash
go run cmd/api/main.go
```

Or build first:
```bash
make build
./bin/api
```

## Next Steps

1. **Explore the API**: Check out the [README.md](README.md) for full API documentation
2. **Create test data**: Use the API endpoints to create courses, users, etc.
3. **Integrate with frontend**: Update the Next.js frontend to consume this API
4. **Deploy**: Deploy to your cloud provider of choice

## Useful Commands

### Using Make

```bash
make help          # Show all available commands
make build         # Build the application
make run           # Run the application
make test          # Run tests
make clean         # Clean build artifacts
make docker-build  # Build Docker image
```

### Docker Compose

```bash
docker-compose up          # Start services (foreground)
docker-compose up -d       # Start services (background)
docker-compose down        # Stop services
docker-compose logs -f api # View API logs
docker-compose ps          # View running services
docker-compose restart api # Restart API service
```

## Troubleshooting

### Port already in use

If port 8080 or 5432 is already in use, you can change it in `docker-compose.yml`:

```yaml
services:
  postgres:
    ports:
      - "5433:5432"  # Change 5432 to 5433
  api:
    ports:
      - "8081:8080"  # Change 8080 to 8081
```

### Database connection issues

Make sure PostgreSQL is running and accessible. Check the connection string in your `.env` file or environment variables.

### Permission denied

If you get permission errors with Docker, make sure your user is in the docker group:
```bash
sudo usermod -aG docker $USER
```

Log out and back in for the changes to take effect.

## Development Tips

1. **Auto-reload**: Install `air` for automatic reloading during development:
   ```bash
   go install github.com/cosmtrek/air@latest
   air
   ```

2. **Database GUI**: Use tools like pgAdmin or DBeaver to inspect the database

3. **API Testing**: Use Postman, Insomnia, or curl to test the endpoints

4. **Code formatting**: Run `make fmt` before committing code

## Support

For issues or questions, please open an issue on the GitHub repository.
