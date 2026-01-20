import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  ArrowLeft, Users, Search, Crown, User, Mail, Phone, Building, Calendar,
  CheckCircle2, Clock, Copy, Check, RefreshCw, Sun, Sunset
} from 'lucide-react';
import heroBg from '@/assets/hero-bg.jpg';

interface TeamMember {
  name: string;
  email: string;
  phone: string;
  college: string;
  department: string;
  joinedAt: string;
}

interface MorningTeamData {
  teamId: string;
  teamName: string;
  eventId: string;
  eventType: 'pair' | 'group';
  requiredTeamSize: number;
  leaderName: string;
  leaderEmail: string;
  leaderPhone: string;
  members: TeamMember[];
  status: 'OPEN' | 'FULL';
  createdAt: string;
}

interface AfternoonTeamData {
  teamId: string;
  teamName: string;
  eventId: string;
  requiredTeamSize: number;
  leaderName: string;
  leaderEmail: string;
  leaderPhone: string;
  members: TeamMember[];
  status: 'OPEN' | 'FULL';
  createdAt: string;
}

const getMorningTeamsFromStorage = (): MorningTeamData[] => {
  try {
    const data = localStorage.getItem('utsavam_morning_teams');
    return data ? JSON.parse(data).teams : [];
  } catch {
    return [];
  }
};

const getAfternoonTeamsFromStorage = (): AfternoonTeamData[] => {
  try {
    const data = localStorage.getItem('utsavam_afternoon_teams');
    return data ? JSON.parse(data).teams : [];
  } catch {
    return [];
  }
};

const TeamManagement = () => {
  const { toast } = useToast();
  const [searchEmail, setSearchEmail] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [morningTeams, setMorningTeams] = useState<MorningTeamData[]>([]);
  const [afternoonTeams, setAfternoonTeams] = useState<AfternoonTeamData[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [copiedTeamId, setCopiedTeamId] = useState<string | null>(null);

  const handleSearch = () => {
    if (!searchEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(searchEmail.trim())) {
      toast({ title: 'Please enter a valid email address', variant: 'destructive' });
      return;
    }

    setIsSearching(true);
    setTimeout(() => {
      const email = searchEmail.trim().toLowerCase();
      const mTeams = getMorningTeamsFromStorage().filter(t => t.leaderEmail.toLowerCase() === email);
      const aTeams = getAfternoonTeamsFromStorage().filter(t => t.leaderEmail.toLowerCase() === email);
      
      setMorningTeams(mTeams);
      setAfternoonTeams(aTeams);
      setHasSearched(true);
      setIsSearching(false);

      const total = mTeams.length + aTeams.length;
      if (total === 0) {
        toast({ title: 'No teams found', description: 'You are not a leader of any team.', variant: 'destructive' });
      } else {
        toast({ title: `Found ${total} team${total > 1 ? 's' : ''}` });
      }
    }, 500);
  };

  const copyTeamId = (teamId: string) => {
    navigator.clipboard.writeText(teamId);
    setCopiedTeamId(teamId);
    setTimeout(() => setCopiedTeamId(null), 2000);
    toast({ title: 'Team ID copied!' });
  };

  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
  });

  const renderTeamCard = (team: MorningTeamData | AfternoonTeamData, isMorning: boolean) => (
    <Card key={team.teamId} className="bg-card/60 backdrop-blur-sm border-border/50 overflow-hidden">
      <div className={`${isMorning ? 'bg-primary/10' : 'bg-secondary/10'} border-b border-border/50 p-4 md:p-6`}>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-2">
            {isMorning ? <Sun className="w-5 h-5 text-primary" /> : <Sunset className="w-5 h-5 text-secondary" />}
            <div>
              <h2 className="font-display text-xl font-bold text-foreground">{team.teamName}</h2>
              <p className="text-xs text-muted-foreground">{isMorning ? 'Morning' : 'Afternoon'} • {team.eventId}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-background/50 px-3 py-2 rounded-lg">
              <span className="font-mono font-bold" style={{ color: isMorning ? 'hsl(var(--primary))' : 'hsl(var(--secondary))' }}>
                {team.teamId}
              </span>
              <Button variant="ghost" size="sm" onClick={() => copyTeamId(team.teamId)} className="h-6 w-6 p-0">
                {copiedTeamId === team.teamId ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
              </Button>
            </div>
            <Badge className={team.status === 'FULL' ? 'bg-secondary/20 text-secondary' : 'bg-primary/20 text-primary'}>
              {team.status === 'FULL' ? <CheckCircle2 className="w-3 h-3 mr-1" /> : <Clock className="w-3 h-3 mr-1" />}
              {team.members.length + 1}/{team.requiredTeamSize}
            </Badge>
          </div>
        </div>
      </div>
      <CardContent className="p-4 md:p-6 space-y-4">
        <div className="flex items-center gap-3 p-3 bg-primary/5 rounded-lg">
          <Crown className="w-5 h-5 text-primary" />
          <div>
            <p className="font-medium text-foreground">{team.leaderName}</p>
            <p className="text-xs text-muted-foreground">{team.leaderEmail} • {team.leaderPhone}</p>
          </div>
        </div>
        {team.members.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">No members yet. Share Team ID: <span className="font-mono font-bold">{team.teamId}</span></p>
        ) : (
          <div className="space-y-2">
            {team.members.map((m, i) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-muted/10 rounded-lg">
                <User className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium text-foreground">{m.name}</p>
                  <p className="text-xs text-muted-foreground">{m.email}</p>
                </div>
              </div>
            ))}
          </div>
        )}
        <p className="text-xs text-muted-foreground pt-2 border-t border-border/30">Created {formatDate(team.createdAt)}</p>
      </CardContent>
    </Card>
  );

  return (
    <div className="relative min-h-screen">
      <div className="fixed inset-0 bg-cover bg-center bg-no-repeat -z-10" style={{ backgroundImage: `url(${heroBg})` }}>
        <div className="absolute inset-0 bg-gradient-hero" />
        <div className="absolute inset-0 bg-background/85" />
      </div>

      <div className="relative z-10 px-4 py-8 md:py-12 max-w-4xl mx-auto">
        <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" /><span>Back to Home</span>
        </Link>

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/20 mb-4">
            <Users className="w-8 h-8 text-primary" />
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground text-glow mb-3">Team Management</h1>
          <p className="text-muted-foreground">View your morning and afternoon teams separately</p>
        </div>

        <Card className="bg-card/60 backdrop-blur-sm border-border/50 mb-8">
          <CardHeader className="pb-4">
            <CardTitle className="font-display text-xl text-foreground flex items-center gap-2">
              <Search className="w-5 h-5 text-primary" />Find Your Teams
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-3">
              <Input
                type="email"
                placeholder="Enter your email address"
                value={searchEmail}
                onChange={(e) => setSearchEmail(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="flex-1 bg-input/50 border-border/50"
              />
              <Button onClick={handleSearch} disabled={isSearching} className="gap-2">
                {isSearching ? <div className="w-4 h-4 border-2 border-t-primary-foreground rounded-full animate-spin" /> : <Search className="w-4 h-4" />}
                {isSearching ? 'Searching...' : 'Find Teams'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {hasSearched && (
          <div className="space-y-6">
            {morningTeams.length > 0 && (
              <div>
                <h2 className="font-display text-lg text-primary flex items-center gap-2 mb-4"><Sun className="w-5 h-5" />Morning Teams</h2>
                <div className="space-y-4">{morningTeams.map(t => renderTeamCard(t, true))}</div>
              </div>
            )}
            {afternoonTeams.length > 0 && (
              <div>
                <h2 className="font-display text-lg text-secondary flex items-center gap-2 mb-4"><Sunset className="w-5 h-5" />Afternoon Teams</h2>
                <div className="space-y-4">{afternoonTeams.map(t => renderTeamCard(t, false))}</div>
              </div>
            )}
            {morningTeams.length === 0 && afternoonTeams.length === 0 && (
              <Card className="bg-card/60 backdrop-blur-sm border-border/50">
                <CardContent className="py-12 text-center">
                  <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-display text-xl text-foreground mb-2">No Teams Found</h3>
                  <Link to="/register"><Button variant="hero" className="gap-2"><Users className="w-4 h-4" />Create a Team</Button></Link>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {!hasSearched && (
          <Card className="bg-card/40 backdrop-blur-sm border-border/30">
            <CardContent className="py-12 text-center">
              <Search className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
              <h3 className="font-display text-xl text-muted-foreground mb-2">Enter Your Email to Get Started</h3>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default TeamManagement;
