-- Allow everyone to read site settings (public data)
CREATE POLICY "Everyone can view settings"
ON public.site_settings
FOR SELECT
USING (true);