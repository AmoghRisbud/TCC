package main

import (
	"log"
	"net/http"

	"github.com/AmoghRisbud/TCC/backend/internal/auth"
	"github.com/AmoghRisbud/TCC/backend/internal/config"
	"github.com/AmoghRisbud/TCC/backend/internal/database"
	"github.com/AmoghRisbud/TCC/backend/internal/handlers"
	"github.com/AmoghRisbud/TCC/backend/internal/middleware"
	"github.com/AmoghRisbud/TCC/backend/internal/models"
)

func main() {
	// Load configuration
	cfg := config.Load()
	log.Printf("Starting TCC LMS API server on port %s", cfg.Server.Port)

	// Connect to database
	db, err := database.New(&cfg.Database)
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}
	defer db.Close()

	// Initialize database schema
	if err := db.InitSchema(); err != nil {
		log.Fatalf("Failed to initialize database schema: %v", err)
	}

	// Initialize services
	authService := auth.NewService(cfg.JWT.Secret, cfg.JWT.Expiration)

	// Initialize stores
	userStore := models.NewUserStore(db.DB)
	courseStore := models.NewCourseStore(db.DB)

	// Initialize handlers
	authHandler := handlers.NewAuthHandler(userStore, authService)
	courseHandler := handlers.NewCourseHandler(courseStore)

	// Setup routes
	mux := http.NewServeMux()

	// Public routes
	mux.HandleFunc("/api/auth/register", authHandler.Register)
	mux.HandleFunc("/api/auth/login", authHandler.Login)
	mux.HandleFunc("/api/courses", func(w http.ResponseWriter, r *http.Request) {
		if r.Method == http.MethodGet {
			courseHandler.ListCourses(w, r)
		} else {
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		}
	})

	// Protected routes - require authentication
	protectedMux := http.NewServeMux()
	protectedMux.HandleFunc("/api/auth/me", authHandler.Me)
	
	// Course management routes
	protectedMux.HandleFunc("/api/courses/create", courseHandler.CreateCourse)
	protectedMux.HandleFunc("/api/courses/", func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case http.MethodGet:
			courseHandler.GetCourse(w, r)
		case http.MethodPut:
			courseHandler.UpdateCourse(w, r)
		case http.MethodDelete:
			courseHandler.DeleteCourse(w, r)
		default:
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		}
	})

	// Apply middleware to protected routes
	authMiddleware := middleware.AuthMiddleware(authService)
	
	// Combine public and protected routes
	finalMux := http.NewServeMux()
	finalMux.Handle("/api/auth/register", mux)
	finalMux.Handle("/api/auth/login", mux)
	finalMux.Handle("/api/courses", mux)
	finalMux.Handle("/api/auth/me", authMiddleware(protectedMux))
	finalMux.Handle("/api/courses/", authMiddleware(protectedMux))

	// Health check endpoint
	finalMux.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		w.Write([]byte("OK"))
	})

	// Apply global middleware
	handler := middleware.Logging(middleware.CORS(finalMux))

	// Start server
	addr := ":" + cfg.Server.Port
	log.Printf("Server listening on %s", addr)
	if err := http.ListenAndServe(addr, handler); err != nil {
		log.Fatalf("Server failed to start: %v", err)
	}
}
