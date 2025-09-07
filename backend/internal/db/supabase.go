package db

import (
	"log"

	"github.com/supabase-community/postgrest-go"
	"women-safety-backend/config"
)

var Client *postgrest.Client

func InitDB() {
	config.LoadConfig()
	Client = postgrest.NewClient(config.SupabaseURL+"/rest/v1", config.SupabaseKey, nil)
	log.Println("✅ Supabase connected")
}
