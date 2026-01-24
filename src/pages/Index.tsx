import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import FireworkCanvas from '@/components/FireworkCanvas';
import CountdownTimer from '@/components/CountdownTimer';
import heroBg from '@/assets/hero-bg.jpg';
import { Sparkles, Calendar, MapPin, Users } from 'lucide-react';

const Index = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroBg})` }}
      >
        {/* Dark Overlay with gradient */}
        <div className="absolute inset-0 bg-gradient-hero" />
        
        {/* Subtle animated particles overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_0%,_hsl(20_10%_5%_/_0.6)_100%)]" />
      </div>

      {/* Firework Canvas */}
      <FireworkCanvas />

      {/* Content */}
      <div className="relative z-20 flex min-h-screen flex-col items-center justify-center px-4 py-12 pointer-events-none">
        <div className="text-center max-w-4xl mx-auto">
          {/* Club Name */}
          <p 
            className={`text-sm md:text-base uppercase tracking-[0.3em] text-muted-foreground mb-4 transition-all duration-1000 ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
            style={{ transitionDelay: '200ms' }}
          >
            P. A. English Language Club presents
          </p>

          {/* Event Name */}
          <h1 
            className={`font-display text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-bold text-foreground text-glow-strong mb-2 transition-all duration-1000 ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
            style={{ transitionDelay: '400ms' }}
          >
            Utsavam 6.0
          </h1>

          {/* Edition Badge */}
          <div 
            className={`inline-flex items-center gap-2 bg-primary/20 backdrop-blur-sm border border-primary/30 rounded-full px-4 py-1.5 mb-6 transition-all duration-1000 ${
              isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
            }`}
            style={{ transitionDelay: '600ms' }}
          >
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Sixth Edition</span>
          </div>

          {/* Tagline */}
          <p 
            className={`text-lg md:text-xl lg:text-2xl text-muted-foreground font-light mb-8 max-w-2xl mx-auto transition-all duration-1000 ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
            style={{ transitionDelay: '800ms' }}
          >
            Where culture meets celebration. Experience the magic of art, music, and creativity.
          </p>

          {/* Event Details */}
          <div 
            className={`flex flex-wrap justify-center gap-6 md:gap-8 mb-6 transition-all duration-1000 ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
            style={{ transitionDelay: '1000ms' }}
          >
            <div className="flex items-center gap-2 text-foreground/80">
              <Calendar className="w-5 h-5 text-primary" />
              <span className="text-sm md:text-base">4th March 2026</span>
            </div>
            <div className="flex items-center gap-2 text-foreground/80">
              <MapPin className="w-5 h-5 text-secondary" />
              <span className="text-sm md:text-base">P. A. College of Engineering and Technology</span>
            </div>
          </div>

          {/* Countdown Timer */}
          <div 
            className={`mb-10 transition-all duration-1000 ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
            style={{ transitionDelay: '1100ms' }}
          >
            <CountdownTimer />
          </div>

          {/* CTA Buttons */}
          <div 
            className={`flex flex-col sm:flex-row gap-4 justify-center flex-wrap transition-all duration-1000 pointer-events-auto ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
            style={{ transitionDelay: '1200ms' }}
          >
            <Link to="/register">
              <Button variant="hero" size="xl" className="group">
                <span>Register Now</span>
                <Sparkles className="w-5 h-5 transition-transform group-hover:rotate-12" />
              </Button>
            </Link>
            <Link to="/events">
              <Button variant="heroOutline" size="xl">
                Explore Events
              </Button>
            </Link>
          </div>

          {/* Footer hint */}
          <p 
            className={`mt-12 text-xs text-muted-foreground/60 transition-all duration-1000 ${
              isLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            style={{ transitionDelay: '1400ms' }}
          >
            Click or tap anywhere to celebrate ✨
          </p>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background/80 to-transparent pointer-events-none z-15" />
    </div>
  );
};

export default Index;
