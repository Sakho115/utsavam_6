import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MagicalSorterGame, { House, HOUSES } from '@/components/MagicalSorterGame';
import HouseReveal from '@/components/HouseReveal';
import { Sparkles, Wand2 } from 'lucide-react';
import { cn } from '@/lib/utils';

type GamePhase = 'intro' | 'sorting' | 'reveal';

const MagicalSorter = () => {
  const [phase, setPhase] = useState<GamePhase>('intro');
  const [assignedHouse, setAssignedHouse] = useState<House | null>(null);
  const [scores, setScores] = useState<Record<House, number> | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsLoaded(true);
    
    // Auto-transition from intro to sorting after a brief moment
    const timer = setTimeout(() => {
      setPhase('sorting');
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleSortingComplete = (house: House, finalScores: Record<House, number>) => {
    setAssignedHouse(house);
    setScores(finalScores);
    setPhase('reveal');
  };

  const handleBackToMiniGames = () => {
    navigate('/extras');
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  // Show house reveal
  if (phase === 'reveal' && assignedHouse && scores) {
    return (
      <HouseReveal 
        house={assignedHouse} 
        scores={scores}
        onBackToMiniGames={handleBackToMiniGames}
        onBackToHome={handleBackToHome}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_hsl(280_70%_60%_/_0.08)_0%,_transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_hsl(38_100%_50%_/_0.05)_0%,_transparent_50%)]" />
      
      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-primary/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${4 + Math.random() * 4}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 md:py-12">
        {/* Intro phase */}
        {phase === 'intro' && (
          <div className="min-h-[80vh] flex items-center justify-center">
            <div 
              className={cn(
                "text-center transition-all duration-1000",
                isLoaded ? "opacity-100 scale-100" : "opacity-0 scale-95"
              )}
            >
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-primary/20 mb-6 animate-pulse-glow">
                <Wand2 className="w-12 h-12 text-primary animate-bounce" style={{ animationDuration: '2s' }} />
              </div>
              
              <h1 className="font-display text-3xl md:text-5xl font-bold text-foreground text-glow mb-4">
                The Sorting Ceremony
              </h1>
              
              <p className="text-muted-foreground text-lg max-w-md mx-auto">
                Answer wisely, for the Sorting Hat sees all...
              </p>

              <div className="mt-8 flex justify-center gap-4">
                {(Object.keys(HOUSES) as House[]).map((house, i) => (
                  <div
                    key={house}
                    className="w-3 h-3 rounded-full animate-pulse"
                    style={{ 
                      backgroundColor: HOUSES[house].color,
                      animationDelay: `${i * 200}ms`
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Sorting phase */}
        {phase === 'sorting' && (
          <>
            {/* Header */}
            <div 
              className={cn(
                "text-center mb-8 transition-all duration-700",
                "animate-fade-in"
              )}
            >
              <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5 mb-4">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary">House Selection</span>
              </div>
              
              <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground text-glow mb-2">
                The Sorting Hat Awaits
              </h1>
              
              <p className="text-muted-foreground max-w-md mx-auto">
                Your answers will determine your house
              </p>
            </div>

            {/* Sorter game */}
            <div className="animate-fade-in" style={{ animationDelay: '300ms' }}>
              <MagicalSorterGame onComplete={handleSortingComplete} />
            </div>
          </>
        )}
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) scale(1); opacity: 0.3; }
          50% { transform: translateY(-30px) scale(1.2); opacity: 0.6; }
        }
      `}</style>
    </div>
  );
};

export default MagicalSorter;
