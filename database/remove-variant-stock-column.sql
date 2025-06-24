-- Remove stock column from product_variants table
-- This script should be run in Supabase SQL Editor to clean up the schema

-- Drop the stock column from product_variants table
ALTER TABLE public.product_variants DROP COLUMN IF EXISTS stock;

-- Verify the change
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'product_variants' 
AND table_schema = 'public'
ORDER BY ordinal_position; 