package handlers

import (
	"encoding/json"
	"log"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"github.com/supabase-community/postgrest-go"
	"women-safety-backend/internal/db"
	"women-safety-backend/internal/models"
	"women-safety-backend/internal/services"
)

// CreateSOS handles SOS alert creation
func CreateSOS(c *fiber.Ctx) error {
	var sos models.SOSAlert
	if err := c.BodyParser(&sos); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": err.Error()})
	}

	// Generate ID and set timestamp
	sos.ID = uuid.New().String()
	sos.Status = "active"
	sos.Timestamp = time.Now().Format(time.RFC3339)
	sos.CreatedAt = time.Now().Format(time.RFC3339)

	// Create location JSON if coordinates are provided
	if sos.Latitude != 0 && sos.Longitude != 0 {
		locationData := map[string]interface{}{
			"latitude":  sos.Latitude,
			"longitude": sos.Longitude,
			"timestamp": sos.Timestamp,
		}
		if locationJSON, err := json.Marshal(locationData); err == nil {
			sos.Location = locationJSON
		}
	} else {
		// Set default location data if no coordinates provided
		locationData := map[string]interface{}{
			"latitude":  nil,
			"longitude": nil,
			"timestamp": sos.Timestamp,
			"note":      "Location not available",
		}
		if locationJSON, err := json.Marshal(locationData); err == nil {
			sos.Location = locationJSON
		}
	}

	// Insert into Supabase
	log.Printf("Inserting SOS alert: %+v", sos)
	
	// Create a map with only the fields that exist in the database
	sosMap := map[string]interface{}{
		"user_id": sos.UserID,
		"status": sos.Status,
		"method": sos.Method,
		"latitude": sos.Latitude,
		"longitude": sos.Longitude,
		"timestamp": sos.Timestamp,
	}
	
	// Only include ID if it's not empty
	if sos.ID != "" {
		sosMap["id"] = sos.ID
	}
	
	_, _, err := db.Client.From("sos_alerts").
		Insert(sosMap, false, "", "representation", "").
		Execute()
	if err != nil {
		log.Printf("Error inserting SOS alert: %v", err)
		return c.Status(500).JSON(fiber.Map{
			"error": "Failed to create SOS alert",
			"details": err.Error(),
		})
	}

	// Get trusted contacts for the user
	contacts, err := getTrustedContacts(sos.UserID)
	if err != nil {
		log.Printf("Error getting trusted contacts: %v", err)
		// Don't fail the SOS creation if we can't get contacts
	} else {
		// Notify contacts and create notification records
		go notifyContacts(contacts, sos)
	}

	return c.Status(201).JSON(fiber.Map{
		"message": "SOS alert created successfully",
		"id":      sos.ID,
	})
}

func GetSOSStatus(c *fiber.Ctx) error {
	id := c.Params("id")
	var sos models.SOSAlert

	_, err := db.Client.
		From("sos_alerts").
		Select("*", "", false).
		Eq("id", id).
		Single().
		ExecuteTo(&sos)

	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": err.Error()})
	}

	return c.JSON(sos)
}

// getTrustedContacts retrieves trusted contacts for a user
func getTrustedContacts(userID string) ([]models.TrustedContact, error) {
	var contacts []models.TrustedContact
	
	_, err := db.Client.
		From("trusted_contacts").
		Select("*", "", false).
		Eq("user_id", userID).
		ExecuteTo(&contacts)
	
	return contacts, err
}

// notifyContacts sends notifications to trusted contacts and creates notification records
func notifyContacts(contacts []models.TrustedContact, sos models.SOSAlert) {
	log.Printf("🚨 SOS Alert for user %s at location %f, %f", sos.UserID, sos.Latitude, sos.Longitude)
	
	// Get user profile to include name in alerts
	var profile models.Profile
	_, err := db.Client.
		From("profiles").
		Select("*", "", false).
		Eq("id", sos.UserID).
		Single().
		ExecuteTo(&profile)
	
	userName := "Someone"
	if err == nil && profile.FullName != "" {
		userName = profile.FullName
	}
	
	for _, contact := range contacts {
		log.Printf("📱 Notifying contact: %s (%s) - %s", contact.Name, contact.Phone, contact.Email)
		
		// Create notification record
		notification := models.Notification{
			ID:        uuid.New().String(),
			UserID:    contact.UserID,
			SOSID:     sos.ID,
			Channel:   "SMS",
			Status:    "pending",
			CreatedAt: time.Now().Format(time.RFC3339),
		}
		
		// Send SMS via Twilio if phone number is available
		if contact.Phone != "" {
			go func(phone string, notificationID string) {
				sid, err := services.SendSOSAlert(userName, phone, sos.Latitude, sos.Longitude, sos.Timestamp)
				
				// Update notification status based on delivery result
				status := "sent"
				if err != nil {
					log.Printf("Error sending SMS: %v", err)
					status = "failed"
				}
				
				// Update notification record with status
				updateData := map[string]interface{}{
					"status": status,
					"external_id": sid,
				}
				_, _, err = db.Client.From("notifications").
					Update(updateData, "id", "eq").
					Eq("id", notificationID).
					Execute()
				if err != nil {
					log.Printf("Error updating notification status: %v", err)
				}
			}(contact.Phone, notification.ID)
		}
		
		// Insert notification record
		_, _, err := db.Client.From("notifications").
			Insert(notification, false, "", "representation", "").
			Execute()
		if err != nil {
			log.Printf("Error creating notification record: %v", err)
		}
		
		// TODO: Future enhancements
		// 1. Send email via SendGrid if email is available
		// 2. Send push notification via FCM
		// 3. Make phone call via Twilio Voice for critical alerts
	}
}

// GetAnalytics returns analytics data for a user
func GetAnalytics(c *fiber.Ctx) error {
	userID := c.Params("user_id")
	
	// Get SOS alerts count
	var sosAlerts []models.SOSAlert
	_, err := db.Client.
		From("sos_alerts").
		Select("*", "", false).
		Eq("user_id", userID).
		ExecuteTo(&sosAlerts)
	
	if err != nil {
		log.Printf("Error getting SOS alerts: %v", err)
		return c.Status(500).JSON(fiber.Map{"error": "Failed to get analytics data"})
	}
	
	// Get trusted contacts count
	var contacts []models.TrustedContact
	_, err = db.Client.
		From("trusted_contacts").
		Select("*", "", false).
		Eq("user_id", userID).
		ExecuteTo(&contacts)
	
	if err != nil {
		log.Printf("Error getting trusted contacts: %v", err)
		return c.Status(500).JSON(fiber.Map{"error": "Failed to get analytics data"})
	}
	
	// Get notifications count
	var notifications []models.Notification
	_, err = db.Client.
		From("notifications").
		Select("*", "", false).
		Eq("user_id", userID).
		ExecuteTo(&notifications)
	
	if err != nil {
		log.Printf("Error getting notifications: %v", err)
		// Don't fail analytics if notifications table doesn't exist yet
		notifications = []models.Notification{}
	}
	
	// Calculate analytics
	analytics := fiber.Map{
		"total_sos_alerts":  len(sosAlerts),
		"total_contacts":    len(contacts),
		"total_notifications": len(notifications),
		"recent_alerts":     sosAlerts[:min(5, len(sosAlerts))], // Last 5 alerts
		"alerts_by_month":   getAlertsByMonth(sosAlerts),
		"notification_stats": getNotificationStats(notifications),
	}
	
	return c.JSON(analytics)
}

// HealthCheck returns the health status of the API
func HealthCheck(c *fiber.Ctx) error {
	// Test database connection
	var testResult []map[string]interface{}
	_, err := db.Client.From("sos_alerts").Select("count", "", false).ExecuteTo(&testResult)
	
	dbStatus := "connected"
	if err != nil {
		dbStatus = "error: " + err.Error()
	}
	
	return c.JSON(fiber.Map{
		"status":  "healthy",
		"message": "Women Safety Assistant API is running",
		"timestamp": time.Now().Format(time.RFC3339),
		"database": dbStatus,
	})
}

// Helper function to get alerts grouped by month
func getAlertsByMonth(alerts []models.SOSAlert) map[string]int {
	monthlyCount := make(map[string]int)
	
	for _, alert := range alerts {
		if alert.CreatedAt != "" {
			// Parse the timestamp and extract month-year
			if t, err := time.Parse(time.RFC3339, alert.CreatedAt); err == nil {
				monthKey := t.Format("2006-01")
				monthlyCount[monthKey]++
			}
		}
	}
	
	return monthlyCount
}

// Helper function to get minimum of two integers
func min(a, b int) int {
	if a < b {
		return a
	}
	return b
}

// Helper function to get notification statistics
func getNotificationStats(notifications []models.Notification) map[string]int {
	stats := map[string]int{
		"total":      len(notifications),
		"sent":       0,
		"delivered":  0,
		"failed":     0,
		"sms":        0,
		"email":      0,
		"push":       0,
	}
	
	for _, notification := range notifications {
		// Count by status
		if notification.Status == "sent" {
			stats["sent"]++
		} else if notification.Status == "delivered" {
			stats["delivered"]++
		} else if notification.Status == "failed" {
			stats["failed"]++
		}
		
		// Count by channel
		if notification.Channel == "SMS" {
			stats["sms"]++
		} else if notification.Channel == "Email" {
			stats["email"]++
		} else if notification.Channel == "Push" {
			stats["push"]++
		}
	}
	
	return stats
}

// GetNotifications returns all notifications for a user
func GetNotifications(c *fiber.Ctx) error {
	userID := c.Params("user_id")
	
	var notifications []models.Notification
	_, err := db.Client.
		From("notifications").
		Select("*", "", false).
		Eq("user_id", userID).
		Order("created_at", &postgrest.OrderOpts{Ascending: false}).
		ExecuteTo(&notifications)
	
	if err != nil {
		log.Printf("Error getting notifications: %v", err)
		return c.Status(500).JSON(fiber.Map{"error": "Failed to get notifications"})
	}
	
	return c.JSON(fiber.Map{
		"notifications": notifications,
		"total":         len(notifications),
	})
}

// GetNotificationsBySOS returns all notifications for a specific SOS alert
func GetNotificationsBySOS(c *fiber.Ctx) error {
	sosID := c.Params("sos_id")
	
	var notifications []models.Notification
	_, err := db.Client.
		From("notifications").
		Select("*", "", false).
		Eq("sos_id", sosID).
		Order("created_at", &postgrest.OrderOpts{Ascending: false}).
		ExecuteTo(&notifications)
	
	if err != nil {
		log.Printf("Error getting notifications for SOS: %v", err)
		return c.Status(500).JSON(fiber.Map{"error": "Failed to get notifications"})
	}
	
	return c.JSON(fiber.Map{
		"notifications": notifications,
		"total":         len(notifications),
	})
}
