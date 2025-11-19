-- Remove file size limit from site-images bucket
UPDATE storage.buckets 
SET file_size_limit = NULL
WHERE id = 'site-images';