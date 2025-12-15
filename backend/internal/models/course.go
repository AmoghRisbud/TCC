package models

import (
	"database/sql"
	"time"
)

// Course represents a course in the LMS
type Course struct {
	ID               int       `json:"id"`
	Title            string    `json:"title"`
	Slug             string    `json:"slug"`
	Description      *string   `json:"description,omitempty"`
	ShortDescription *string   `json:"short_description,omitempty"`
	ThumbnailURL     *string   `json:"thumbnail_url,omitempty"`
	InstructorID     *int      `json:"instructor_id,omitempty"`
	Category         *string   `json:"category,omitempty"`
	Level            *string   `json:"level,omitempty"` // beginner, intermediate, advanced
	Price            float64   `json:"price"`
	Currency         string    `json:"currency"`
	IsPublished      bool      `json:"is_published"`
	EnrollmentLimit  *int      `json:"enrollment_limit,omitempty"`
	DurationHours    *int      `json:"duration_hours,omitempty"`
	CreatedAt        time.Time `json:"created_at"`
	UpdatedAt        time.Time `json:"updated_at"`
}

// CourseModule represents a section/module within a course
type CourseModule struct {
	ID          int       `json:"id"`
	CourseID    int       `json:"course_id"`
	Title       string    `json:"title"`
	Description *string   `json:"description,omitempty"`
	OrderIndex  int       `json:"order_index"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}

// Lesson represents a lesson within a module
type Lesson struct {
	ID              int       `json:"id"`
	ModuleID        int       `json:"module_id"`
	Title           string    `json:"title"`
	Content         *string   `json:"content,omitempty"`
	VideoURL        *string   `json:"video_url,omitempty"`
	DurationMinutes *int      `json:"duration_minutes,omitempty"`
	OrderIndex      int       `json:"order_index"`
	IsPreview       bool      `json:"is_preview"`
	CreatedAt       time.Time `json:"created_at"`
	UpdatedAt       time.Time `json:"updated_at"`
}

// CourseStore provides database operations for courses
type CourseStore struct {
	db *sql.DB
}

// NewCourseStore creates a new CourseStore
func NewCourseStore(db *sql.DB) *CourseStore {
	return &CourseStore{db: db}
}

// Create creates a new course
func (s *CourseStore) Create(course *Course) error {
	query := `
		INSERT INTO courses (title, slug, description, short_description, thumbnail_url, 
		                     instructor_id, category, level, price, currency, is_published,
		                     enrollment_limit, duration_hours)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
		RETURNING id, created_at, updated_at
	`
	return s.db.QueryRow(
		query,
		course.Title,
		course.Slug,
		course.Description,
		course.ShortDescription,
		course.ThumbnailURL,
		course.InstructorID,
		course.Category,
		course.Level,
		course.Price,
		course.Currency,
		course.IsPublished,
		course.EnrollmentLimit,
		course.DurationHours,
	).Scan(&course.ID, &course.CreatedAt, &course.UpdatedAt)
}

// GetByID retrieves a course by ID
func (s *CourseStore) GetByID(id int) (*Course, error) {
	course := &Course{}
	query := `
		SELECT id, title, slug, description, short_description, thumbnail_url,
		       instructor_id, category, level, price, currency, is_published,
		       enrollment_limit, duration_hours, created_at, updated_at
		FROM courses WHERE id = $1
	`
	err := s.db.QueryRow(query, id).Scan(
		&course.ID,
		&course.Title,
		&course.Slug,
		&course.Description,
		&course.ShortDescription,
		&course.ThumbnailURL,
		&course.InstructorID,
		&course.Category,
		&course.Level,
		&course.Price,
		&course.Currency,
		&course.IsPublished,
		&course.EnrollmentLimit,
		&course.DurationHours,
		&course.CreatedAt,
		&course.UpdatedAt,
	)
	if err != nil {
		return nil, err
	}
	return course, nil
}

// GetBySlug retrieves a course by slug
func (s *CourseStore) GetBySlug(slug string) (*Course, error) {
	course := &Course{}
	query := `
		SELECT id, title, slug, description, short_description, thumbnail_url,
		       instructor_id, category, level, price, currency, is_published,
		       enrollment_limit, duration_hours, created_at, updated_at
		FROM courses WHERE slug = $1
	`
	err := s.db.QueryRow(query, slug).Scan(
		&course.ID,
		&course.Title,
		&course.Slug,
		&course.Description,
		&course.ShortDescription,
		&course.ThumbnailURL,
		&course.InstructorID,
		&course.Category,
		&course.Level,
		&course.Price,
		&course.Currency,
		&course.IsPublished,
		&course.EnrollmentLimit,
		&course.DurationHours,
		&course.CreatedAt,
		&course.UpdatedAt,
	)
	if err != nil {
		return nil, err
	}
	return course, nil
}

// List retrieves courses with optional filtering
func (s *CourseStore) List(category, level string, instructorID *int, limit, offset int) ([]*Course, error) {
	query := `
		SELECT id, title, slug, description, short_description, thumbnail_url,
		       instructor_id, category, level, price, currency, is_published,
		       enrollment_limit, duration_hours, created_at, updated_at
		FROM courses WHERE is_published = true
	`
	var args []interface{}
	argPos := 1

	if category != "" {
		query += ` AND category = $` + string(rune(argPos+'0'))
		args = append(args, category)
		argPos++
	}

	if level != "" {
		query += ` AND level = $` + string(rune(argPos+'0'))
		args = append(args, level)
		argPos++
	}

	if instructorID != nil {
		query += ` AND instructor_id = $` + string(rune(argPos+'0'))
		args = append(args, *instructorID)
		argPos++
	}

	query += ` ORDER BY created_at DESC LIMIT $` + string(rune(argPos+'0')) + ` OFFSET $` + string(rune(argPos+1+'0'))
	args = append(args, limit, offset)

	rows, err := s.db.Query(query, args...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var courses []*Course
	for rows.Next() {
		course := &Course{}
		err := rows.Scan(
			&course.ID,
			&course.Title,
			&course.Slug,
			&course.Description,
			&course.ShortDescription,
			&course.ThumbnailURL,
			&course.InstructorID,
			&course.Category,
			&course.Level,
			&course.Price,
			&course.Currency,
			&course.IsPublished,
			&course.EnrollmentLimit,
			&course.DurationHours,
			&course.CreatedAt,
			&course.UpdatedAt,
		)
		if err != nil {
			return nil, err
		}
		courses = append(courses, course)
	}

	return courses, nil
}

// Update updates a course
func (s *CourseStore) Update(course *Course) error {
	query := `
		UPDATE courses 
		SET title = $1, description = $2, short_description = $3, thumbnail_url = $4,
		    category = $5, level = $6, price = $7, is_published = $8,
		    enrollment_limit = $9, duration_hours = $10, updated_at = CURRENT_TIMESTAMP
		WHERE id = $11
		RETURNING updated_at
	`
	return s.db.QueryRow(
		query,
		course.Title,
		course.Description,
		course.ShortDescription,
		course.ThumbnailURL,
		course.Category,
		course.Level,
		course.Price,
		course.IsPublished,
		course.EnrollmentLimit,
		course.DurationHours,
		course.ID,
	).Scan(&course.UpdatedAt)
}

// Delete deletes a course
func (s *CourseStore) Delete(id int) error {
	query := `DELETE FROM courses WHERE id = $1`
	_, err := s.db.Exec(query, id)
	return err
}
