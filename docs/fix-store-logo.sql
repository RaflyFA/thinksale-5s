-- Fix store_logo default value
-- Run this in Supabase SQL Editor

-- Update existing store_logo setting to empty string if it has placeholder value
UPDATE settings 
SET value = '', 
    updated_at = now()
WHERE key = 'store_logo' 
AND (value = '/placeholder_logo.svg' OR value IS NULL);

-- Insert store_logo setting if it doesn't exist
INSERT INTO settings (key, value, type, category, description)
VALUES ('store_logo', '', 'string', 'general', 'URL untuk logo toko yang ditampilkan di header.')
ON CONFLICT (key) DO NOTHING;

-- Verify the setting
SELECT * FROM settings WHERE key = 'store_logo'; 