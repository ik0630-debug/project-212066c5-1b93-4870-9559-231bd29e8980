-- Create storage bucket for site images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'site-images',
  'site-images',
  true,
  5242880, -- 5MB
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
);

-- Allow admins to upload images
CREATE POLICY "Admins can upload images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'site-images' AND
  (SELECT has_role(auth.uid(), 'admin'::app_role))
);

-- Allow admins to update images
CREATE POLICY "Admins can update images"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'site-images' AND
  (SELECT has_role(auth.uid(), 'admin'::app_role))
);

-- Allow admins to delete images
CREATE POLICY "Admins can delete images"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'site-images' AND
  (SELECT has_role(auth.uid(), 'admin'::app_role))
);

-- Allow everyone to view images (public bucket)
CREATE POLICY "Public images are viewable by everyone"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'site-images');