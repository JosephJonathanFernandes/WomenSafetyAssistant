package router

import (
	"github.com/gofiber/fiber/v2"
	"women-safety-backend/internal/handlers"
)

func SetupRoutes(app *fiber.App) {
	api := app.Group("/api")

	// SOS Routes
	api.Post("/sos", handlers.CreateSOS)
	api.Get("/sos/:id", handlers.GetSOSStatus)

	// Analytics Routes
	api.Get("/analytics/:user_id", handlers.GetAnalytics)
	
	// Notification Routes
	api.Get("/notifications/:user_id", handlers.GetNotifications)
	api.Get("/notifications/sos/:sos_id", handlers.GetNotificationsBySOS)
	
	// Health check
	api.Get("/health", handlers.HealthCheck)
}
