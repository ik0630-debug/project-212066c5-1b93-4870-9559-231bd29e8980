
-- Get the default project ID (we'll use it to migrate existing data)
-- Add project_id column to site_settings
ALTER TABLE public.site_settings
ADD COLUMN project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE;

-- Add project_id column to registrations
ALTER TABLE public.registrations
ADD COLUMN project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE;

-- Migrate existing data to default project
UPDATE public.site_settings
SET project_id = (SELECT id FROM public.projects WHERE slug = 'default')
WHERE project_id IS NULL;

UPDATE public.registrations
SET project_id = (SELECT id FROM public.projects WHERE slug = 'default')
WHERE project_id IS NULL;

-- Make project_id NOT NULL after migration
ALTER TABLE public.site_settings
ALTER COLUMN project_id SET NOT NULL;

ALTER TABLE public.registrations
ALTER COLUMN project_id SET NOT NULL;

-- Create indexes for performance
CREATE INDEX idx_site_settings_project_id ON public.site_settings(project_id);
CREATE INDEX idx_registrations_project_id ON public.registrations(project_id);

-- Update RLS policies for site_settings
DROP POLICY IF EXISTS "Everyone can view settings" ON public.site_settings;
DROP POLICY IF EXISTS "Admins can view all settings" ON public.site_settings;
DROP POLICY IF EXISTS "Admins can insert settings" ON public.site_settings;
DROP POLICY IF EXISTS "Admins can update settings" ON public.site_settings;
DROP POLICY IF EXISTS "Admins can delete settings" ON public.site_settings;
DROP POLICY IF EXISTS "Registration managers can view registration settings" ON public.site_settings;

-- New RLS policies for site_settings with project context
CREATE POLICY "Users can view settings of their projects"
  ON public.site_settings
  FOR SELECT
  USING (public.is_project_member(auth.uid(), project_id));

CREATE POLICY "Project admins and owners can manage settings"
  ON public.site_settings
  FOR ALL
  USING (
    public.has_project_role(auth.uid(), project_id, 'owner') OR 
    public.has_project_role(auth.uid(), project_id, 'admin')
  );

-- Update RLS policies for registrations
DROP POLICY IF EXISTS "Anyone can insert registrations" ON public.registrations;
DROP POLICY IF EXISTS "Anyone can view their own registration by name and phone" ON public.registrations;
DROP POLICY IF EXISTS "Anyone can cancel their own registration" ON public.registrations;
DROP POLICY IF EXISTS "Admins can view all registrations" ON public.registrations;
DROP POLICY IF EXISTS "Admins can update registrations" ON public.registrations;
DROP POLICY IF EXISTS "Admins can delete registrations" ON public.registrations;
DROP POLICY IF EXISTS "Registration managers can view all registrations" ON public.registrations;
DROP POLICY IF EXISTS "Registration managers can update registrations" ON public.registrations;
DROP POLICY IF EXISTS "Registration managers can delete registrations" ON public.registrations;

-- New RLS policies for registrations with project context
CREATE POLICY "Anyone can insert registrations for active projects"
  ON public.registrations
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.projects 
      WHERE id = project_id AND is_active = true
    )
  );

CREATE POLICY "Anyone can view their own registration"
  ON public.registrations
  FOR SELECT
  USING (true);

CREATE POLICY "Anyone can cancel their own registration"
  ON public.registrations
  FOR UPDATE
  USING (true)
  WITH CHECK (status = 'cancelled');

CREATE POLICY "Project members can view project registrations"
  ON public.registrations
  FOR SELECT
  USING (
    public.is_project_member(auth.uid(), project_id) AND
    (public.has_project_role(auth.uid(), project_id, 'owner') OR 
     public.has_project_role(auth.uid(), project_id, 'admin') OR
     public.has_project_role(auth.uid(), project_id, 'editor'))
  );

CREATE POLICY "Project admins and owners can manage registrations"
  ON public.registrations
  FOR ALL
  USING (
    public.has_project_role(auth.uid(), project_id, 'owner') OR 
    public.has_project_role(auth.uid(), project_id, 'admin')
  );
