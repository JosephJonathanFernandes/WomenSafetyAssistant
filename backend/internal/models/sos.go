package models

import "encoding/json"

// SOSAlert matches the sos_alerts table structure
type SOSAlert struct {
    ID        string          `json:"id,omitempty"`
    UserID    string          `json:"user_id"`
    Location  json.RawMessage `json:"location,omitempty"` // JSONB field
    Timestamp string          `json:"timestamp,omitempty"`
    Status    string          `json:"status"`
    Method    string          `json:"method"`
    Latitude  float64         `json:"latitude,omitempty"`
    Longitude float64         `json:"longitude,omitempty"`
    CreatedAt string          `json:"created_at,omitempty"`
}

// TrustedContact matches the trusted_contacts table structure
type TrustedContact struct {
    ID        string `json:"id,omitempty"`
    UserID    string `json:"user_id"`
    Name      string `json:"name"`
    Phone     string `json:"phone"`
    Email     string `json:"email,omitempty"`
    Relation  string `json:"relation,omitempty"`
    CreatedAt string `json:"created_at,omitempty"`
}

// Notification matches the notifications table structure
type Notification struct {
    ID        string `json:"id,omitempty"`
    UserID    string `json:"user_id"`
    SOSID     string `json:"sos_id"`
    Channel   string `json:"channel"` // SMS, Email, Push
    Status    string `json:"status"`  // sent, failed, delivered
    CreatedAt string `json:"created_at,omitempty"`
}

// Profile matches the profiles table structure
type Profile struct {
    ID        string `json:"id,omitempty"`
    FullName  string `json:"full_name,omitempty"`
    Phone     string `json:"phone,omitempty"`
    Gender    string `json:"gender,omitempty"`
    Email     string `json:"email,omitempty"`
    Role      string `json:"role,omitempty"`
    CreatedAt string `json:"created_at,omitempty"`
}

