-- Make position column nullable since it's optional in the signup form
ALTER TABLE public.profiles ALTER COLUMN position DROP NOT NULL;