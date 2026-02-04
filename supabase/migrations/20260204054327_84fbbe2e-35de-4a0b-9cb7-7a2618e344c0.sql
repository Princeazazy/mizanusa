-- Create client_credentials table for client portal login
CREATE TABLE public.client_credentials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id TEXT NOT NULL UNIQUE,
    username TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    client_name TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.client_credentials ENABLE ROW LEVEL SECURITY;

-- No direct access from client - only via edge function
-- No SELECT policy means clients cannot read this table directly

-- Insert CVS Auto Sales credentials (password hashed with SHA-256)
-- Note: In production, use bcrypt or argon2 via edge function
INSERT INTO public.client_credentials (client_id, username, password_hash, client_name)
VALUES ('cvs-auto-sales', 'Cvsautosales', encode(sha256('Cvs@2026'::bytea), 'hex'), 'CVS Auto Sales Inc.');

-- Create client_sessions table to track active client sessions
CREATE TABLE public.client_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id TEXT NOT NULL REFERENCES public.client_credentials(client_id) ON DELETE CASCADE,
    session_token TEXT NOT NULL UNIQUE,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on sessions
ALTER TABLE public.client_sessions ENABLE ROW LEVEL SECURITY;

-- Create index for faster token lookups
CREATE INDEX idx_client_sessions_token ON public.client_sessions(session_token);
CREATE INDEX idx_client_sessions_expires ON public.client_sessions(expires_at);