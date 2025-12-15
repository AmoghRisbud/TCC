package database

import (
	"database/sql"
	"fmt"
	"log"
	"time"

	"github.com/AmoghRisbud/TCC/backend/internal/config"
	_ "github.com/lib/pq"
)

// DB wraps the database connection
type DB struct {
	*sql.DB
}

// New creates a new database connection
func New(cfg *config.DatabaseConfig) (*DB, error) {
	dsn := fmt.Sprintf(
		"host=%s port=%d user=%s password=%s dbname=%s sslmode=%s",
		cfg.Host, cfg.Port, cfg.User, cfg.Password, cfg.DBName, cfg.SSLMode,
	)

	db, err := sql.Open("postgres", dsn)
	if err != nil {
		return nil, fmt.Errorf("error opening database: %w", err)
	}

	// Set connection pool settings
	db.SetMaxOpenConns(25)
	db.SetMaxIdleConns(5)
	db.SetConnMaxLifetime(5 * time.Minute)

	// Test the connection
	if err := db.Ping(); err != nil {
		return nil, fmt.Errorf("error connecting to database: %w", err)
	}

	log.Println("Database connection established")

	return &DB{db}, nil
}

// InitSchema creates the database schema if it doesn't exist
func (db *DB) InitSchema() error {
	schema := `
	-- Users table
	CREATE TABLE IF NOT EXISTS users (
		id SERIAL PRIMARY KEY,
		email VARCHAR(255) UNIQUE NOT NULL,
		password_hash VARCHAR(255) NOT NULL,
		first_name VARCHAR(100) NOT NULL,
		last_name VARCHAR(100) NOT NULL,
		role VARCHAR(20) NOT NULL CHECK (role IN ('student', 'instructor', 'admin')),
		avatar_url VARCHAR(500),
		bio TEXT,
		is_active BOOLEAN DEFAULT true,
		created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
		updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
	);

	-- Courses table
	CREATE TABLE IF NOT EXISTS courses (
		id SERIAL PRIMARY KEY,
		title VARCHAR(255) NOT NULL,
		slug VARCHAR(255) UNIQUE NOT NULL,
		description TEXT,
		short_description VARCHAR(500),
		thumbnail_url VARCHAR(500),
		instructor_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
		category VARCHAR(100),
		level VARCHAR(20) CHECK (level IN ('beginner', 'intermediate', 'advanced')),
		price DECIMAL(10, 2) DEFAULT 0,
		currency VARCHAR(3) DEFAULT 'USD',
		is_published BOOLEAN DEFAULT false,
		enrollment_limit INTEGER,
		duration_hours INTEGER,
		created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
		updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
	);

	-- Course modules/sections
	CREATE TABLE IF NOT EXISTS course_modules (
		id SERIAL PRIMARY KEY,
		course_id INTEGER REFERENCES courses(id) ON DELETE CASCADE,
		title VARCHAR(255) NOT NULL,
		description TEXT,
		order_index INTEGER NOT NULL,
		created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
		updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
	);

	-- Lessons
	CREATE TABLE IF NOT EXISTS lessons (
		id SERIAL PRIMARY KEY,
		module_id INTEGER REFERENCES course_modules(id) ON DELETE CASCADE,
		title VARCHAR(255) NOT NULL,
		content TEXT,
		video_url VARCHAR(500),
		duration_minutes INTEGER,
		order_index INTEGER NOT NULL,
		is_preview BOOLEAN DEFAULT false,
		created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
		updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
	);

	-- Enrollments
	CREATE TABLE IF NOT EXISTS enrollments (
		id SERIAL PRIMARY KEY,
		user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
		course_id INTEGER REFERENCES courses(id) ON DELETE CASCADE,
		enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
		completed_at TIMESTAMP,
		progress DECIMAL(5, 2) DEFAULT 0,
		status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'completed', 'dropped')),
		UNIQUE(user_id, course_id)
	);

	-- Lesson progress
	CREATE TABLE IF NOT EXISTS lesson_progress (
		id SERIAL PRIMARY KEY,
		user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
		lesson_id INTEGER REFERENCES lessons(id) ON DELETE CASCADE,
		completed BOOLEAN DEFAULT false,
		completed_at TIMESTAMP,
		last_position INTEGER DEFAULT 0,
		UNIQUE(user_id, lesson_id)
	);

	-- Quizzes
	CREATE TABLE IF NOT EXISTS quizzes (
		id SERIAL PRIMARY KEY,
		lesson_id INTEGER REFERENCES lessons(id) ON DELETE CASCADE,
		title VARCHAR(255) NOT NULL,
		description TEXT,
		passing_score INTEGER DEFAULT 70,
		time_limit_minutes INTEGER,
		max_attempts INTEGER,
		created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
		updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
	);

	-- Quiz questions
	CREATE TABLE IF NOT EXISTS quiz_questions (
		id SERIAL PRIMARY KEY,
		quiz_id INTEGER REFERENCES quizzes(id) ON DELETE CASCADE,
		question_text TEXT NOT NULL,
		question_type VARCHAR(20) CHECK (question_type IN ('multiple_choice', 'true_false', 'short_answer')),
		points INTEGER DEFAULT 1,
		order_index INTEGER NOT NULL,
		created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
	);

	-- Quiz question options (for multiple choice)
	CREATE TABLE IF NOT EXISTS quiz_question_options (
		id SERIAL PRIMARY KEY,
		question_id INTEGER REFERENCES quiz_questions(id) ON DELETE CASCADE,
		option_text TEXT NOT NULL,
		is_correct BOOLEAN DEFAULT false,
		order_index INTEGER NOT NULL
	);

	-- Quiz attempts
	CREATE TABLE IF NOT EXISTS quiz_attempts (
		id SERIAL PRIMARY KEY,
		user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
		quiz_id INTEGER REFERENCES quizzes(id) ON DELETE CASCADE,
		score DECIMAL(5, 2),
		passed BOOLEAN,
		started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
		completed_at TIMESTAMP,
		attempt_number INTEGER NOT NULL
	);

	-- Quiz answers
	CREATE TABLE IF NOT EXISTS quiz_answers (
		id SERIAL PRIMARY KEY,
		attempt_id INTEGER REFERENCES quiz_attempts(id) ON DELETE CASCADE,
		question_id INTEGER REFERENCES quiz_questions(id) ON DELETE CASCADE,
		selected_option_id INTEGER REFERENCES quiz_question_options(id) ON DELETE SET NULL,
		answer_text TEXT,
		is_correct BOOLEAN,
		points_earned DECIMAL(5, 2) DEFAULT 0
	);

	-- Certificates
	CREATE TABLE IF NOT EXISTS certificates (
		id SERIAL PRIMARY KEY,
		user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
		course_id INTEGER REFERENCES courses(id) ON DELETE CASCADE,
		certificate_url VARCHAR(500),
		issued_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
		certificate_id VARCHAR(100) UNIQUE NOT NULL,
		UNIQUE(user_id, course_id)
	);

	-- Payments
	CREATE TABLE IF NOT EXISTS payments (
		id SERIAL PRIMARY KEY,
		user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
		course_id INTEGER REFERENCES courses(id) ON DELETE CASCADE,
		amount DECIMAL(10, 2) NOT NULL,
		currency VARCHAR(3) DEFAULT 'USD',
		status VARCHAR(20) CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
		payment_method VARCHAR(50),
		transaction_id VARCHAR(255) UNIQUE,
		created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
		updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
	);

	-- Create indexes for better performance
	CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
	CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
	CREATE INDEX IF NOT EXISTS idx_courses_slug ON courses(slug);
	CREATE INDEX IF NOT EXISTS idx_courses_instructor ON courses(instructor_id);
	CREATE INDEX IF NOT EXISTS idx_enrollments_user ON enrollments(user_id);
	CREATE INDEX IF NOT EXISTS idx_enrollments_course ON enrollments(course_id);
	CREATE INDEX IF NOT EXISTS idx_lesson_progress_user ON lesson_progress(user_id);
	CREATE INDEX IF NOT EXISTS idx_payments_user ON payments(user_id);
	CREATE INDEX IF NOT EXISTS idx_payments_transaction ON payments(transaction_id);
	`

	_, err := db.Exec(schema)
	if err != nil {
		return fmt.Errorf("error initializing schema: %w", err)
	}

	log.Println("Database schema initialized successfully")
	return nil
}
