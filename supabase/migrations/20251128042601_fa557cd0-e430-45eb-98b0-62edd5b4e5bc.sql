-- Create all necessary policies for projects table
-- First ensure RLS is enabled
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- INSERT: Allow authenticated users to create projects where they are the creator
CREATE POLICY "Allow authenticated users to create projects"
ON public.projects
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = created_by);

-- SELECT: Allow users to view projects they are members of
CREATE POLICY "Allow users to view their projects"
ON public.projects
FOR SELECT
TO authenticated
USING (is_project_member(auth.uid(), id));

-- UPDATE: Allow project owners and admins to update projects
CREATE POLICY "Allow owners and admins to update projects"
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

-- DELETE: Allow only project owners to delete projects
CREATE POLICY "Allow owners to delete projects"
ON public.projects
FOR DELETE
TO authenticated
USING (has_project_role(auth.uid(), id, 'owner'));