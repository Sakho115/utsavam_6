import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Home, Gamepad2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface GameCompletionScreenProps {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
}

const GameCompletionScreen = ({ title, subtitle, children }: GameCompletionScreenProps) => {
  const navigate = useNavigate();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/90 backdrop-blur-md animate-fade-in">
      <div className="text-center p-8 max-w-md mx-4 animate-scale-in">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/20 mb-6 animate-pulse-glow">
          <Sparkles className="w-10 h-10 text-primary" />
        </div>
        
        <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground text-glow mb-3">
          {title}
        </h2>
        
        {subtitle && (
          <p className="text-muted-foreground mb-6">
            {subtitle}
          </p>
        )}

        {children}
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
          <Button 
            variant="hero" 
            size="lg" 
            onClick={() => navigate('/extras')}
            className="group"
          >
            <Gamepad2 className="w-4 h-4 mr-2" />
            <span>Back to Mini Games</span>
          </Button>
          
          <Button 
            variant="heroOutline" 
            size="lg" 
            onClick={() => navigate('/')}
            className="group"
          >
            <Home className="w-4 h-4 mr-2" />
            <span>Back to Home</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GameCompletionScreen;
