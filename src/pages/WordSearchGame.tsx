import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import WordSearchGrid, { WORDS_TO_FIND } from '@/components/WordSearchGrid';
import TransitionScreen from '@/components/TransitionScreen';
import { Sparkles, CheckCircle, Search, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const WordSearchGame = () => {
  const [foundWords, setFoundWords] = useState<string[]>([]);
  const [isComplete, setIsComplete] = useState(false);
  const [showTransition, setShowTransition] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [recentlyFound, setRecentlyFound] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const handleWordFound = (word: string) => {
    if (!foundWords.includes(word)) {
      const newFoundWords = [...foundWords, word];
      setFoundWords(newFoundWords);
      setRecentlyFound(word);
      
      // Clear the recently found highlight after animation
      setTimeout(() => setRecentlyFound(null), 1000);
      
      if (newFoundWords.length === WORDS_TO_FIND.length) {
        setTimeout(() => setIsComplete(true), 500);
      }
    }
  };

  const handleProceed = () => {
    // Show transition screen first
    setShowTransition(true);
  };

  const handleTransitionComplete = () => {
    navigate('/magical-sorter');
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_hsl(38_100%_50%_/_0.05)_0%,_transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_hsl(280_70%_60%_/_0.05)_0%,_transparent_50%)]" />
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-8 md:py-12">
        {/* Header */}
        <div 
          className={cn(
            "text-center mb-8 transition-all duration-1000",
            isLoaded ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
          )}
        >
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5 mb-4">
            <Search className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Entry Challenge</span>
          </div>
          
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-foreground text-glow mb-3">
            Word Search
          </h1>
          
          <p className="text-muted-foreground max-w-md mx-auto text-sm sm:text-base">
            Find all the hidden words to unlock your entry to Utsavam 6.0
          </p>
        </div>

        <div className="max-w-4xl mx-auto grid md:grid-cols-[1fr_280px] gap-6 md:gap-8">
          {/* Grid Section */}
          <div 
            className={cn(
              "bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-3 sm:p-4 md:p-6 transition-all duration-1000",
              isLoaded ? "opacity-100 scale-100" : "opacity-0 scale-95"
            )}
            style={{ transitionDelay: '200ms' }}
          >
            <WordSearchGrid onWordFound={handleWordFound} foundWords={foundWords} />
          </div>

          {/* Words List Section */}
          <div 
            className={cn(
              "bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-4 md:p-6 transition-all duration-1000",
              isLoaded ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"
            )}
            style={{ transitionDelay: '400ms' }}
          >
            <h2 className="font-display text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              Words to Find
            </h2>
            
            <div className="space-y-2">
              {WORDS_TO_FIND.map((word) => {
                const isFound = foundWords.includes(word);
                const isRecent = recentlyFound === word;
                
                return (
                  <div
                    key={word}
                    className={cn(
                      "flex items-center gap-3 py-2 px-3 rounded-lg transition-all duration-500",
                      isFound ? "bg-primary/10" : "bg-muted/20",
                      isRecent && "animate-pulse-glow"
                    )}
                  >
                    <div className={cn(
                      "w-5 h-5 rounded-full flex items-center justify-center transition-all duration-300",
                      isFound ? "bg-primary text-primary-foreground" : "bg-muted/50"
                    )}>
                      {isFound && <CheckCircle className="w-3.5 h-3.5" />}
                    </div>
                    
                    <span className={cn(
                      "font-medium tracking-wide transition-all duration-300",
                      isFound 
                        ? "text-foreground" 
                        : "text-muted-foreground/50"
                    )}>
                      {word}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Progress */}
            <div className="mt-6 pt-4 border-t border-border/50">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">Progress</span>
                <span className="text-primary font-medium">
                  {foundWords.length} / {WORDS_TO_FIND.length}
                </span>
              </div>
              <div className="h-2 bg-muted/30 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-500 rounded-full"
                  style={{ width: `${(foundWords.length / WORDS_TO_FIND.length) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Completion Overlay */}
        {isComplete && !showTransition && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-md animate-fade-in">
            <div className="text-center p-8 max-w-md mx-4 animate-scale-in">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/20 mb-6 animate-pulse-glow">
                <Sparkles className="w-10 h-10 text-primary" />
              </div>
              
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground text-glow mb-4">
                Level 1 Complete!
              </h2>
              
              <p className="text-muted-foreground mb-8">
                You've unlocked the next stage of Utsavam 6.0
              </p>
              
              <Button 
                variant="hero" 
                size="xl" 
                onClick={handleProceed}
                className="group"
              >
                <span>Continue</span>
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>
          </div>
        )}

        {/* Transition Screen */}
        {showTransition && (
          <TransitionScreen
            title="Congratulations on completing Level 1"
            subtitle="Preparing for House Selection Round..."
            onComplete={handleTransitionComplete}
            duration={3000}
          />
        )}

        {/* Instructions hint */}
        <p 
          className={cn(
            "text-center text-xs text-muted-foreground/60 mt-8 transition-all duration-1000",
            isLoaded ? "opacity-100" : "opacity-0"
          )}
          style={{ transitionDelay: '600ms' }}
        >
          Click and drag to select letters • Find words in any direction
        </p>
      </div>
    </div>
  );
};

export default WordSearchGame;
