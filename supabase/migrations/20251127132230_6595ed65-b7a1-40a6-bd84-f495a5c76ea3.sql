
-- Create projects table
CREATE TABLE public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  slug TEXT NOT NULL UNIQUE,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create project_members table for access control
CREATE TABLE public.project_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('owner', 'admin', 'editor', 'viewer')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(project_id, user_id)
);

-- Enable RLS
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_members ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check project membership
CREATE OR REPLACE FUNCTION public.is_project_member(_user_id UUID, _project_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.project_members
    WHERE user_id = _user_id AND project_id = _project_id
  );
$$;

-- Create security definer function to check project role
CREATE OR REPLACE FUNCTION public.has_project_role(_user_id UUID, _project_id UUID, _role TEXT)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.project_members
    WHERE user_id = _user_id 
      AND project_id = _project_id 
      AND role = _role
  );
$$;

-- RLS policies for projects table
CREATE POLICY "Users can view their projects"
  ON public.projects
  FOR SELECT
  USING (public.is_project_member(auth.uid(), id));

CREATE POLICY "Users can create projects"
  ON public.projects
  FOR INSERT
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Project owners and admins can update projects"
  ON public.projects
  FOR UPDATE
  USING (
    public.has_project_role(auth.uid(), id, 'owner') OR 
    public.has_project_role(auth.uid(), id, 'admin')
  );

CREATE POLICY "Only project owners can delete projects"
  ON public.projects
  FOR DELETE
  USING (public.has_project_role(auth.uid(), id, 'owner'));

-- RLS policies for project_members table
CREATE POLICY "Users can view members of their projects"
  ON public.project_members
  FOR SELECT
  USING (public.is_project_member(auth.uid(), project_id));

CREATE POLICY "Project owners can manage members"
  ON public.project_members
  FOR ALL
  USING (public.has_project_role(auth.uid(), project_id, 'owner'));

-- Create indexes for performance
CREATE INDEX idx_projects_created_by ON public.projects(created_by);
CREATE INDEX idx_projects_slug ON public.projects(slug);
CREATE INDEX idx_project_members_project_id ON public.project_members(project_id);
CREATE INDEX idx_project_members_user_id ON public.project_members(user_id);

-- Create trigger for updating updated_at
CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON public.projects
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default project for existing data
INSERT INTO public.projects (name, description, slug, is_active)
VALUES ('기본 프로젝트', '기존 데이터를 위한 기본 프로젝트', 'default', true);
