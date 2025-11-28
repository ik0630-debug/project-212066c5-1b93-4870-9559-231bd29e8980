-- Clean up all duplicate policies on projects table
-- Drop ALL existing policies
DROP POLICY IF EXISTS "Allow authenticated users to create projects" ON public.projects;
DROP POLICY IF EXISTS "projects_insert_policy" ON public.projects;
DROP POLICY IF EXISTS "Allow users to view their projects" ON public.projects;
DROP POLICY IF EXISTS "projects_select_policy" ON public.projects;
DROP POLICY IF EXISTS "Allow owners and admins to update projects" ON public.projects;
DROP POLICY IF EXISTS "projects_update_policy" ON public.projects;
DROP POLICY IF EXISTS "Allow owners to delete projects" ON public.projects;
DROP POLICY IF EXISTS "projects_delete_policy" ON public.projects;

-- Create clean, single policies for each operation
-- INSERT: Allow authenticated users to create projects
CREATE POLICY "projects_insert"
ON public.projects
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = created_by);

-- SELECT: Allow users to view their projects
CREATE POLICY "projects_select"
ON public.projects
FOR SELECT
TO authenticated
USING (is_project_member(auth.uid(), id));

-- UPDATE: Allow owners and admins to update
CREATE POLICY "projects_update"
ON public.projects
FOR UPDATE
TO authenticated
USING (
  has_project_role(auth.uid(), id, 'owner') 
  OR has_project_role(auth.uid(), id, 'admin')
)
WITH CHECK (
  has_project_role(auth.uid(), id, 'owner') 
  OR has_project_role(auth.uid(), id, 'admin')
);

-- DELETE: Allow owners to delete
CREATE POLICY "projects_delete"
ON public.projects
FOR DELETE
TO authenticated
USING (has_project_role(auth.uid(), id, 'owner'));