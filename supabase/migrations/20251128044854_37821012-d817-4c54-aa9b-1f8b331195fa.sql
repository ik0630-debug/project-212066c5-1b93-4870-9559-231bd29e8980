-- Fix projects SELECT policy to allow creators to see their newly created projects
DROP POLICY IF EXISTS "projects_select" ON public.projects;

CREATE POLICY "projects_select"
ON public.projects
FOR SELECT
TO authenticated
USING (
  -- Either a project member OR the creator
  is_project_member(auth.uid(), id) OR created_by = auth.uid()
);