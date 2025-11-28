-- Fix projects INSERT policy by making it PERMISSIVE
-- The issue is that the policy is RESTRICTIVE, which means ALL restrictive policies must pass
-- We need it to be PERMISSIVE (default behavior)

DROP POLICY IF EXISTS "Allow authenticated users to create projects" ON public.projects;

CREATE POLICY "Allow authenticated users to create projects"
ON public.projects
AS PERMISSIVE  -- Explicitly set as PERMISSIVE
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = created_by);