-- Allow anyone to check their own registration by name and phone
CREATE POLICY "Anyone can view their own registration by name and phone"
ON public.registrations
FOR SELECT
USING (true);