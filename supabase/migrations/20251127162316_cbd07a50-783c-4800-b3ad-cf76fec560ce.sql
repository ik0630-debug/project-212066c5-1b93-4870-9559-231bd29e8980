-- Fix projects table INSERT policy to be PERMISSIVE
-- Drop the existing restrictive policy
DROP POLICY IF EXISTS "Authenticated users can create projects" ON public.projects;

-- Create a PERMISSIVE INSERT policy for authenticated users
CREATE POLICY "Authenticated users can create projects" 
ON public.projects 
AS PERMISSIVE
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = created_by);