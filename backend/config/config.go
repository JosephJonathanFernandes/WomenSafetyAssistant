package config

import (
	"log"
	"os"

	"github.com/joho/godotenv"
)

var SupabaseURL string
var SupabaseKey string

func LoadConfig() {
	// Try loading from current dir and backend/.env so it works regardless of CWD
	if err := godotenv.Load(); err != nil {
		_ = godotenv.Load("backend/.env")
	}

	SupabaseURL = os.Getenv("SUPABASE_URL")
	SupabaseKey = os.Getenv("SUPABASE_KEY")

	if SupabaseURL == "" || SupabaseKey == "" {
		log.Fatal("Missing SUPABASE_URL or SUPABASE_KEY. Ensure backend/.env exists or set env vars.")
	}
}
