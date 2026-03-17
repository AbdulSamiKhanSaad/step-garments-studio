
-- Create a security definer function to get an admin user_id
-- This allows customers to find an admin to message without needing SELECT on user_roles
CREATE OR REPLACE FUNCTION public.get_admin_user_id()
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT user_id FROM public.user_roles WHERE role = 'admin' LIMIT 1
$$;
