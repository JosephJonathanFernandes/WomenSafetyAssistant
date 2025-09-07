package config

import (
	"log"
	"os"

	"github.com/joho/godotenv"
)

var SupabaseURL string
var SupabaseKey string

func LoadConfig() {
	err := godotenv.Load()
	if err != nil {
		log.Println("No .env file found, using system env")
	}
	SupabaseURL = os.Getenv("SUPABASE_URL")
	SupabaseKey = os.Getenv("SUPABASE_KEY")
}
