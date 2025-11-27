
-- Update RLS policies to allow public access to active projects' settings
DROP POLICY IF EXISTS "Users can view settings of their projects" ON public.site_settings;

-- Allow everyone to view settings of active projects (for public pages)
CREATE POLICY "Everyone can view settings of active projects"
  ON public.site_settings
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.projects 
      WHERE id = project_id AND is_active = true
    )
  );

-- Allow project members to view all settings (including inactive projects)
CREATE POLICY "Project members can view their project settings"
  ON public.site_settings
  FOR SELECT
  USING (public.is_project_member(auth.uid(), project_id));

-- Update registrations policy to ensure project_id is set
DROP POLICY IF EXISTS "Anyone can insert registrations for active projects" ON public.registrations;

CREATE POLICY "Anyone can insert registrations for active projects"
  ON public.registrations
  FOR INSERT
  WITH CHECK (
    project_id IS NOT NULL AND
    EXISTS (
      SELECT 1 FROM public.projects 
      WHERE id = project_id AND is_active = true
    )
  );
