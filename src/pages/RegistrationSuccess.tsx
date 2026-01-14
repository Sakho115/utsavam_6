import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Sparkles, CheckCircle2, Home, Gamepad2, User, Clock } from 'lucide-react';
import heroBg from '@/assets/hero-bg.jpg';

interface Registration {
  id: string;
  fullName: string;
  college: string;
  department: string;
  phone: string;
  email: string;
  morningEvent: string;
  afternoonEvent: string;
  registeredAt: string;
}

const RegistrationSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoaded, setIsLoaded] = useState(false);
  const [showConfetti, setShowConfetti] = useState(true);

  const registration = location.state?.registration as Registration | undefined;

  useEffect(() => {
    if (!registration) {
      navigate('/');
      return;
    }
    setIsLoaded(true);
    const timer = setTimeout(() => setShowConfetti(false), 3000);
    return () => clearTimeout(timer);
  }, [registration, navigate]);

  if (!registration) return null;

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
            Welcome to Utsavam 6.0, {registration.fullName.split(' ')[0]}!
          </p>
        </div>

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
                <p className="font-display text-xl text-foreground">{registration.fullName}</p>
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
                  <div className="w-3 h-3 rounded-full bg-primary" />
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{registration.morningEvent}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3" /> Morning Session • Solo
                    </p>
                  </div>
                </div>

                {/* Afternoon Event */}
                <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/10 border border-secondary/30">
                  <div className="w-3 h-3 rounded-full bg-secondary" />
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{registration.afternoonEvent}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3" /> Afternoon Session • Group
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Registration ID */}
            <div className="pt-4 border-t border-border/50">
              <p className="text-xs text-muted-foreground text-center">
                Registration ID: <span className="font-mono text-foreground/80">{registration.id}</span>
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
