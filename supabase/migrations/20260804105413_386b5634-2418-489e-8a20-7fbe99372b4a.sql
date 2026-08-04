-- Remove audit test artifacts
DELETE FROM public.quote_requests WHERE email = 'audit@mizanusa.com';
DELETE FROM public.quote_attempts;
DELETE FROM public.client_login_attempts WHERE username IN ('bruteforce-probe', '%');
DELETE FROM public.client_link_attempts
  WHERE email LIKE 'audit-probe-%@example.com';
DELETE FROM public.client_sessions WHERE client_id = 'test';
DELETE FROM auth.users WHERE email LIKE 'audit-probe-%@example.com';