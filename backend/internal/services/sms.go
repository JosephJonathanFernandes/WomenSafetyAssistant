package services

import (
	"fmt"
	"log"
	"os"

	"github.com/twilio/twilio-go"
	"github.com/twilio/twilio-go/rest/api/v2010"
)

// TwilioClient is the client for Twilio SMS service
var TwilioClient *twilio.RestClient

// InitTwilioClient initializes the Twilio client
func InitTwilioClient() {
	accountSid := os.Getenv("TWILIO_ACCOUNT_SID")
	authToken := os.Getenv("TWILIO_AUTH_TOKEN")

	if accountSid == "" || authToken == "" {
		log.Println("⚠️ Twilio credentials not found. SMS notifications will be simulated.")
		return
	}

	TwilioClient = twilio.NewRestClientWithParams(twilio.ClientParams{
		Username: accountSid,
		Password: authToken,
	})

	log.Println("✅ Twilio client initialized")
}

// SendSMS sends an SMS message using Twilio
func SendSMS(to, message string) (string, error) {
	// If Twilio client is not initialized, simulate sending
	if TwilioClient == nil {
		log.Printf("📱 [SIMULATED] SMS to %s: %s", to, message)
		return "simulated-sid", nil
	}

	// Get the Twilio phone number from environment variables
	fromNumber := os.Getenv("TWILIO_PHONE_NUMBER")
	if fromNumber == "" {
		return "", fmt.Errorf("Twilio phone number not configured")
	}

	// Create the message parameters
	params := &v2010.CreateMessageParams{}
	params.SetTo(to)
	params.SetFrom(fromNumber)
	params.SetBody(message)

	// Send the message
	resp, err := TwilioClient.Api.CreateMessage(params)
	if err != nil {
		log.Printf("❌ Error sending SMS: %v", err)
		return "", err
	}

	log.Printf("✅ SMS sent to %s, SID: %s", to, *resp.Sid)
	return *resp.Sid, nil
}

// SendSOSAlert sends an SOS alert SMS to a contact
func SendSOSAlert(name, phone string, latitude, longitude float64, timestamp string) (string, error) {
	// Create the message with location information
	message := fmt.Sprintf(
		"🚨 EMERGENCY ALERT: %s needs help! Location: https://maps.google.com/?q=%f,%f (as of %s). Please contact emergency services immediately.",
		name, latitude, longitude, timestamp,
	)

	return SendSMS(phone, message)
}