-- Add form_data column to store dynamic registration fields
ALTER TABLE public.registrations 
ADD COLUMN form_data jsonb DEFAULT '{}'::jsonb;