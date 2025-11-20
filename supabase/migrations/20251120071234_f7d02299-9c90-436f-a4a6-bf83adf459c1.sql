-- Make phone field nullable in registrations table since we're using form_data for all fields
ALTER TABLE public.registrations 
ALTER COLUMN phone DROP NOT NULL;