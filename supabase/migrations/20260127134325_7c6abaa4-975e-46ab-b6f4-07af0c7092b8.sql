-- Create teams table
CREATE TABLE public.teams (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  team_id TEXT NOT NULL UNIQUE,
  team_name TEXT NOT NULL,
  event_type TEXT NOT NULL CHECK (event_type IN ('Morning', 'Afternoon')),
  event_name TEXT NOT NULL,
  team_size INTEGER NOT NULL CHECK (team_size >= 2 AND team_size <= 6),
  leader_name TEXT NOT NULL,
  leader_email TEXT NOT NULL,
  leader_phone TEXT NOT NULL,
  leader_college TEXT,
  leader_department TEXT,
  members JSONB NOT NULL DEFAULT '[]'::jsonb,
  status TEXT NOT NULL DEFAULT 'OPEN' CHECK (status IN ('OPEN', 'FULL')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create registrations table
CREATE TABLE public.registrations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  registration_id TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  college TEXT NOT NULL,
  department TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  morning_event TEXT NOT NULL,
  afternoon_event TEXT NOT NULL,
  registration_type TEXT NOT NULL CHECK (registration_type IN ('SOLO', 'CREATE_TEAM', 'JOIN_TEAM')),
  team_id TEXT,
  team_name TEXT,
  is_team_leader BOOLEAN NOT NULL DEFAULT false,
  registered_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.registrations ENABLE ROW LEVEL SECURITY;

-- Create public read/write policies for teams (no auth required for this event registration system)
CREATE POLICY "Allow public to read teams" 
ON public.teams 
FOR SELECT 
USING (true);

CREATE POLICY "Allow public to insert teams" 
ON public.teams 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Allow public to update teams" 
ON public.teams 
FOR UPDATE 
USING (true);

-- Create public insert policy for registrations (append-only for public)
CREATE POLICY "Allow public to insert registrations" 
ON public.registrations 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Allow public to read registrations" 
ON public.registrations 
FOR SELECT 
USING (true);

-- Create indexes for faster lookups
CREATE INDEX idx_teams_team_id ON public.teams(team_id);
CREATE INDEX idx_teams_event_name ON public.teams(event_name);
CREATE INDEX idx_teams_status ON public.teams(status);
CREATE INDEX idx_registrations_email ON public.registrations(email);
CREATE INDEX idx_registrations_team_id ON public.registrations(team_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_teams_updated_at
BEFORE UPDATE ON public.teams
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime for teams table (so team joins can be seen in real-time if needed)
ALTER PUBLICATION supabase_realtime ADD TABLE public.teams;