-- Add unique constraint for category and key combination
ALTER TABLE public.site_settings 
ADD CONSTRAINT site_settings_category_key_unique UNIQUE (category, key);