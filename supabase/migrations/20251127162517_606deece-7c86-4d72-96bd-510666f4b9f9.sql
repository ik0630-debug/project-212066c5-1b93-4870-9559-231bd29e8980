-- Drop all existing policies on projects table
DROP POLICY IF EXISTS "Users can view their projects" ON public.projects;
DROP POLICY IF EXISTS "Project owners and admins can update projects" ON public.projects;
DROP POLICY IF EXISTS "Only project owners can delete projects" ON public.projects;
DROP POLICY IF EXISTS "Authenticated users can create projects" ON public.projects;

-- Create new simplified policies
-- Allow authenticated users to insert projects where they are the creator
CREATE POLICY "Allow authenticated users to create projects"
ON public.projects
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = created_by);

-- Allow users to view projects they are members of
CREATE POLICY "Allow users to view their projects"
ON public.projects
FOR SELECT
TO authenticated
USING (is_project_member(auth.uid(), id));

-- Allow project owners and admins to update projects
CREATE POLICY "Allow owners and admins to update projects"
ON public.projects
FOR UPDATE
TO authenticated
USING (has_project_role(auth.uid(), id, 'owner') OR has_project_role(auth.uid(), id, 'admin'))
WITH CHECK (has_project_role(auth.uid(), id, 'owner') OR has_project_role(auth.uid(), id, 'admin'));

-- Allow only project owners to delete projects
CREATE POLICY "Allow owners to delete projects"
ON public.projects
FOR DELETE
TO authenticated
USING (has_project_role(auth.uid(), id, 'owner'));