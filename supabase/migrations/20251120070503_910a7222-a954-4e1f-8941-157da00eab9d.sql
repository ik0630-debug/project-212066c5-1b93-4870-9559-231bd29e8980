-- Make email field nullable in registrations table
ALTER TABLE public.registrations 
ALTER COLUMN email DROP NOT NULL;