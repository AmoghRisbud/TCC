package handlers

import (
	"database/sql"
	"encoding/json"
	"net/http"
	"strconv"
	"strings"

	"github.com/AmoghRisbud/TCC/backend/internal/auth"
	"github.com/AmoghRisbud/TCC/backend/internal/models"
)

// EnrollmentHandler handles enrollment-related requests
type EnrollmentHandler struct {
	enrollmentStore *models.EnrollmentStore
	courseStore     *models.CourseStore
}

// NewEnrollmentHandler creates a new EnrollmentHandler
func NewEnrollmentHandler(enrollmentStore *models.EnrollmentStore, courseStore *models.CourseStore) *EnrollmentHandler {
	return &EnrollmentHandler{
		enrollmentStore: enrollmentStore,
		courseStore:     courseStore,
	}
}

// EnrollRequest represents an enrollment request
type EnrollRequest struct {
	CourseID int `json:"course_id"`
}

// Enroll handles POST /enrollments - student enrolls in a course
func (h *EnrollmentHandler) Enroll(w http.ResponseWriter, r *http.Request) {
	claims, ok := r.Context().Value("user").(*auth.Claims)
	if !ok {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	// Only students can enroll
	if claims.Role != "student" {
		http.Error(w, "Only students can enroll in courses", http.StatusForbidden)
		return
	}

	var req EnrollRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	// Check if course exists
	course, err := h.courseStore.GetByID(req.CourseID)
	if err != nil {
		http.Error(w, "Course not found", http.StatusNotFound)
		return
	}

	// Check if course is published
	if !course.IsPublished {
		http.Error(w, "Course is not available for enrollment", http.StatusBadRequest)
		return
	}

	// Check if already enrolled
	existing, _ := h.enrollmentStore.GetByUserAndCourse(claims.UserID, req.CourseID)
	if existing != nil {
		http.Error(w, "Already enrolled in this course", http.StatusConflict)
		return
	}

	// Check enrollment limit
	if course.EnrollmentLimit != nil {
		count, err := h.enrollmentStore.GetEnrollmentCount(req.CourseID)
		if err == nil && count >= *course.EnrollmentLimit {
			http.Error(w, "Course enrollment is full", http.StatusBadRequest)
			return
		}
	}

	// Create enrollment
	enrollment := &models.Enrollment{
		UserID:   claims.UserID,
		CourseID: req.CourseID,
	}

	if err := h.enrollmentStore.Create(enrollment); err != nil {
		http.Error(w, "Error creating enrollment", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(enrollment)
}

// ListMyEnrollments handles GET /enrollments/me - list current user's enrollments
func (h *EnrollmentHandler) ListMyEnrollments(w http.ResponseWriter, r *http.Request) {
	claims, ok := r.Context().Value("user").(*auth.Claims)
	if !ok {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	status := r.URL.Query().Get("status")
	limit, _ := strconv.Atoi(r.URL.Query().Get("limit"))
	if limit <= 0 || limit > 100 {
		limit = 20
	}
	offset, _ := strconv.Atoi(r.URL.Query().Get("offset"))
	if offset < 0 {
		offset = 0
	}

	enrollments, err := h.enrollmentStore.ListByUser(claims.UserID, status, limit, offset)
	if err != nil {
		http.Error(w, "Error fetching enrollments", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(enrollments)
}

// ListCourseEnrollments handles GET /courses/{id}/enrollments - list course enrollments (instructor/admin)
func (h *EnrollmentHandler) ListCourseEnrollments(w http.ResponseWriter, r *http.Request) {
	claims, ok := r.Context().Value("user").(*auth.Claims)
	if !ok {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	// Extract course ID from URL
	pathParts := strings.Split(r.URL.Path, "/")
	if len(pathParts) < 4 {
		http.Error(w, "Invalid course ID", http.StatusBadRequest)
		return
	}

	courseID, err := strconv.Atoi(pathParts[3])
	if err != nil {
		http.Error(w, "Invalid course ID", http.StatusBadRequest)
		return
	}

	// Get course to verify ownership
	course, err := h.courseStore.GetByID(courseID)
	if err != nil {
		http.Error(w, "Course not found", http.StatusNotFound)
		return
	}

	// Check if user is the instructor or an admin
	if claims.Role != "admin" && (course.InstructorID == nil || *course.InstructorID != claims.UserID) {
		http.Error(w, "Forbidden: you can only view enrollments for your own courses", http.StatusForbidden)
		return
	}

	status := r.URL.Query().Get("status")
	limit, _ := strconv.Atoi(r.URL.Query().Get("limit"))
	if limit <= 0 || limit > 100 {
		limit = 50
	}
	offset, _ := strconv.Atoi(r.URL.Query().Get("offset"))
	if offset < 0 {
		offset = 0
	}

	enrollments, err := h.enrollmentStore.ListByCourse(courseID, status, limit, offset)
	if err != nil {
		http.Error(w, "Error fetching enrollments", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(enrollments)
}

// GetEnrollment handles GET /enrollments/{id}
func (h *EnrollmentHandler) GetEnrollment(w http.ResponseWriter, r *http.Request) {
	claims, ok := r.Context().Value("user").(*auth.Claims)
	if !ok {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	// Extract ID from URL
	pathParts := strings.Split(r.URL.Path, "/")
	if len(pathParts) < 3 {
		http.Error(w, "Invalid enrollment ID", http.StatusBadRequest)
		return
	}

	id, err := strconv.Atoi(pathParts[len(pathParts)-1])
	if err != nil {
		http.Error(w, "Invalid enrollment ID", http.StatusBadRequest)
		return
	}

	enrollment, err := h.enrollmentStore.GetByID(id)
	if err != nil {
		if err == sql.ErrNoRows {
			http.Error(w, "Enrollment not found", http.StatusNotFound)
		} else {
			http.Error(w, "Error fetching enrollment", http.StatusInternalServerError)
		}
		return
	}

	// Check if user owns this enrollment or is the instructor/admin
	if claims.Role == "student" && enrollment.UserID != claims.UserID {
		http.Error(w, "Forbidden: you can only view your own enrollments", http.StatusForbidden)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(enrollment)
}
