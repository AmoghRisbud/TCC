package models

import (
	"database/sql"
	"time"
)

// Enrollment represents a student's enrollment in a course
type Enrollment struct {
	ID          int        `json:"id"`
	UserID      int        `json:"user_id"`
	CourseID    int        `json:"course_id"`
	EnrolledAt  time.Time  `json:"enrolled_at"`
	CompletedAt *time.Time `json:"completed_at,omitempty"`
	Progress    float64    `json:"progress"`
	Status      string     `json:"status"` // active, completed, dropped
}

// EnrollmentWithDetails includes user and course information
type EnrollmentWithDetails struct {
	Enrollment
	CourseName   string `json:"course_name"`
	CourseSlug   string `json:"course_slug"`
	StudentName  string `json:"student_name"`
	StudentEmail string `json:"student_email"`
}

// EnrollmentStore provides database operations for enrollments
type EnrollmentStore struct {
	db *sql.DB
}

// NewEnrollmentStore creates a new EnrollmentStore
func NewEnrollmentStore(db *sql.DB) *EnrollmentStore {
	return &EnrollmentStore{db: db}
}

// Create creates a new enrollment
func (s *EnrollmentStore) Create(enrollment *Enrollment) error {
	query := `
		INSERT INTO enrollments (user_id, course_id, status)
		VALUES ($1, $2, $3)
		RETURNING id, enrolled_at, progress
	`
	return s.db.QueryRow(
		query,
		enrollment.UserID,
		enrollment.CourseID,
		"active",
	).Scan(&enrollment.ID, &enrollment.EnrolledAt, &enrollment.Progress)
}

// GetByID retrieves an enrollment by ID
func (s *EnrollmentStore) GetByID(id int) (*Enrollment, error) {
	enrollment := &Enrollment{}
	query := `
		SELECT id, user_id, course_id, enrolled_at, completed_at, progress, status
		FROM enrollments WHERE id = $1
	`
	err := s.db.QueryRow(query, id).Scan(
		&enrollment.ID,
		&enrollment.UserID,
		&enrollment.CourseID,
		&enrollment.EnrolledAt,
		&enrollment.CompletedAt,
		&enrollment.Progress,
		&enrollment.Status,
	)
	if err != nil {
		return nil, err
	}
	return enrollment, nil
}

// GetByUserAndCourse retrieves an enrollment by user and course
func (s *EnrollmentStore) GetByUserAndCourse(userID, courseID int) (*Enrollment, error) {
	enrollment := &Enrollment{}
	query := `
		SELECT id, user_id, course_id, enrolled_at, completed_at, progress, status
		FROM enrollments WHERE user_id = $1 AND course_id = $2
	`
	err := s.db.QueryRow(query, userID, courseID).Scan(
		&enrollment.ID,
		&enrollment.UserID,
		&enrollment.CourseID,
		&enrollment.EnrolledAt,
		&enrollment.CompletedAt,
		&enrollment.Progress,
		&enrollment.Status,
	)
	if err != nil {
		return nil, err
	}
	return enrollment, nil
}

// ListByUser retrieves all enrollments for a user
func (s *EnrollmentStore) ListByUser(userID int, status string, limit, offset int) ([]*EnrollmentWithDetails, error) {
	query := `
		SELECT e.id, e.user_id, e.course_id, e.enrolled_at, e.completed_at, e.progress, e.status,
		       c.title, c.slug
		FROM enrollments e
		JOIN courses c ON e.course_id = c.id
		WHERE e.user_id = $1
	`
	var args []interface{}
	args = append(args, userID)
	argPos := 2

	if status != "" {
		query += ` AND e.status = $` + string(rune(argPos+'0'))
		args = append(args, status)
		argPos++
	}

	query += ` ORDER BY e.enrolled_at DESC LIMIT $` + string(rune(argPos+'0')) + ` OFFSET $` + string(rune(argPos+1+'0'))
	args = append(args, limit, offset)

	rows, err := s.db.Query(query, args...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var enrollments []*EnrollmentWithDetails
	for rows.Next() {
		e := &EnrollmentWithDetails{}
		err := rows.Scan(
			&e.ID,
			&e.UserID,
			&e.CourseID,
			&e.EnrolledAt,
			&e.CompletedAt,
			&e.Progress,
			&e.Status,
			&e.CourseName,
			&e.CourseSlug,
		)
		if err != nil {
			return nil, err
		}
		enrollments = append(enrollments, e)
	}

	return enrollments, nil
}

// ListByCourse retrieves all enrollments for a course
func (s *EnrollmentStore) ListByCourse(courseID int, status string, limit, offset int) ([]*EnrollmentWithDetails, error) {
	query := `
		SELECT e.id, e.user_id, e.course_id, e.enrolled_at, e.completed_at, e.progress, e.status,
		       u.first_name || ' ' || u.last_name as student_name, u.email
		FROM enrollments e
		JOIN users u ON e.user_id = u.id
		WHERE e.course_id = $1
	`
	var args []interface{}
	args = append(args, courseID)
	argPos := 2

	if status != "" {
		query += ` AND e.status = $` + string(rune(argPos+'0'))
		args = append(args, status)
		argPos++
	}

	query += ` ORDER BY e.enrolled_at DESC LIMIT $` + string(rune(argPos+'0')) + ` OFFSET $` + string(rune(argPos+1+'0'))
	args = append(args, limit, offset)

	rows, err := s.db.Query(query, args...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var enrollments []*EnrollmentWithDetails
	for rows.Next() {
		e := &EnrollmentWithDetails{}
		err := rows.Scan(
			&e.ID,
			&e.UserID,
			&e.CourseID,
			&e.EnrolledAt,
			&e.CompletedAt,
			&e.Progress,
			&e.Status,
			&e.StudentName,
			&e.StudentEmail,
		)
		if err != nil {
			return nil, err
		}
		enrollments = append(enrollments, e)
	}

	return enrollments, nil
}

// UpdateProgress updates the progress of an enrollment
func (s *EnrollmentStore) UpdateProgress(enrollmentID int, progress float64) error {
	query := `
		UPDATE enrollments 
		SET progress = $1
		WHERE id = $2
	`
	_, err := s.db.Exec(query, progress, enrollmentID)
	return err
}

// Complete marks an enrollment as completed
func (s *EnrollmentStore) Complete(enrollmentID int) error {
	query := `
		UPDATE enrollments 
		SET status = 'completed', completed_at = CURRENT_TIMESTAMP, progress = 100
		WHERE id = $1
	`
	_, err := s.db.Exec(query, enrollmentID)
	return err
}

// GetEnrollmentCount returns the count of enrollments for a course
func (s *EnrollmentStore) GetEnrollmentCount(courseID int) (int, error) {
	var count int
	query := `SELECT COUNT(*) FROM enrollments WHERE course_id = $1 AND status = 'active'`
	err := s.db.QueryRow(query, courseID).Scan(&count)
	return count, err
}
