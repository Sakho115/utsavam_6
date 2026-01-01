import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { House, HOUSES } from './MagicalSorterGame';
import { Sparkles, ArrowRight, Crown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HouseRevealProps {
  house: House;
  scores: Record<House, number>;
  onProceed: () => void;
}

const HouseReveal = ({ house, scores, onProceed }: HouseRevealProps) => {
  const [phase, setPhase] = useState<'building' | 'revealing' | 'revealed'>('building');
  const [canProceed, setCanProceed] = useState(false);

  const houseData = HOUSES[house];

  useEffect(() => {
    // Phase 1: Building suspense
    const revealTimer = setTimeout(() => {
      setPhase('revealing');
    }, 1500);

    // Phase 2: Reveal animation
    const revealedTimer = setTimeout(() => {
      setPhase('revealed');
    }, 3000);

    // Enable proceed button
    const proceedTimer = setTimeout(() => {
      setCanProceed(true);
    }, 4500);

    return () => {
      clearTimeout(revealTimer);
      clearTimeout(revealedTimer);
      clearTimeout(proceedTimer);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background overflow-hidden">
      {/* Animated background */}
      <div 
        className="absolute inset-0 transition-all duration-1000"
        style={{
          background: phase === 'revealed' 
            ? `radial-gradient(ellipse at center, ${houseData.color}20 0%, transparent 70%)`
            : 'transparent'
        }}
      />
      
      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className={cn(
              "absolute w-1 h-1 rounded-full transition-all duration-1000",
              phase === 'revealed' ? 'opacity-60' : 'opacity-20'
            )}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              backgroundColor: phase === 'revealed' ? houseData.color : 'hsl(var(--primary))',
              animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 text-center px-6 max-w-lg">
        {/* Building phase */}
        {phase === 'building' && (
          <div className="animate-pulse">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-primary/20 mb-6">
              <Sparkles className="w-12 h-12 text-primary animate-spin" style={{ animationDuration: '2s' }} />
            </div>
            <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground text-glow">
              The Sorting Hat deliberates...
            </h2>
          </div>
        )}

        {/* Revealing phase */}
        {phase === 'revealing' && (
          <div className="animate-scale-in">
            <div className="inline-flex items-center justify-center w-28 h-28 rounded-full bg-primary/30 mb-6 animate-pulse-glow">
              <Crown className="w-14 h-14 text-primary" />
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground text-glow">
              The Sorting is Complete
            </h2>
          </div>
        )}

        {/* Revealed phase */}
        {phase === 'revealed' && (
          <div className="animate-fade-in">
            {/* House crest placeholder */}
            <div 
              className="inline-flex items-center justify-center w-32 h-32 rounded-full mb-8 animate-pulse-glow"
              style={{ 
                backgroundColor: `${houseData.color}30`,
                boxShadow: `0 0 60px ${houseData.color}40, 0 0 120px ${houseData.color}20`
              }}
            >
              <Crown 
                className="w-16 h-16" 
                style={{ color: houseData.color }}
              />
            </div>

            <p className="text-muted-foreground text-lg mb-2">You belong to</p>
            
            <h1 
              className="font-display text-4xl md:text-6xl font-bold mb-4"
              style={{ 
                color: houseData.color,
                textShadow: `0 0 30px ${houseData.color}60`
              }}
            >
              {houseData.name}
            </h1>

            <p className="text-sm text-primary/70 uppercase tracking-wider mb-4">
              {houseData.trait}
            </p>

            <p className="text-muted-foreground mb-8 max-w-md mx-auto italic">
              "{houseData.description}"
            </p>

            {/* Score breakdown (subtle) */}
            <div className="flex justify-center gap-4 mb-8 text-xs text-muted-foreground/50">
              {(Object.keys(scores) as House[]).map((h) => (
                <span 
                  key={h} 
                  className={cn(
                    "transition-all",
                    h === house && "text-primary font-semibold"
                  )}
                >
                  {HOUSES[h].name.slice(0, 3)}: {scores[h]}
                </span>
              ))}
            </div>

            {/* Proceed button */}
            <Button
              variant="hero"
              size="xl"
              onClick={onProceed}
              disabled={!canProceed}
              className={cn(
                "group transition-all duration-500",
                canProceed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              )}
            >
              <span>Register to Your House</span>
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
        )}
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
      `}</style>
    </div>
  );
};

export default HouseReveal;
