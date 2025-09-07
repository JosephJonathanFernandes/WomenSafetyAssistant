package main

import (
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"women-safety-backend/internal/db"
	"women-safety-backend/internal/services"
	"women-safety-backend/router"
)

func main() {
	app := fiber.New()

	// Enable CORS
	app.Use(cors.New(cors.Config{
		AllowOrigins: "*", // allow your frontend URL in production, e.g., "http://localhost:3000"
		AllowMethods: "GET,POST,PUT,DELETE,OPTIONS",
		AllowHeaders: "Origin, Content-Type, Accept",
	}))

	// Init DB
	db.InitDB()
	
	// Init Twilio client for SMS
	services.InitTwilioClient()

	// Routes
	router.SetupRoutes(app)

	// Start server
	app.Listen(":3001")
}
