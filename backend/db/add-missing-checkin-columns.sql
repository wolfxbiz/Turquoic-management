-- Migration: Add missing columns to daily_check_ins table
-- These columns exist in the entity but are missing from the actual database

-- Add block_reason_category column
ALTER TABLE daily_check_ins 
ADD COLUMN IF NOT EXISTS block_reason_category TEXT;

-- Add block_reason_text column  
ALTER TABLE daily_check_ins 
ADD COLUMN IF NOT EXISTS block_reason_text VARCHAR(120);

-- Add helper_user_id column with foreign key
ALTER TABLE daily_check_ins 
ADD COLUMN IF NOT EXISTS helper_user_id UUID REFERENCES users(id) ON DELETE SET NULL;
