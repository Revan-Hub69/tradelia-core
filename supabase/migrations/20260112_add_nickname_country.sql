-- Migration: Add nickname and country_code to user_profiles
-- Date: 2026-01-12
-- Description: Adds nickname (display name) and country_code fields for registration
-- Requirements: 6.6

-- Add nickname column (3-20 characters, alphanumeric + underscore)
ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS nickname VARCHAR(20);

-- Add country_code column (2-letter ISO code)
ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS country_code CHAR(2);

-- Add constraint for nickname format (alphanumeric + underscore, 3-20 chars)
DO $ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'valid_nickname'
  ) THEN
    ALTER TABLE user_profiles
    ADD CONSTRAINT valid_nickname CHECK (
      nickname IS NULL OR (
        LENGTH(nickname) >= 3 AND 
        LENGTH(nickname) <= 20 AND 
        nickname ~ '^[a-zA-Z0-9_]+$'
      )
    );
  END IF;
END $;

-- Add constraint for country_code format (any valid ISO 3166-1 alpha-2 code)
-- Accepts any 2 uppercase letters (A-Z)
DO $ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'valid_country_iso'
  ) THEN
    ALTER TABLE user_profiles
    ADD CONSTRAINT valid_country_iso CHECK (
      country_code IS NULL OR country_code ~ '^[A-Z]{2}$'
    );
  END IF;
END $;

-- Create index for nickname lookups (optional, for future uniqueness checks)
CREATE INDEX IF NOT EXISTS idx_user_profiles_nickname ON user_profiles(nickname);

COMMENT ON COLUMN user_profiles.nickname IS 'User display name (3-20 chars, alphanumeric + underscore)';
COMMENT ON COLUMN user_profiles.country_code IS 'ISO 3166-1 alpha-2 country code (any valid 2-letter code)';
