package handlers

import (
	"encoding/json"
	"net/http"
	"strconv"
	"strings"

	"github.com/AmoghRisbud/TCC/backend/internal/auth"
	"github.com/AmoghRisbud/TCC/backend/internal/models"
)

// QuizHandler handles quiz-related requests
type QuizHandler struct {
	quizStore *models.QuizStore
}

// NewQuizHandler creates a new QuizHandler
func NewQuizHandler(quizStore *models.QuizStore) *QuizHandler {
	return &QuizHandler{
		quizStore: quizStore,
	}
}

// CreateQuiz handles POST /quizzes (instructor/admin only)
func (h *QuizHandler) CreateQuiz(w http.ResponseWriter, r *http.Request) {
	var quiz models.Quiz
	if err := json.NewDecoder(r.Body).Decode(&quiz); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	if quiz.Title == "" || quiz.LessonID == 0 {
		http.Error(w, "Missing required fields", http.StatusBadRequest)
		return
	}

	if err := h.quizStore.CreateQuiz(&quiz); err != nil {
		http.Error(w, "Error creating quiz", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(quiz)
}

// GetQuiz handles GET /quizzes/{id}
func (h *QuizHandler) GetQuiz(w http.ResponseWriter, r *http.Request) {
	pathParts := strings.Split(r.URL.Path, "/")
	if len(pathParts) < 3 {
		http.Error(w, "Invalid quiz ID", http.StatusBadRequest)
		return
	}

	id, err := strconv.Atoi(pathParts[len(pathParts)-1])
	if err != nil {
		http.Error(w, "Invalid quiz ID", http.StatusBadRequest)
		return
	}

	quiz, err := h.quizStore.GetQuiz(id)
	if err != nil {
		http.Error(w, "Quiz not found", http.StatusNotFound)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(quiz)
}

// StartQuizAttempt handles POST /quizzes/{id}/attempts
func (h *QuizHandler) StartQuizAttempt(w http.ResponseWriter, r *http.Request) {
	claims, ok := r.Context().Value("user").(*auth.Claims)
	if !ok {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	pathParts := strings.Split(r.URL.Path, "/")
	if len(pathParts) < 3 {
		http.Error(w, "Invalid quiz ID", http.StatusBadRequest)
		return
	}

	quizID, err := strconv.Atoi(pathParts[2])
	if err != nil {
		http.Error(w, "Invalid quiz ID", http.StatusBadRequest)
		return
	}

	// Get quiz to check max attempts
	quiz, err := h.quizStore.GetQuiz(quizID)
	if err != nil {
		http.Error(w, "Quiz not found", http.StatusNotFound)
		return
	}

	// Check if user has reached max attempts
	attempts, _ := h.quizStore.GetUserAttempts(claims.UserID, quizID)
	if quiz.MaxAttempts != nil && len(attempts) >= *quiz.MaxAttempts {
		http.Error(w, "Maximum number of attempts reached", http.StatusBadRequest)
		return
	}

	// Create new attempt
	attempt := &models.QuizAttempt{
		UserID: claims.UserID,
		QuizID: quizID,
	}

	if err := h.quizStore.StartAttempt(attempt); err != nil {
		http.Error(w, "Error starting quiz attempt", http.StatusInternalServerError)
		return
	}

	// Get questions with options (but hide correct answers)
	questions, err := h.quizStore.GetQuestions(quizID)
	if err != nil {
		http.Error(w, "Error fetching questions", http.StatusInternalServerError)
		return
	}

	// Attach options to questions
	type QuestionWithOptions struct {
		*models.QuizQuestion
		Options []*models.QuizQuestionOption `json:"options"`
	}

	questionsWithOptions := make([]QuestionWithOptions, 0, len(questions))
	for _, q := range questions {
		options, err := h.quizStore.GetOptions(q.ID, false) // false = don't include correct answers
		if err != nil {
			continue
		}
		questionsWithOptions = append(questionsWithOptions, QuestionWithOptions{
			QuizQuestion: q,
			Options:      options,
		})
	}

	response := struct {
		Attempt   *models.QuizAttempt   `json:"attempt"`
		Questions []QuestionWithOptions `json:"questions"`
	}{
		Attempt:   attempt,
		Questions: questionsWithOptions,
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(response)
}

// SubmitQuizAnswers handles POST /quizzes/attempts/{id}/submit
func (h *QuizHandler) SubmitQuizAnswers(w http.ResponseWriter, r *http.Request) {
	claims, ok := r.Context().Value("user").(*auth.Claims)
	if !ok {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	pathParts := strings.Split(r.URL.Path, "/")
	if len(pathParts) < 4 {
		http.Error(w, "Invalid attempt ID", http.StatusBadRequest)
		return
	}

	attemptID, err := strconv.Atoi(pathParts[3])
	if err != nil {
		http.Error(w, "Invalid attempt ID", http.StatusBadRequest)
		return
	}

	// Verify attempt belongs to user
	attempt, err := h.quizStore.GetAttempt(attemptID)
	if err != nil {
		http.Error(w, "Attempt not found", http.StatusNotFound)
		return
	}

	if attempt.UserID != claims.UserID {
		http.Error(w, "Forbidden: this attempt does not belong to you", http.StatusForbidden)
		return
	}

	if attempt.CompletedAt != nil {
		http.Error(w, "Attempt already completed", http.StatusBadRequest)
		return
	}

	// Parse submitted answers
	type SubmitAnswer struct {
		QuestionID       int     `json:"question_id"`
		SelectedOptionID *int    `json:"selected_option_id,omitempty"`
		AnswerText       *string `json:"answer_text,omitempty"`
	}

	var submittedAnswers []SubmitAnswer
	if err := json.NewDecoder(r.Body).Decode(&submittedAnswers); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	// Get all questions for this quiz
	questions, err := h.quizStore.GetQuestions(attempt.QuizID)
	if err != nil {
		http.Error(w, "Error fetching questions", http.StatusInternalServerError)
		return
	}

	// Grade each answer
	for _, submitted := range submittedAnswers {
		// Find the question
		var question *models.QuizQuestion
		for _, q := range questions {
			if q.ID == submitted.QuestionID {
				question = q
				break
			}
		}

		if question == nil {
			continue
		}

		answer := &models.QuizAnswer{
			AttemptID:  attemptID,
			QuestionID: submitted.QuestionID,
			AnswerText: submitted.AnswerText,
		}

		// Grade based on question type
		if question.QuestionType == "multiple_choice" || question.QuestionType == "true_false" {
			if submitted.SelectedOptionID != nil {
				answer.SelectedOptionID = submitted.SelectedOptionID

				// Check if the selected option is correct
				options, err := h.quizStore.GetOptions(question.ID, true)
				if err == nil {
					for _, opt := range options {
						if opt.ID == *submitted.SelectedOptionID && opt.IsCorrect {
							isCorrect := true
							answer.IsCorrect = &isCorrect
							answer.PointsEarned = float64(question.Points)
							break
						}
					}
					if answer.IsCorrect == nil {
						isCorrect := false
						answer.IsCorrect = &isCorrect
						answer.PointsEarned = 0
					}
				}
			}
		}
		// Short answer questions require manual grading, so we leave IsCorrect as nil

		// Save the answer
		h.quizStore.SubmitAnswer(answer)
	}

	// Complete the attempt and calculate score
	if err := h.quizStore.CompleteAttempt(attemptID); err != nil {
		http.Error(w, "Error completing attempt", http.StatusInternalServerError)
		return
	}

	// Get updated attempt with score
	completedAttempt, err := h.quizStore.GetAttempt(attemptID)
	if err != nil {
		http.Error(w, "Error fetching attempt", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(completedAttempt)
}

// GetMyAttempts handles GET /quizzes/{id}/attempts/me
func (h *QuizHandler) GetMyAttempts(w http.ResponseWriter, r *http.Request) {
	claims, ok := r.Context().Value("user").(*auth.Claims)
	if !ok {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	pathParts := strings.Split(r.URL.Path, "/")
	if len(pathParts) < 3 {
		http.Error(w, "Invalid quiz ID", http.StatusBadRequest)
		return
	}

	quizID, err := strconv.Atoi(pathParts[2])
	if err != nil {
		http.Error(w, "Invalid quiz ID", http.StatusBadRequest)
		return
	}

	attempts, err := h.quizStore.GetUserAttempts(claims.UserID, quizID)
	if err != nil {
		http.Error(w, "Error fetching attempts", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(attempts)
}
