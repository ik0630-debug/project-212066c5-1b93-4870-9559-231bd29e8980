-- Create page_views table for tracking visitor statistics
CREATE TABLE IF NOT EXISTS public.page_views (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  page_path TEXT NOT NULL,
  referrer TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.page_views ENABLE ROW LEVEL SECURITY;

-- Policy: Project members can view their project's page views
CREATE POLICY "Project members can view their project page views"
  ON public.page_views
  FOR SELECT
  USING (
    is_project_member(auth.uid(), project_id)
  );

-- Policy: Anyone can insert page views for active projects
CREATE POLICY "Anyone can insert page views for active projects"
  ON public.page_views
  FOR INSERT
  WITH CHECK (
    project_id IS NOT NULL
    AND EXISTS (
      SELECT 1 FROM public.projects
      WHERE projects.id = page_views.project_id
      AND projects.is_active = true
    )
  );

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_page_views_project_id ON public.page_views(project_id);
CREATE INDEX IF NOT EXISTS idx_page_views_created_at ON public.page_views(created_at);
CREATE INDEX IF NOT EXISTS idx_page_views_project_created ON public.page_views(project_id, created_at);