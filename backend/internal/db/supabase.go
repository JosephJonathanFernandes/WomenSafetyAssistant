package db

import (
	"log"
	"strings"

	"github.com/supabase-community/postgrest-go"
	"women-safety-backend/config"
)

var Client *postgrest.Client

func InitDB() {
	config.LoadConfig()

	url := strings.TrimSpace(config.SupabaseURL)
	key := strings.TrimSpace(config.SupabaseKey)

	if url == "" || key == "" {
		log.Fatalf("SUPABASE_URL or SUPABASE_KEY is empty (url_len=%d, key_len=%d). Ensure backend/.env is loaded.", len(url), len(key))
	}
	if !strings.HasPrefix(url, "http://") && !strings.HasPrefix(url, "https://") {
		log.Fatalf("SUPABASE_URL must start with http(s). Got: %q", url)
	}

	headers := map[string]string{
		"apikey":        key,
		"Authorization": "Bearer " + key,
	}
	Client = postgrest.NewClient(url+"/rest/v1", key, headers)
	
	// Set the schema to public to avoid PGRST106 error
	Client = Client.ChangeSchema("public")
	
	log.Printf("✅ Supabase client initialized (host=%s, schema=public)", url)
}
