package models

import (
	"database/sql"
	"time"
)

// User represents a user in the system
type User struct {
	ID           int       `json:"id"`
	Email        string    `json:"email"`
	PasswordHash string    `json:"-"` // Never expose password hash in JSON
	FirstName    string    `json:"first_name"`
	LastName     string    `json:"last_name"`
	Role         string    `json:"role"` // student, instructor, admin
	AvatarURL    *string   `json:"avatar_url,omitempty"`
	Bio          *string   `json:"bio,omitempty"`
	IsActive     bool      `json:"is_active"`
	CreatedAt    time.Time `json:"created_at"`
	UpdatedAt    time.Time `json:"updated_at"`
}

// UserStore provides database operations for users
type UserStore struct {
	db *sql.DB
}

// NewUserStore creates a new UserStore
func NewUserStore(db *sql.DB) *UserStore {
	return &UserStore{db: db}
}

// Create creates a new user
func (s *UserStore) Create(user *User) error {
	query := `
		INSERT INTO users (email, password_hash, first_name, last_name, role, avatar_url, bio)
		VALUES ($1, $2, $3, $4, $5, $6, $7)
		RETURNING id, created_at, updated_at
	`
	return s.db.QueryRow(
		query,
		user.Email,
		user.PasswordHash,
		user.FirstName,
		user.LastName,
		user.Role,
		user.AvatarURL,
		user.Bio,
	).Scan(&user.ID, &user.CreatedAt, &user.UpdatedAt)
}

// GetByID retrieves a user by ID
func (s *UserStore) GetByID(id int) (*User, error) {
	user := &User{}
	query := `
		SELECT id, email, password_hash, first_name, last_name, role, 
		       avatar_url, bio, is_active, created_at, updated_at
		FROM users WHERE id = $1
	`
	err := s.db.QueryRow(query, id).Scan(
		&user.ID,
		&user.Email,
		&user.PasswordHash,
		&user.FirstName,
		&user.LastName,
		&user.Role,
		&user.AvatarURL,
		&user.Bio,
		&user.IsActive,
		&user.CreatedAt,
		&user.UpdatedAt,
	)
	if err != nil {
		return nil, err
	}
	return user, nil
}

// GetByEmail retrieves a user by email
func (s *UserStore) GetByEmail(email string) (*User, error) {
	user := &User{}
	query := `
		SELECT id, email, password_hash, first_name, last_name, role, 
		       avatar_url, bio, is_active, created_at, updated_at
		FROM users WHERE email = $1
	`
	err := s.db.QueryRow(query, email).Scan(
		&user.ID,
		&user.Email,
		&user.PasswordHash,
		&user.FirstName,
		&user.LastName,
		&user.Role,
		&user.AvatarURL,
		&user.Bio,
		&user.IsActive,
		&user.CreatedAt,
		&user.UpdatedAt,
	)
	if err != nil {
		return nil, err
	}
	return user, nil
}

// Update updates a user's information
func (s *UserStore) Update(user *User) error {
	query := `
		UPDATE users 
		SET first_name = $1, last_name = $2, avatar_url = $3, bio = $4, updated_at = CURRENT_TIMESTAMP
		WHERE id = $5
		RETURNING updated_at
	`
	return s.db.QueryRow(
		query,
		user.FirstName,
		user.LastName,
		user.AvatarURL,
		user.Bio,
		user.ID,
	).Scan(&user.UpdatedAt)
}

// List retrieves all users with optional filtering
func (s *UserStore) List(role string, limit, offset int) ([]*User, error) {
	var query string
	var rows *sql.Rows
	var err error

	if role != "" {
		query = `
			SELECT id, email, first_name, last_name, role, avatar_url, 
			       bio, is_active, created_at, updated_at
			FROM users WHERE role = $1 AND is_active = true
			ORDER BY created_at DESC
			LIMIT $2 OFFSET $3
		`
		rows, err = s.db.Query(query, role, limit, offset)
	} else {
		query = `
			SELECT id, email, first_name, last_name, role, avatar_url, 
			       bio, is_active, created_at, updated_at
			FROM users WHERE is_active = true
			ORDER BY created_at DESC
			LIMIT $1 OFFSET $2
		`
		rows, err = s.db.Query(query, limit, offset)
	}

	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var users []*User
	for rows.Next() {
		user := &User{}
		err := rows.Scan(
			&user.ID,
			&user.Email,
			&user.FirstName,
			&user.LastName,
			&user.Role,
			&user.AvatarURL,
			&user.Bio,
			&user.IsActive,
			&user.CreatedAt,
			&user.UpdatedAt,
		)
		if err != nil {
			return nil, err
		}
		users = append(users, user)
	}

	return users, nil
}
