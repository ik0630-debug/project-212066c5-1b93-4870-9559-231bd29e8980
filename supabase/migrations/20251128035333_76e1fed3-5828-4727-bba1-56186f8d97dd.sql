-- Completely reset and fix the projects table RLS policies
-- Drop all existing policies
DROP POLICY IF EXISTS "Allow authenticated users to create projects" ON public.projects;
DROP POLICY IF EXISTS "Allow users to view their projects" ON public.projects;
DROP POLICY IF EXISTS "Allow owners and admins to update projects" ON public.projects;
DROP POLICY IF EXISTS "Allow owners to delete projects" ON public.projects;

-- Disable and re-enable RLS to ensure clean state
ALTER TABLE public.projects DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- Create new policies with explicit PERMISSIVE keyword and TO public
-- This ensures maximum compatibility

-- INSERT: Allow authenticated users to create projects
CREATE POLICY "projects_insert_policy"
ON public.projects
AS PERMISSIVE
FOR INSERT
TO public
WITH CHECK (
  auth.uid() IS NOT NULL 
  AND auth.uid() = created_by
);

-- SELECT: Allow users to view their projects
CREATE POLICY "projects_select_policy"
ON public.projects
AS PERMISSIVE
FOR SELECT
TO public
USING (
  auth.uid() IS NOT NULL 
  AND is_project_member(auth.uid(), id)
);

-- UPDATE: Allow owners and admins to update projects
CREATE POLICY "projects_update_policy"
ON public.projects
AS PERMISSIVE
FOR UPDATE
TO public
USING (
  auth.uid() IS NOT NULL 
  AND (
    has_project_role(auth.uid(), id, 'owner'::text) 
    OR has_project_role(auth.uid(), id, 'admin'::text)
  )
)
WITH CHECK (
  auth.uid() IS NOT NULL 
  AND (
    has_project_role(auth.uid(), id, 'owner'::text) 
    OR has_project_role(auth.uid(), id, 'admin'::text)
  )
);

-- DELETE: Allow owners to delete projects
CREATE POLICY "projects_delete_policy"
ON public.projects
AS PERMISSIVE
FOR DELETE
TO public
USING (
  auth.uid() IS NOT NULL 
  AND has_project_role(auth.uid(), id, 'owner'::text)
);