-- Fix projects INSERT policy with explicit checks
DROP POLICY IF EXISTS "projects_insert" ON public.projects;

-- Create a simpler, more explicit INSERT policy
CREATE POLICY "projects_insert"
ON public.projects
FOR INSERT
TO authenticated
WITH CHECK (
  -- Must be authenticated
  auth.uid() IS NOT NULL
  AND
  -- Must be the creator
  created_by = auth.uid()
);