-- Simplify projects INSERT policy - just allow authenticated users to insert
DROP POLICY IF EXISTS "projects_insert" ON public.projects;

CREATE POLICY "projects_insert"
ON public.projects
FOR INSERT
TO authenticated
WITH CHECK (true);