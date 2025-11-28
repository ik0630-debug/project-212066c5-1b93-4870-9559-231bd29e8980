-- Update NULL created_by with a real user ID from existing data
UPDATE public.projects 
SET created_by = 'f6fdfc8c-0fa6-4b3f-a74d-68a4b064e617'
WHERE created_by IS NULL;

-- Now set NOT NULL constraint
ALTER TABLE public.projects 
ALTER COLUMN created_by SET NOT NULL;