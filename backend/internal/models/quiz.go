package models

import (
	"database/sql"
	"time"
)

// Quiz represents a quiz/assessment
type Quiz struct {
	ID               int       `json:"id"`
	LessonID         int       `json:"lesson_id"`
	Title            string    `json:"title"`
	Description      *string   `json:"description,omitempty"`
	PassingScore     int       `json:"passing_score"`
	TimeLimitMinutes *int      `json:"time_limit_minutes,omitempty"`
	MaxAttempts      *int      `json:"max_attempts,omitempty"`
	CreatedAt        time.Time `json:"created_at"`
	UpdatedAt        time.Time `json:"updated_at"`
}

// QuizQuestion represents a question in a quiz
type QuizQuestion struct {
	ID           int       `json:"id"`
	QuizID       int       `json:"quiz_id"`
	QuestionText string    `json:"question_text"`
	QuestionType string    `json:"question_type"` // multiple_choice, true_false, short_answer
	Points       int       `json:"points"`
	OrderIndex   int       `json:"order_index"`
	CreatedAt    time.Time `json:"created_at"`
}

// QuizQuestionOption represents an option for a multiple choice question
type QuizQuestionOption struct {
	ID         int    `json:"id"`
	QuestionID int    `json:"question_id"`
	OptionText string `json:"option_text"`
	IsCorrect  bool   `json:"is_correct"`
	OrderIndex int    `json:"order_index"`
}

// QuizAttempt represents a student's attempt at a quiz
type QuizAttempt struct {
	ID            int        `json:"id"`
	UserID        int        `json:"user_id"`
	QuizID        int        `json:"quiz_id"`
	Score         *float64   `json:"score,omitempty"`
	Passed        *bool      `json:"passed,omitempty"`
	StartedAt     time.Time  `json:"started_at"`
	CompletedAt   *time.Time `json:"completed_at,omitempty"`
	AttemptNumber int        `json:"attempt_number"`
}

// QuizAnswer represents a student's answer to a question
type QuizAnswer struct {
	ID               int     `json:"id"`
	AttemptID        int     `json:"attempt_id"`
	QuestionID       int     `json:"question_id"`
	SelectedOptionID *int    `json:"selected_option_id,omitempty"`
	AnswerText       *string `json:"answer_text,omitempty"`
	IsCorrect        *bool   `json:"is_correct,omitempty"`
	PointsEarned     float64 `json:"points_earned"`
}

// QuizStore provides database operations for quizzes
type QuizStore struct {
	db *sql.DB
}

// NewQuizStore creates a new QuizStore
func NewQuizStore(db *sql.DB) *QuizStore {
	return &QuizStore{db: db}
}

// CreateQuiz creates a new quiz
func (s *QuizStore) CreateQuiz(quiz *Quiz) error {
	query := `
		INSERT INTO quizzes (lesson_id, title, description, passing_score, time_limit_minutes, max_attempts)
		VALUES ($1, $2, $3, $4, $5, $6)
		RETURNING id, created_at, updated_at
	`
	return s.db.QueryRow(
		query,
		quiz.LessonID,
		quiz.Title,
		quiz.Description,
		quiz.PassingScore,
		quiz.TimeLimitMinutes,
		quiz.MaxAttempts,
	).Scan(&quiz.ID, &quiz.CreatedAt, &quiz.UpdatedAt)
}

// GetQuiz retrieves a quiz by ID
func (s *QuizStore) GetQuiz(id int) (*Quiz, error) {
	quiz := &Quiz{}
	query := `
		SELECT id, lesson_id, title, description, passing_score, time_limit_minutes, 
		       max_attempts, created_at, updated_at
		FROM quizzes WHERE id = $1
	`
	err := s.db.QueryRow(query, id).Scan(
		&quiz.ID,
		&quiz.LessonID,
		&quiz.Title,
		&quiz.Description,
		&quiz.PassingScore,
		&quiz.TimeLimitMinutes,
		&quiz.MaxAttempts,
		&quiz.CreatedAt,
		&quiz.UpdatedAt,
	)
	if err != nil {
		return nil, err
	}
	return quiz, nil
}

// CreateQuestion creates a quiz question
func (s *QuizStore) CreateQuestion(question *QuizQuestion) error {
	query := `
		INSERT INTO quiz_questions (quiz_id, question_text, question_type, points, order_index)
		VALUES ($1, $2, $3, $4, $5)
		RETURNING id, created_at
	`
	return s.db.QueryRow(
		query,
		question.QuizID,
		question.QuestionText,
		question.QuestionType,
		question.Points,
		question.OrderIndex,
	).Scan(&question.ID, &question.CreatedAt)
}

// CreateOption creates a question option
func (s *QuizStore) CreateOption(option *QuizQuestionOption) error {
	query := `
		INSERT INTO quiz_question_options (question_id, option_text, is_correct, order_index)
		VALUES ($1, $2, $3, $4)
		RETURNING id
	`
	return s.db.QueryRow(
		query,
		option.QuestionID,
		option.OptionText,
		option.IsCorrect,
		option.OrderIndex,
	).Scan(&option.ID)
}

// GetQuestions retrieves all questions for a quiz
func (s *QuizStore) GetQuestions(quizID int) ([]*QuizQuestion, error) {
	query := `
		SELECT id, quiz_id, question_text, question_type, points, order_index, created_at
		FROM quiz_questions WHERE quiz_id = $1 ORDER BY order_index
	`
	rows, err := s.db.Query(query, quizID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var questions []*QuizQuestion
	for rows.Next() {
		q := &QuizQuestion{}
		err := rows.Scan(
			&q.ID,
			&q.QuizID,
			&q.QuestionText,
			&q.QuestionType,
			&q.Points,
			&q.OrderIndex,
			&q.CreatedAt,
		)
		if err != nil {
			return nil, err
		}
		questions = append(questions, q)
	}
	return questions, nil
}

// GetOptions retrieves all options for a question
func (s *QuizStore) GetOptions(questionID int, includeCorrect bool) ([]*QuizQuestionOption, error) {
	var query string
	if includeCorrect {
		query = `
			SELECT id, question_id, option_text, is_correct, order_index
			FROM quiz_question_options WHERE question_id = $1 ORDER BY order_index
		`
	} else {
		query = `
			SELECT id, question_id, option_text, false as is_correct, order_index
			FROM quiz_question_options WHERE question_id = $1 ORDER BY order_index
		`
	}

	rows, err := s.db.Query(query, questionID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var options []*QuizQuestionOption
	for rows.Next() {
		o := &QuizQuestionOption{}
		err := rows.Scan(
			&o.ID,
			&o.QuestionID,
			&o.OptionText,
			&o.IsCorrect,
			&o.OrderIndex,
		)
		if err != nil {
			return nil, err
		}
		options = append(options, o)
	}
	return options, nil
}

// StartAttempt creates a new quiz attempt
func (s *QuizStore) StartAttempt(attempt *QuizAttempt) error {
	// Count existing attempts
	var attemptCount int
	countQuery := `SELECT COUNT(*) FROM quiz_attempts WHERE user_id = $1 AND quiz_id = $2`
	if err := s.db.QueryRow(countQuery, attempt.UserID, attempt.QuizID).Scan(&attemptCount); err != nil {
		return err
	}

	attempt.AttemptNumber = attemptCount + 1

	query := `
		INSERT INTO quiz_attempts (user_id, quiz_id, attempt_number)
		VALUES ($1, $2, $3)
		RETURNING id, started_at
	`
	return s.db.QueryRow(
		query,
		attempt.UserID,
		attempt.QuizID,
		attempt.AttemptNumber,
	).Scan(&attempt.ID, &attempt.StartedAt)
}

// SubmitAnswer submits an answer for a question
func (s *QuizStore) SubmitAnswer(answer *QuizAnswer) error {
	query := `
		INSERT INTO quiz_answers (attempt_id, question_id, selected_option_id, answer_text, is_correct, points_earned)
		VALUES ($1, $2, $3, $4, $5, $6)
		RETURNING id
	`
	return s.db.QueryRow(
		query,
		answer.AttemptID,
		answer.QuestionID,
		answer.SelectedOptionID,
		answer.AnswerText,
		answer.IsCorrect,
		answer.PointsEarned,
	).Scan(&answer.ID)
}

// CompleteAttempt marks an attempt as completed and calculates the score
func (s *QuizStore) CompleteAttempt(attemptID int) error {
	// Calculate total score
	var totalScore float64
	var totalPossible float64

	scoreQuery := `
		SELECT COALESCE(SUM(qa.points_earned), 0) as earned, 
		       COALESCE(SUM(qq.points), 0) as possible
		FROM quiz_answers qa
		JOIN quiz_questions qq ON qa.question_id = qq.id
		WHERE qa.attempt_id = $1
	`
	if err := s.db.QueryRow(scoreQuery, attemptID).Scan(&totalScore, &totalPossible); err != nil {
		return err
	}

	percentage := (totalScore / totalPossible) * 100

	// Get passing score
	var passingScore int
	passingQuery := `
		SELECT q.passing_score
		FROM quizzes q
		JOIN quiz_attempts qa ON q.id = qa.quiz_id
		WHERE qa.id = $1
	`
	if err := s.db.QueryRow(passingQuery, attemptID).Scan(&passingScore); err != nil {
		return err
	}

	passed := percentage >= float64(passingScore)

	// Update attempt
	updateQuery := `
		UPDATE quiz_attempts 
		SET score = $1, passed = $2, completed_at = CURRENT_TIMESTAMP
		WHERE id = $3
	`
	_, err := s.db.Exec(updateQuery, percentage, passed, attemptID)
	return err
}

// GetAttempt retrieves a quiz attempt by ID
func (s *QuizStore) GetAttempt(id int) (*QuizAttempt, error) {
	attempt := &QuizAttempt{}
	query := `
		SELECT id, user_id, quiz_id, score, passed, started_at, completed_at, attempt_number
		FROM quiz_attempts WHERE id = $1
	`
	err := s.db.QueryRow(query, id).Scan(
		&attempt.ID,
		&attempt.UserID,
		&attempt.QuizID,
		&attempt.Score,
		&attempt.Passed,
		&attempt.StartedAt,
		&attempt.CompletedAt,
		&attempt.AttemptNumber,
	)
	if err != nil {
		return nil, err
	}
	return attempt, nil
}

// GetUserAttempts retrieves all attempts by a user for a quiz
func (s *QuizStore) GetUserAttempts(userID, quizID int) ([]*QuizAttempt, error) {
	query := `
		SELECT id, user_id, quiz_id, score, passed, started_at, completed_at, attempt_number
		FROM quiz_attempts 
		WHERE user_id = $1 AND quiz_id = $2
		ORDER BY started_at DESC
	`
	rows, err := s.db.Query(query, userID, quizID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var attempts []*QuizAttempt
	for rows.Next() {
		a := &QuizAttempt{}
		err := rows.Scan(
			&a.ID,
			&a.UserID,
			&a.QuizID,
			&a.Score,
			&a.Passed,
			&a.StartedAt,
			&a.CompletedAt,
			&a.AttemptNumber,
		)
		if err != nil {
			return nil, err
		}
		attempts = append(attempts, a)
	}
	return attempts, nil
}
