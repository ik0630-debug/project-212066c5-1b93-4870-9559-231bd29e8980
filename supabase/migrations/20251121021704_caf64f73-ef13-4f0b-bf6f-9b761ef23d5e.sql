-- Drop existing policies first to avoid conflicts
DROP POLICY IF EXISTS "Registration managers can view all registrations" ON public.registrations;
DROP POLICY IF EXISTS "Registration managers can update registrations" ON public.registrations;
DROP POLICY IF EXISTS "Registration managers can delete registrations" ON public.registrations;
DROP POLICY IF EXISTS "Registration managers can view registration settings" ON public.site_settings;

-- Add policy for registration managers to view registrations
CREATE POLICY "Registration managers can view all registrations"
ON public.registrations
FOR SELECT
USING (
  public.has_role(auth.uid(), 'registration_manager'::app_role) OR
  public.has_role(auth.uid(), 'admin'::app_role)
);

-- Add policy for registration managers to update registrations  
CREATE POLICY "Registration managers can update registrations"
ON public.registrations
FOR UPDATE
USING (
  public.has_role(auth.uid(), 'registration_manager'::app_role) OR
  public.has_role(auth.uid(), 'admin'::app_role)
)
WITH CHECK (
  public.has_role(auth.uid(), 'registration_manager'::app_role) OR
  public.has_role(auth.uid(), 'admin'::app_role)
);

-- Add policy for registration managers to delete registrations
CREATE POLICY "Registration managers can delete registrations"
ON public.registrations
FOR DELETE
USING (
  public.has_role(auth.uid(), 'registration_manager'::app_role) OR
  public.has_role(auth.uid(), 'admin'::app_role)
);

-- Allow registration managers to view registration settings
CREATE POLICY "Registration managers can view registration settings"
ON public.site_settings
FOR SELECT
USING (
  (category = 'registration' AND public.has_role(auth.uid(), 'registration_manager'::app_role)) OR
  public.has_role(auth.uid(), 'admin'::app_role) OR
  true
);