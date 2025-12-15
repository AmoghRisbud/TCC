package handlers

import (
	"encoding/json"
	"net/http"
	"strconv"
	"strings"

	"github.com/AmoghRisbud/TCC/backend/internal/auth"
	"github.com/AmoghRisbud/TCC/backend/internal/models"
)

// CourseHandler handles course-related requests
type CourseHandler struct {
	courseStore *models.CourseStore
}

// NewCourseHandler creates a new CourseHandler
func NewCourseHandler(courseStore *models.CourseStore) *CourseHandler {
	return &CourseHandler{
		courseStore: courseStore,
	}
}

// ListCourses handles GET /courses
func (h *CourseHandler) ListCourses(w http.ResponseWriter, r *http.Request) {
	// Parse query parameters
	category := r.URL.Query().Get("category")
	level := r.URL.Query().Get("level")
	instructorIDStr := r.URL.Query().Get("instructor_id")

	limit, _ := strconv.Atoi(r.URL.Query().Get("limit"))
	if limit <= 0 || limit > 100 {
		limit = 20
	}

	offset, _ := strconv.Atoi(r.URL.Query().Get("offset"))
	if offset < 0 {
		offset = 0
	}

	var instructorID *int
	if instructorIDStr != "" {
		id, err := strconv.Atoi(instructorIDStr)
		if err == nil {
			instructorID = &id
		}
	}

	courses, err := h.courseStore.List(category, level, instructorID, limit, offset)
	if err != nil {
		http.Error(w, "Error fetching courses", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(courses)
}

// GetCourse handles GET /courses/{id}
func (h *CourseHandler) GetCourse(w http.ResponseWriter, r *http.Request) {
	// Extract ID from URL path
	pathParts := strings.Split(r.URL.Path, "/")
	if len(pathParts) < 3 {
		http.Error(w, "Invalid course ID", http.StatusBadRequest)
		return
	}

	idOrSlug := pathParts[len(pathParts)-1]

	var course *models.Course
	var err error

	// Try to parse as ID first
	if id, parseErr := strconv.Atoi(idOrSlug); parseErr == nil {
		course, err = h.courseStore.GetByID(id)
	} else {
		// Otherwise treat as slug
		course, err = h.courseStore.GetBySlug(idOrSlug)
	}

	if err != nil {
		http.Error(w, "Course not found", http.StatusNotFound)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(course)
}

// CreateCourse handles POST /courses (instructor/admin only)
func (h *CourseHandler) CreateCourse(w http.ResponseWriter, r *http.Request) {
	claims, ok := r.Context().Value("user").(*auth.Claims)
	if !ok {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	var course models.Course
	if err := json.NewDecoder(r.Body).Decode(&course); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	// Validate required fields
	if course.Title == "" || course.Slug == "" {
		http.Error(w, "Missing required fields", http.StatusBadRequest)
		return
	}

	// Set instructor ID to current user if they're an instructor
	if claims.Role == "instructor" {
		course.InstructorID = &claims.UserID
	}

	if err := h.courseStore.Create(&course); err != nil {
		http.Error(w, "Error creating course", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(course)
}

// UpdateCourse handles PUT /courses/{id} (instructor/admin only)
func (h *CourseHandler) UpdateCourse(w http.ResponseWriter, r *http.Request) {
	claims, ok := r.Context().Value("user").(*auth.Claims)
	if !ok {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	// Extract ID from URL
	pathParts := strings.Split(r.URL.Path, "/")
	if len(pathParts) < 3 {
		http.Error(w, "Invalid course ID", http.StatusBadRequest)
		return
	}

	id, err := strconv.Atoi(pathParts[len(pathParts)-1])
	if err != nil {
		http.Error(w, "Invalid course ID", http.StatusBadRequest)
		return
	}

	// Get existing course to verify ownership
	existingCourse, err := h.courseStore.GetByID(id)
	if err != nil {
		http.Error(w, "Course not found", http.StatusNotFound)
		return
	}

	// Check if user is the instructor or an admin
	if claims.Role != "admin" && (existingCourse.InstructorID == nil || *existingCourse.InstructorID != claims.UserID) {
		http.Error(w, "Forbidden: you can only update your own courses", http.StatusForbidden)
		return
	}

	var course models.Course
	if err := json.NewDecoder(r.Body).Decode(&course); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	course.ID = id
	if err := h.courseStore.Update(&course); err != nil {
		http.Error(w, "Error updating course", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(course)
}

// DeleteCourse handles DELETE /courses/{id} (admin only)
func (h *CourseHandler) DeleteCourse(w http.ResponseWriter, r *http.Request) {
	// Extract ID from URL
	pathParts := strings.Split(r.URL.Path, "/")
	if len(pathParts) < 3 {
		http.Error(w, "Invalid course ID", http.StatusBadRequest)
		return
	}

	id, err := strconv.Atoi(pathParts[len(pathParts)-1])
	if err != nil {
		http.Error(w, "Invalid course ID", http.StatusBadRequest)
		return
	}

	if err := h.courseStore.Delete(id); err != nil {
		http.Error(w, "Error deleting course", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}
