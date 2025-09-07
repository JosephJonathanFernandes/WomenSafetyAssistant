-- Fix for the location column issue in sos_alerts table

-- First, check if the location column exists
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'sos_alerts' AND column_name = 'location') THEN
        -- Add the location column if it doesn't exist
        ALTER TABLE sos_alerts ADD COLUMN location JSONB;
    END IF;
END $$;

-- Update existing records to have a valid location value
UPDATE sos_alerts
SET location = jsonb_build_object(
    'latitude', latitude,
    'longitude', longitude,
    'timestamp', created_at
)
WHERE location IS NULL;

-- Ensure the column is not nullable for future inserts
ALTER TABLE sos_alerts ALTER COLUMN location SET NOT NULL;

-- Add comment to explain the column
COMMENT ON COLUMN sos_alerts.location IS 'JSON object containing latitude, longitude, and timestamp';