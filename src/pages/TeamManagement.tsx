
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  ArrowLeft, 
  Users, 
  Search, 
  Crown, 
  User, 
  Mail, 
  Phone, 
  Building, 
  Calendar,
  CheckCircle2,
  Clock,
  Copy,
  Check,
  RefreshCw
} from 'lucide-react';
import heroBg from '@/assets/hero-bg.jpg';
import { supabase } from '@/integrations/supabase/client';
import type { TeamMember, TeamData } from '@/lib/teamService';

// Mapped type for display
interface DisplayTeamData {
  teamId: string;
  teamName: string;
  eventName: string;
  teamSize: number;
  leaderName: string;
  leaderEmail: string;
  leaderPhone: string;
  members: TeamMember[];
  status: 'OPEN' | 'FULL';
  createdAt: string;
}

const TeamManagement = () => {
  const { toast } = useToast();
  const [searchEmail, setSearchEmail] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [myTeams, setMyTeams] = useState<DisplayTeamData[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [copiedTeamId, setCopiedTeamId] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!searchEmail.trim()) {
      toast({ title: 'Please enter your email address', variant: 'destructive' });
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(searchEmail.trim())) {
      toast({ title: 'Please enter a valid email address', variant: 'destructive' });
      return;
    }

    setIsSearching(true);
    
    try {
      const email = searchEmail.trim().toLowerCase();
      
      // Find teams where user is the leader from Lovable Cloud
      const { data: teams, error } = await supabase
        .from('teams')
        .select('*')
        .ilike('leader_email', email);
      
      if (error) {
        console.error('Error fetching teams:', error);
        toast({ title: 'Failed to fetch teams', variant: 'destructive' });
        setIsSearching(false);
        return;
      }

      // Map database structure to display structure
      const leaderTeams: DisplayTeamData[] = (teams || []).map(team => ({
        teamId: team.team_id,
        teamName: team.team_name,
        eventName: team.event_name,
        teamSize: team.team_size,
        leaderName: team.leader_name,
        leaderEmail: team.leader_email,
        leaderPhone: team.leader_phone,
        members: Array.isArray(team.members) ? (team.members as unknown as TeamMember[]) : [],
        status: team.status as 'OPEN' | 'FULL',
        createdAt: team.created_at,
      }));
      
      setMyTeams(leaderTeams);
      setHasSearched(true);
      setIsSearching(false);

      if (leaderTeams.length === 0) {
        toast({ 
          title: 'No teams found', 
          description: 'You are not a leader of any team with this email.',
          variant: 'destructive' 
        });
      } else {
        toast({ 
          title: `Found ${leaderTeams.length} team${leaderTeams.length > 1 ? 's' : ''}`,
          description: 'Your teams are displayed below.'
        });
      }
    } catch (error) {
      console.error('Error searching teams:', error);
      toast({ title: 'An error occurred while searching', variant: 'destructive' });
      setIsSearching(false);
    }
  };

  const copyTeamId = (teamId: string) => {
    navigator.clipboard.writeText(teamId);
    setCopiedTeamId(teamId);
    setTimeout(() => setCopiedTeamId(null), 2000);
    toast({ title: 'Team ID copied to clipboard!' });
  };

  const refreshTeams = () => {
    if (searchEmail.trim()) {
      handleSearch();
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="relative min-h-screen">
      {/* Background */}
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat -z-10"
        style={{ backgroundImage: `url(${heroBg})` }}
      >
        <div className="absolute inset-0 bg-gradient-hero" />
        <div className="absolute inset-0 bg-background/85" />
      </div>

      <div className="relative z-10 px-4 py-8 md:py-12 max-w-4xl mx-auto">
        {/* Back Button */}
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/20 mb-4">
            <Users className="w-8 h-8 text-primary" />
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground text-glow mb-3">
            Team Management
          </h1>
          <p className="text-muted-foreground max-w-md mx-auto">
            View your teams, track member registrations, and share your Team ID
          </p>
        </div>

        {/* Search Card */}
        <Card className="bg-card/60 backdrop-blur-sm border-border/50 mb-8">
          <CardHeader className="pb-4">
            <CardTitle className="font-display text-xl text-foreground flex items-center gap-2">
              <Search className="w-5 h-5 text-primary" />
              Find Your Teams
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <Label htmlFor="searchEmail" className="sr-only">Email Address</Label>
                <Input
                  id="searchEmail"
                  type="email"
                  placeholder="Enter your email address"
                  value={searchEmail}
                  onChange={(e) => setSearchEmail(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  className="bg-input/50 border-border/50 focus:border-primary"
                />
              </div>
              <Button 
                onClick={handleSearch}
                disabled={isSearching}
                className="gap-2"
              >
                {isSearching ? (
                  <>
                    <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    Searching...
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4" />
                    Find Teams
                  </>
                )}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Enter the email you used during registration to view teams you lead
            </p>
          </CardContent>
        </Card>

        {/* Teams List */}
        {hasSearched && (
          <div className="space-y-6">
            {/* Refresh Button */}
            {myTeams.length > 0 && (
              <div className="flex justify-end">
                <Button variant="outline" size="sm" onClick={refreshTeams} className="gap-2">
                  <RefreshCw className="w-4 h-4" />
                  Refresh
                </Button>
              </div>
            )}

            {myTeams.length === 0 ? (
              <Card className="bg-card/60 backdrop-blur-sm border-border/50">
                <CardContent className="py-12 text-center">
                  <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-display text-xl text-foreground mb-2">No Teams Found</h3>
                  <p className="text-muted-foreground mb-4">
                    You haven't created any teams with this email address.
                  </p>
                  <Link to="/register">
                    <Button variant="hero" className="gap-2">
                      <Users className="w-4 h-4" />
                      Create a Team
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              myTeams.map((team) => (
                <Card 
                  key={team.teamId} 
                  className="bg-card/60 backdrop-blur-sm border-border/50 overflow-hidden"
                >
                  {/* Team Header */}
                  <div className="bg-primary/10 border-b border-border/50 p-4 md:p-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Crown className="w-5 h-5 text-primary" />
                          <h2 className="font-display text-2xl font-bold text-foreground">
                            {team.teamName}
                          </h2>
                        </div>
                        <p className="text-sm text-muted-foreground">{team.eventName}</p>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                        {/* Team ID with Copy */}
                        <div className="flex items-center gap-2 bg-background/50 px-3 py-2 rounded-lg">
                          <span className="text-xs text-muted-foreground">Team ID:</span>
                          <span className="font-mono font-bold text-primary">{team.teamId}</span>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => copyTeamId(team.teamId)}
                            className="h-6 w-6 p-0"
                          >
                            {copiedTeamId === team.teamId ? (
                              <Check className="w-3 h-3 text-primary" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </Button>
                        </div>
                        
                        {/* Status Badge */}
                        <Badge 
                          variant={team.status === 'FULL' ? 'secondary' : 'default'}
                          className={`${
                            team.status === 'FULL' 
                              ? 'bg-secondary/20 text-secondary border-secondary/30' 
                              : 'bg-primary/20 text-primary border-primary/30'
                          }`}
                        >
                          {team.status === 'FULL' ? (
                            <>
                              <CheckCircle2 className="w-3 h-3 mr-1" />
                              Full ({team.members.length + 1}/{team.teamSize})
                            </>
                          ) : (
                            <>
                              <Clock className="w-3 h-3 mr-1" />
                              Open ({team.members.length + 1}/{team.teamSize})
                            </>
                          )}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <CardContent className="p-4 md:p-6 space-y-6">
                    {/* Team Leader */}
                    <div>
                      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3 flex items-center gap-2">
                        <Crown className="w-4 h-4 text-primary" />
                        Team Leader (You)
                      </h3>
                      <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                            <Crown className="w-5 h-5 text-primary" />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-foreground">{team.leaderName}</p>
                            <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground mt-1">
                              <span className="flex items-center gap-1">
                                <Mail className="w-3 h-3" />
                                {team.leaderEmail}
                              </span>
                              <span className="flex items-center gap-1">
                                <Phone className="w-3 h-3" />
                                {team.leaderPhone}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Team Members */}
                    <div>
                      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3 flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        Team Members ({team.members.length})
                      </h3>
                      
                      {team.members.length === 0 ? (
                        <div className="bg-muted/20 border border-border/30 rounded-lg p-6 text-center">
                          <Users className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                          <p className="text-sm text-muted-foreground">
                            No members have joined yet
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Share your Team ID: <span className="font-mono font-bold text-primary">{team.teamId}</span>
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {team.members.map((member, index) => (
                            <div 
                              key={index} 
                              className="bg-muted/10 border border-border/30 rounded-lg p-4"
                            >
                              <div className="flex items-start gap-3">
                                <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center flex-shrink-0">
                                  <User className="w-5 h-5 text-secondary" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="font-medium text-foreground">{member.name}</p>
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 mt-2 text-xs text-muted-foreground">
                                    <span className="flex items-center gap-1 truncate">
                                      <Mail className="w-3 h-3 flex-shrink-0" />
                                      {member.email}
                                    </span>
                                    <span className="flex items-center gap-1">
                                      <Phone className="w-3 h-3 flex-shrink-0" />
                                      {member.phone}
                                    </span>
                                    <span className="flex items-center gap-1 truncate">
                                      <Building className="w-3 h-3 flex-shrink-0" />
                                      {member.college}
                                    </span>
                                    <span className="flex items-center gap-1">
                                      <Calendar className="w-3 h-3 flex-shrink-0" />
                                      Joined {formatDate(member.joinedAt)}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Team Info Footer */}
                    <div className="pt-4 border-t border-border/30 text-xs text-muted-foreground">
                      <p>Created on {formatDate(team.createdAt)}</p>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}

        {/* Initial State */}
        {!hasSearched && (
          <Card className="bg-card/40 backdrop-blur-sm border-border/30">
            <CardContent className="py-12 text-center">
              <Search className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
              <h3 className="font-display text-xl text-muted-foreground mb-2">
                Enter Your Email to Get Started
              </h3>
              <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                Use the email you registered with to view and manage your teams
              </p>
            </CardContent>
          </Card>
        )}

        {/* Footer Links */}
        <div className="mt-8 text-center space-y-2">
          <p className="text-sm text-muted-foreground">
            Want to create a new team?{' '}
            <Link to="/register" className="text-primary hover:underline">
              Register Now
            </Link>
          </p>
          <p className="text-sm text-muted-foreground">
            <Link to="/" className="text-primary hover:underline">
              Back to Home
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default TeamManagement;

