import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle2, Home, Gamepad2, User, Clock, Users, Copy, Check, Sun, Sunset } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import heroBg from '@/assets/hero-bg.jpg';

interface RegistrationPayload {
  registrationId: string;
  name: string;
  email: string;
  phone: string;
  college: string;
  department: string;
  morningEventId: string;
  morningEventType: 'solo' | 'pair' | 'group';
  morningTeamId: string | null;
  afternoonEventId: string;
  afternoonTeamId: string | null;
  role: 'Leader' | 'Member';
  registrationType: 'SOLO' | 'MORNING_CREATE' | 'MORNING_JOIN' | 'AFTERNOON_CREATE' | 'AFTERNOON_JOIN';
  timestamp: string;
}

const RegistrationSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoaded, setIsLoaded] = useState(false);
  const [showConfetti, setShowConfetti] = useState(true);
  const [copiedMorningTeamId, setCopiedMorningTeamId] = useState(false);
  const [copiedAfternoonTeamId, setCopiedAfternoonTeamId] = useState(false);

  // Safely extract state with fallbacks to prevent crashes
  const registration = location.state?.registration as RegistrationPayload | undefined;
  const generatedMorningTeamId = location.state?.generatedMorningTeamId as string | undefined;
  const generatedAfternoonTeamId = location.state?.generatedAfternoonTeamId as string | undefined;
  const morningEventName = location.state?.morningEventName as string | undefined;
  const afternoonEventName = location.state?.afternoonEventName as string | undefined;

  useEffect(() => {
    // Redirect to home if no registration data (prevents crash on direct access)
    if (!registration) {
      navigate('/', { replace: true });
      return;
    }
    setIsLoaded(true);
    const timer = setTimeout(() => setShowConfetti(false), 3000);
    return () => clearTimeout(timer);
  }, [registration, navigate]);

  const copyMorningTeamId = () => {
    const teamId = generatedMorningTeamId || registration?.morningTeamId;
    if (teamId) {
      navigator.clipboard.writeText(teamId);
      setCopiedMorningTeamId(true);
      setTimeout(() => setCopiedMorningTeamId(false), 2000);
      toast({ title: 'Morning Team ID copied to clipboard!' });
    }
  };

  const copyAfternoonTeamId = () => {
    const teamId = generatedAfternoonTeamId || registration?.afternoonTeamId;
    if (teamId) {
      navigator.clipboard.writeText(teamId);
      setCopiedAfternoonTeamId(true);
      setTimeout(() => setCopiedAfternoonTeamId(false), 2000);
      toast({ title: 'Afternoon Team ID copied to clipboard!' });
    }
  };

  if (!registration) return null;

  const hasMorningTeam = registration.morningTeamId !== null;
  const hasAfternoonTeam = registration.afternoonTeamId !== null;
  const createdMorningTeam = generatedMorningTeamId !== undefined;
  const createdAfternoonTeam = generatedAfternoonTeamId !== undefined;

  const getMorningEventTypeLabel = () => {
    if (registration.morningEventType === 'solo') return 'Solo';
    if (registration.morningEventType === 'pair') return 'Pair';
    return 'Group';
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background */}
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat -z-10"
        style={{ backgroundImage: `url(${heroBg})` }}
      >
        <div className="absolute inset-0 bg-gradient-hero" />
        <div className="absolute inset-0 bg-background/70" />
      </div>

      {/* Confetti Effect */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-[fall_3s_ease-in-out_forwards]"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                fontSize: `${Math.random() * 10 + 10}px`
              }}
            >
              {['✨', '🎉', '🌟', '⭐'][Math.floor(Math.random() * 4)]}
            </div>
          ))}
        </div>
      )}

      <div className="relative z-10 px-4 py-12 md:py-20 max-w-2xl mx-auto">
        {/* Success Icon */}
        <div 
          className={`flex justify-center mb-6 transition-all duration-700 ${
            isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
          }`}
        >
          <div className="relative">
            <div className="absolute inset-0 bg-primary/30 blur-2xl rounded-full animate-pulse-glow" />
            <div className="relative w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center border-2 border-primary">
              <CheckCircle2 className="w-12 h-12 text-primary" />
            </div>
          </div>
        </div>

        {/* Header */}
        <div 
          className={`text-center mb-8 transition-all duration-700 ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
          style={{ transitionDelay: '200ms' }}
        >
          <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground text-glow mb-3">
            You're Registered! 🎉
          </h1>
          <p className="text-lg text-muted-foreground">
            {/* Safe access: use optional chaining and fallback to prevent crash if name is undefined */}
            Welcome to Utsavam 6.0, {registration?.name?.split(' ')?.[0] || 'Participant'}!
          </p>
        </div>

        {/* Morning Team ID Card - Only shown for morning team creators */}
        {createdMorningTeam && generatedMorningTeamId && (
          <Card 
            className={`bg-primary/10 border-primary/30 mb-4 transition-all duration-700 ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
            style={{ transitionDelay: '300ms' }}
          >
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center gap-2 mb-3">
                <Sun className="w-5 h-5 text-primary" />
                <h3 className="font-display text-lg font-semibold text-foreground">Morning Team ID</h3>
              </div>
              <div className="flex items-center justify-center gap-3 mb-3">
                <span className="font-mono text-2xl md:text-3xl font-bold text-primary tracking-widest">
                  {generatedMorningTeamId}
                </span>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={copyMorningTeamId}
                  className="gap-2"
                >
                  {copiedMorningTeamId ? (
                    <>
                      <Check className="w-4 h-4" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Copy
                    </>
                  )}
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                Share this with your morning teammates so they can join your team!
              </p>
            </CardContent>
          </Card>
        )}

        {/* Afternoon Team ID Card - Only shown for afternoon team creators */}
        {createdAfternoonTeam && generatedAfternoonTeamId && (
          <Card 
            className={`bg-secondary/10 border-secondary/30 mb-6 transition-all duration-700 ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
            style={{ transitionDelay: '350ms' }}
          >
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center gap-2 mb-3">
                <Sunset className="w-5 h-5 text-secondary" />
                <h3 className="font-display text-lg font-semibold text-foreground">Afternoon Team ID</h3>
              </div>
              <div className="flex items-center justify-center gap-3 mb-3">
                <span className="font-mono text-2xl md:text-3xl font-bold text-secondary tracking-widest">
                  {generatedAfternoonTeamId}
                </span>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={copyAfternoonTeamId}
                  className="gap-2"
                >
                  {copiedAfternoonTeamId ? (
                    <>
                      <Check className="w-4 h-4" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Copy
                    </>
                  )}
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                Share this with your afternoon teammates so they can join your team!
              </p>
            </CardContent>
          </Card>
        )}

        {/* Registration Summary */}
        <Card 
          className={`bg-card/60 backdrop-blur-sm border-border/50 mb-8 transition-all duration-700 ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
          style={{ transitionDelay: '400ms' }}
        >
          <CardContent className="p-6 space-y-6">
            {/* Name Section */}
            <div className="flex items-center gap-4 pb-4 border-b border-border/50">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                <User className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="font-display text-xl text-foreground">{registration.name}</p>
                <p className="text-sm text-muted-foreground">{registration.college}</p>
              </div>
            </div>

            {/* Events Section */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                Your Selected Events
              </h3>
              
              <div className="grid gap-3">
                {/* Morning Event */}
                <div className="flex items-center gap-3 p-3 rounded-lg bg-primary/10 border border-primary/30">
                  <Sun className="w-5 h-5 text-primary" />
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{morningEventName || registration.morningEventId}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3" /> Morning Session • {getMorningEventTypeLabel()}
                    </p>
                  </div>
                  {hasMorningTeam && (
                    <div className="text-right">
                      <p className="text-xs font-mono text-primary">{registration.morningTeamId}</p>
                      <p className="text-xs text-muted-foreground">
                        {createdMorningTeam ? 'Team Leader' : 'Team Member'}
                      </p>
                    </div>
                  )}
                </div>

                {/* Afternoon Event */}
                <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/10 border border-secondary/30">
                  <Sunset className="w-5 h-5 text-secondary" />
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{afternoonEventName || registration.afternoonEventId}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3" /> Afternoon Session • Group
                    </p>
                  </div>
                  {hasAfternoonTeam && (
                    <div className="text-right">
                      <p className="text-xs font-mono text-secondary">{registration.afternoonTeamId}</p>
                      <p className="text-xs text-muted-foreground">
                        {createdAfternoonTeam ? 'Team Leader' : 'Team Member'}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Team Info Summary */}
            {(hasMorningTeam || hasAfternoonTeam) && (
              <div className="p-3 rounded-lg bg-muted/20 border border-border/30">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-foreground">Team Summary</span>
                </div>
                <div className="space-y-1 text-xs text-muted-foreground">
                  {hasMorningTeam && (
                    <p>Morning Team: <span className="font-mono text-primary">{registration.morningTeamId}</span></p>
                  )}
                  {hasAfternoonTeam && (
                    <p>Afternoon Team: <span className="font-mono text-secondary">{registration.afternoonTeamId}</span></p>
                  )}
                  <p className="text-muted-foreground/70 mt-2 italic">
                    ⚠️ Morning and afternoon teams are separate – share the correct Team ID with your teammates!
                  </p>
                </div>
              </div>
            )}

            {/* Registration ID */}
            <div className="pt-4 border-t border-border/50">
              <p className="text-xs text-muted-foreground text-center">
                Registration ID: <span className="font-mono text-foreground/80">{registration.registrationId}</span>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div 
          className={`space-y-4 transition-all duration-700 ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
          style={{ transitionDelay: '600ms' }}
        >
          <Link to="/" className="block">
            <Button variant="hero" size="xl" className="w-full group">
              <Home className="w-5 h-5" />
              <span>Back to Home</span>
            </Button>
          </Link>

          <Link to="/extras" className="block">
            <Button variant="heroOutline" size="xl" className="w-full group">
              <Gamepad2 className="w-5 h-5" />
              <span>Explore Utsavam Extras</span>
              <span className="text-xs text-muted-foreground">(Optional)</span>
            </Button>
          </Link>
        </div>

        {/* Footer Note */}
        <p 
          className={`text-center text-sm text-muted-foreground mt-8 transition-all duration-700 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ transitionDelay: '800ms' }}
        >
          A confirmation email has been sent to {registration.email}
        </p>
      </div>

      <style>{`
        @keyframes fall {
          0% {
            transform: translateY(-10vh) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(110vh) rotate(720deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default RegistrationSuccess;
