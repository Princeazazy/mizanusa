DELETE FROM auth.users WHERE email LIKE 'audit-probe-%@example.com';
DELETE FROM public.client_link_attempts WHERE email LIKE 'audit-probe-%@example.com';