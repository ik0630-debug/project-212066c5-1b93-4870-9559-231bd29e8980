-- Fix projects table INSERT policy
-- Drop the existing policy
DROP POLICY IF EXISTS "Users can create projects" ON public.projects;

-- Create a more permissive INSERT policy for authenticated users
CREATE POLICY "Authenticated users can create projects" 
ON public.projects 
FOR INSERT 
TO authenticated
WITH CHECK (
  auth.uid() = created_by
);