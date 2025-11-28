-- Fix project_members INSERT policy to allow project creators to add themselves
-- Drop existing policies
DROP POLICY IF EXISTS "Project owners can manage members" ON public.project_members;
DROP POLICY IF EXISTS "Users can view members of their projects" ON public.project_members;

-- CREATE separate policies for each operation

-- SELECT: Members can view other members of their projects
CREATE POLICY "project_members_select"
ON public.project_members
FOR SELECT
TO authenticated
USING (is_project_member(auth.uid(), project_id));

-- INSERT: Allow two cases:
-- 1. Project owners can add members
-- 2. Project creators can add themselves as owner (for new projects)
CREATE POLICY "project_members_insert"
ON public.project_members
FOR INSERT
TO authenticated
WITH CHECK (
  -- Case 1: Already an owner of the project
  has_project_role(auth.uid(), project_id, 'owner')
  OR
  -- Case 2: Adding yourself as owner to a project you just created
  (
    user_id = auth.uid() 
    AND role = 'owner'
    AND EXISTS (
      SELECT 1 FROM projects 
      WHERE id = project_id 
      AND created_by = auth.uid()
    )
  )
);

-- UPDATE: Only owners can update member roles
CREATE POLICY "project_members_update"
ON public.project_members
FOR UPDATE
TO authenticated
USING (has_project_role(auth.uid(), project_id, 'owner'))
WITH CHECK (has_project_role(auth.uid(), project_id, 'owner'));

-- DELETE: Only owners can remove members
CREATE POLICY "project_members_delete"
ON public.project_members
FOR DELETE
TO authenticated
USING (has_project_role(auth.uid(), project_id, 'owner'));