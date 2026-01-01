import { useEffect, useState } from 'react';
import { Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TransitionScreenProps {
  title: string;
  subtitle: string;
  onComplete: () => void;
  duration?: number;
}

const TransitionScreen = ({ 
  title, 
  subtitle, 
  onComplete, 
  duration = 3000 
}: TransitionScreenProps) => {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + (100 / (duration / 50));
      });
    }, 50);

    const timeout = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onComplete, 500);
    }, duration);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [duration, onComplete]);

  return (
    <div 
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center bg-background transition-opacity duration-500",
        isVisible ? "opacity-100" : "opacity-0"
      )}
    >
      {/* Background effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_hsl(38_100%_50%_/_0.1)_0%,_transparent_60%)]" />
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-primary/40 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 text-center px-6 max-w-lg">
        {/* Animated icon */}
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-primary/20 mb-8 animate-pulse-glow">
          <Sparkles className="w-12 h-12 text-primary animate-spin" style={{ animationDuration: '3s' }} />
        </div>

        {/* Title */}
        <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-foreground text-glow mb-4 animate-fade-in">
          {title}
        </h2>

        {/* Subtitle */}
        <p 
          className="text-muted-foreground text-lg mb-8 animate-fade-in"
          style={{ animationDelay: '300ms' }}
        >
          {subtitle}
        </p>

        {/* Progress bar */}
        <div className="w-64 mx-auto">
          <div className="h-1.5 bg-muted/30 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-primary via-secondary to-primary rounded-full transition-all duration-100"
              style={{ 
                width: `${progress}%`,
                backgroundSize: '200% 100%',
                animation: 'shimmer 1.5s infinite linear'
              }}
            />
          </div>
          <p className="text-xs text-muted-foreground/60 mt-3">
            Loading next stage...
          </p>
        </div>
      </div>

      <style>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  );
};

export default TransitionScreen;
