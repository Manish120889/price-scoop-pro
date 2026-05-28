
-- 1. Fix privilege escalation on user_roles: split ALL into explicit per-command policies with WITH CHECK
DROP POLICY IF EXISTS "Admins manage roles" ON public.user_roles;

CREATE POLICY "Admins insert roles"
ON public.user_roles
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins update roles"
ON public.user_roles
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins delete roles"
ON public.user_roles
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- 2. program_days: only return days for published programs (or admins)
DROP POLICY IF EXISTS "Program days public read" ON public.program_days;

CREATE POLICY "Program days public read"
ON public.program_days
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.programs p
    WHERE p.id = program_days.program_id
      AND (p.published OR public.has_role(auth.uid(), 'admin'::app_role))
  )
);

-- 3. profiles: restrict read to authenticated users
DROP POLICY IF EXISTS "Profiles public read" ON public.profiles;

CREATE POLICY "Profiles authenticated read"
ON public.profiles
FOR SELECT
TO authenticated
USING (true);

-- 4. Revoke execute on internal SECURITY DEFINER helpers from public/anon/authenticated.
-- These are used by triggers and RLS policies (which run as definer), not direct callers.
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM PUBLIC, anon, authenticated;
