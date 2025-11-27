-- Step 1: Drop ALL existing policies
DROP POLICY IF EXISTS "Admins can delete roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can insert roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can view all roles" ON public.user_roles;
DROP POLICY IF EXISTS "Users can view their own role" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can update any profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can delete profiles" ON public.profiles;
DROP POLICY IF EXISTS "Masters and MNC admins can view all roles" ON public.user_roles;
DROP POLICY IF EXISTS "Masters and MNC admins can insert roles" ON public.user_roles;
DROP POLICY IF EXISTS "Masters and MNC admins can delete roles" ON public.user_roles;
DROP POLICY IF EXISTS "Masters and MNC admins can update any profile" ON public.profiles;
DROP POLICY IF EXISTS "Masters and MNC admins can delete profiles" ON public.profiles;

-- Drop the has_role function that depends on the enum
DROP FUNCTION IF EXISTS public.has_role(uuid, app_role);
DROP FUNCTION IF EXISTS public.is_admin(uuid);

-- Temporarily disable RLS on both tables
ALTER TABLE public.user_roles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;

-- Remove default value first
ALTER TABLE public.user_roles ALTER COLUMN role DROP DEFAULT;

-- Update the app_role enum to include new roles
ALTER TYPE public.app_role RENAME TO app_role_old;

CREATE TYPE public.app_role AS ENUM ('master', 'mnc_admin', 'project_admin', 'project_staff', 'user');

-- Update user_roles table to use new enum
ALTER TABLE public.user_roles 
  ALTER COLUMN role TYPE public.app_role 
  USING (
    CASE 
      WHEN role::text = 'admin' THEN 'mnc_admin'::public.app_role
      WHEN role::text = 'registration_manager' THEN 'project_staff'::public.app_role
      ELSE 'user'::public.app_role
    END
  );

-- Set new default value
ALTER TABLE public.user_roles ALTER COLUMN role SET DEFAULT 'user'::public.app_role;

-- Drop old enum
DROP TYPE public.app_role_old CASCADE;

-- Re-enable RLS
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Recreate has_role function with new enum
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  );
$$;

-- Create function to check if user has any admin role (master or mnc_admin)
CREATE OR REPLACE FUNCTION public.is_admin(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id 
    AND role IN ('master', 'mnc_admin')
  );
$$;

-- Recreate user_roles policies
CREATE POLICY "Masters and MNC admins can view all roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (is_admin(auth.uid()));

CREATE POLICY "Masters and MNC admins can insert roles"
ON public.user_roles
FOR INSERT
TO authenticated
WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "Masters and MNC admins can delete roles"
ON public.user_roles
FOR DELETE
TO authenticated
USING (is_admin(auth.uid()));

CREATE POLICY "Users can view their own role"
ON public.user_roles
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Recreate profiles policies  
CREATE POLICY "Masters and MNC admins can update any profile"
ON public.profiles
FOR UPDATE
TO authenticated
USING (is_admin(auth.uid()));

CREATE POLICY "Masters and MNC admins can delete profiles"
ON public.profiles
FOR DELETE
TO authenticated
USING (is_admin(auth.uid()));