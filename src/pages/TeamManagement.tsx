import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  ArrowLeft, Users, Search, Crown, User, Mail, 
  Sun, Sunset, Loader2, AlertCircle
} from 'lucide-react';
import heroBg from '@/assets/hero-bg.jpg';
import { GOOGLE_SHEET_WEBAPP_URL } from '@/config/googleSheet';

// Types for team data fetched from Google Sheets
interface TeamRecord {
  teamId: string;
  teamName: string;
  eventId: string;
  eventName: string;
  role: 'Leader' | 'Member';
  session: 'morning' | 'afternoon';
}

interface FetchedRegistration {
  Name: string;
  Email: string;
  Phone: string;
  College: string;
  Department: string;
  MorningEventID: string;
  MorningEventName: string;
  MorningTeamID: string;
  MorningTeamName: string;
  AfternoonEventID: string;
  AfternoonEventName: string;
  AfternoonTeamID: string;
  AfternoonTeamName: string;
  Role: string;
  RegistrationType: string;
  Timestamp: string;
}

const TeamManagement = () => {
  const { toast } = useToast();
  const [searchEmail, setSearchEmail] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [morningTeams, setMorningTeams] = useState<TeamRecord[]>([]);
  const [afternoonTeams, setAfternoonTeams] = useState<TeamRecord[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSearch = async () => {
    const email = searchEmail.trim().toLowerCase();
    
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast({ title: 'Please enter a valid email address', variant: 'destructive' });
      return;
    }

    setIsSearching(true);
    setErrorMessage(null);
    setMorningTeams([]);
    setAfternoonTeams([]);

    try {
      // Fetch from Google Sheets via GET request
      const url = `${GOOGLE_SHEET_WEBAPP_URL}?email=${encodeURIComponent(email)}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch team data');
      }

      const data = await response.json();
      
      // Parse the response - expecting an array of registration records
      const registrations: FetchedRegistration[] = data.registrations || data || [];
      
      // Process registrations to extract team info
      const morning: TeamRecord[] = [];
      const afternoon: TeamRecord[] = [];

      registrations.forEach((reg: FetchedRegistration) => {
        // Morning team
        if (reg.MorningTeamID && reg.MorningTeamID.trim() !== '') {
          morning.push({
            teamId: reg.MorningTeamID,
            teamName: reg.MorningTeamName || 'Unnamed Team',
            eventId: reg.MorningEventID,
            eventName: reg.MorningEventName || reg.MorningEventID,
            role: reg.Role as 'Leader' | 'Member',
            session: 'morning'
          });
        }

        // Afternoon team
        if (reg.AfternoonTeamID && reg.AfternoonTeamID.trim() !== '') {
          afternoon.push({
            teamId: reg.AfternoonTeamID,
            teamName: reg.AfternoonTeamName || 'Unnamed Team',
            eventId: reg.AfternoonEventID,
            eventName: reg.AfternoonEventName || reg.AfternoonEventID,
            role: reg.Role as 'Leader' | 'Member',
            session: 'afternoon'
          });
        }
      });

      setMorningTeams(morning);
      setAfternoonTeams(afternoon);
      setHasSearched(true);

      const total = morning.length + afternoon.length;
      if (total === 0) {
        toast({ title: 'No teams found', description: 'You are not part of any team yet.', variant: 'destructive' });
      } else {
        toast({ title: `Found ${total} team${total > 1 ? 's' : ''}` });
      }
    } catch (error) {
      console.error('Error fetching team data:', error);
      setErrorMessage('Unable to fetch team data. Please try again later.');
      toast({ 
        title: 'Error fetching data', 
        description: 'Please check your connection and try again.',
        variant: 'destructive' 
      });
    } finally {
      setIsSearching(false);
    }
  };

  const renderTeamCard = (team: TeamRecord) => {
    const isMorning = team.session === 'morning';
    
    return (
      <Card key={`${team.session}-${team.teamId}`} className="bg-card/60 backdrop-blur-sm border-border/50 overflow-hidden">
        <div className={`${isMorning ? 'bg-primary/10' : 'bg-secondary/10'} border-b border-border/50 p-4 md:p-6`}>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-3">
              {isMorning ? (
                <Sun className="w-6 h-6 text-primary" />
              ) : (
                <Sunset className="w-6 h-6 text-secondary" />
              )}
              <div>
                <h2 className="font-display text-xl font-bold text-foreground">
                  {team.teamName}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {isMorning ? 'Morning' : 'Afternoon'} Session
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge 
                variant="outline" 
                className={isMorning ? 'border-primary/50 text-primary' : 'border-secondary/50 text-secondary'}
              >
                {team.teamId}
              </Badge>
              <Badge className={team.role === 'Leader' ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'}>
                {team.role === 'Leader' ? (
                  <Crown className="w-3 h-3 mr-1" />
                ) : (
                  <User className="w-3 h-3 mr-1" />
                )}
                {team.role}
              </Badge>
            </div>
          </div>
        </div>
        <CardContent className="p-4 md:p-6">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="font-medium text-foreground">Event:</span>
            <span>{team.eventName}</span>
          </div>
        </CardContent>
      </Card>
    );
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
          <p className="text-muted-foreground">
            View your morning and afternoon teams
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
              <div className="flex-1 relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder="Enter your registered email address"
                  value={searchEmail}
                  onChange={(e) => setSearchEmail(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && !isSearching && handleSearch()}
                  className="pl-10 bg-input/50 border-border/50"
                  disabled={isSearching}
                />
              </div>
              <Button 
                onClick={handleSearch} 
                disabled={isSearching} 
                className="gap-2"
              >
                {isSearching ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
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
            <p className="text-xs text-muted-foreground mt-3">
              Enter the email you used during registration to view your teams
            </p>
          </CardContent>
        </Card>

        {/* Error State */}
        {errorMessage && (
          <Card className="bg-destructive/10 border-destructive/30 mb-8">
            <CardContent className="py-6 text-center">
              <AlertCircle className="w-10 h-10 text-destructive mx-auto mb-3" />
              <p className="text-destructive">{errorMessage}</p>
              <Button 
                variant="outline" 
                onClick={handleSearch}
                className="mt-4"
                disabled={isSearching}
              >
                Try Again
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Results */}
        {hasSearched && !errorMessage && (
          <div className="space-y-6">
            {/* Morning Teams */}
            {morningTeams.length > 0 && (
              <div>
                <h2 className="font-display text-lg text-primary flex items-center gap-2 mb-4">
                  <Sun className="w-5 h-5" />
                  Morning Teams
                </h2>
                <div className="space-y-4">
                  {morningTeams.map(team => renderTeamCard(team))}
                </div>
              </div>
            )}

            {/* Afternoon Teams */}
            {afternoonTeams.length > 0 && (
              <div>
                <h2 className="font-display text-lg text-secondary flex items-center gap-2 mb-4">
                  <Sunset className="w-5 h-5" />
                  Afternoon Teams
                </h2>
                <div className="space-y-4">
                  {afternoonTeams.map(team => renderTeamCard(team))}
                </div>
              </div>
            )}

            {/* No Teams Found */}
            {morningTeams.length === 0 && afternoonTeams.length === 0 && (
              <Card className="bg-card/60 backdrop-blur-sm border-border/50">
                <CardContent className="py-12 text-center">
                  <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-display text-xl text-foreground mb-2">
                    No Teams Found
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    You are not part of any team yet. Register now to join or create a team!
                  </p>
                  <Link to="/register">
                    <Button variant="default" className="gap-2">
                      <Users className="w-4 h-4" />
                      Register Now
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Initial State */}
        {!hasSearched && !errorMessage && (
          <Card className="bg-card/40 backdrop-blur-sm border-border/30">
            <CardContent className="py-12 text-center">
              <Search className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
              <h3 className="font-display text-xl text-muted-foreground mb-2">
                Enter Your Email to Get Started
              </h3>
              <p className="text-sm text-muted-foreground/70">
                Your team data is securely stored and fetched from our database
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default TeamManagement;
