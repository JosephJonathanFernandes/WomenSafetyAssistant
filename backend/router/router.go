package router

import (
	"women-safety-backend/internal/handlers"

	"github.com/gofiber/fiber/v2"
)

func SetupRoutes(app *fiber.App) {
	api := app.Group("/api")

	// SOS Routes
	api.Post("/sos", handlers.CreateSOS)
	api.Get("/sos/:id", handlers.GetSOSStatus)

	// Analytics Routes
	api.Get("/analytics/:user_id", handlers.GetAnalytics)

	// Wolfram Proxy
	api.Get("/wolfram", handlers.WolframProxy)

	// Notification Routes
	api.Get("/notifications/:user_id", handlers.GetNotifications)
	api.Get("/notifications/sos/:sos_id", handlers.GetNotificationsBySOS)

	// Health check
	api.Get("/health", handlers.HealthCheck)
}
