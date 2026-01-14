import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { CheckCircle, XCircle, Zap } from 'lucide-react';
import GameCompletionScreen from './GameCompletionScreen';

interface Question {
  word: string;
  options: string[];
  correct: number;
}

const QUESTIONS: Question[] = [
  { word: 'HAPPY', options: ['Sad', 'Joyful', 'Angry', 'Tired'], correct: 1 },
  { word: 'QUICK', options: ['Slow', 'Heavy', 'Rapid', 'Quiet'], correct: 2 },
  { word: 'BRAVE', options: ['Fearful', 'Courageous', 'Weak', 'Shy'], correct: 1 },
  { word: 'SMART', options: ['Dull', 'Clever', 'Lazy', 'Loud'], correct: 1 },
  { word: 'BEAUTIFUL', options: ['Ugly', 'Plain', 'Gorgeous', 'Simple'], correct: 2 },
];

const SynonymChallenge = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const question = QUESTIONS[currentQuestion];
  const isCorrect = selectedAnswer === question.correct;

  const handleSelect = (index: number) => {
    if (showResult) return;
    
    setSelectedAnswer(index);
    setShowResult(true);
    
    if (index === question.correct) {
      setCorrectCount(prev => prev + 1);
    }

    setTimeout(() => {
      if (currentQuestion < QUESTIONS.length - 1) {
        setCurrentQuestion(prev => prev + 1);
        setSelectedAnswer(null);
        setShowResult(false);
      } else {
        setIsComplete(true);
      }
    }, 1200);
  };

  if (isComplete) {
    return (
      <GameCompletionScreen 
        title="Challenge Complete!" 
        subtitle={`You got ${correctCount} out of ${QUESTIONS.length} correct!`}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_hsl(38_100%_50%_/_0.05)_0%,_transparent_50%)]" />
      
      <div className="relative z-10 container mx-auto px-4 py-8 md:py-12">
        {/* Header */}
        <div 
          className={cn(
            "text-center mb-8 transition-all duration-700",
            isLoaded ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
          )}
        >
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5 mb-4">
            <Zap className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Rapid Synonym Challenge</span>
          </div>
          
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-foreground text-glow mb-3">
            Find the Synonym
          </h1>
          
          {/* Progress */}
          <div className="flex justify-center gap-2 mt-4">
            {QUESTIONS.map((_, i) => (
              <div 
                key={i}
                className={cn(
                  "w-3 h-3 rounded-full transition-all duration-300",
                  i < currentQuestion ? "bg-primary" :
                  i === currentQuestion ? "bg-primary/50 animate-pulse" :
                  "bg-muted/30"
                )}
              />
            ))}
          </div>
        </div>

        {/* Question Card */}
        <div 
          className={cn(
            "max-w-lg mx-auto bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-6 md:p-8 transition-all duration-500",
            isLoaded ? "opacity-100 scale-100" : "opacity-0 scale-95"
          )}
        >
          <p className="text-muted-foreground text-sm mb-2 text-center">
            Question {currentQuestion + 1} of {QUESTIONS.length}
          </p>
          
          <h2 className="font-display text-2xl md:text-3xl font-bold text-center text-primary mb-8">
            "{question.word}"
          </h2>

          <div className="grid grid-cols-2 gap-3">
            {question.options.map((option, index) => {
              const isSelected = selectedAnswer === index;
              const isCorrectAnswer = index === question.correct;
              
              return (
                <Button
                  key={index}
                  variant="outline"
                  className={cn(
                    "h-14 text-base transition-all duration-300 relative",
                    !showResult && "hover:bg-primary/10 hover:border-primary/50",
                    showResult && isCorrectAnswer && "bg-green-500/20 border-green-500 text-green-400",
                    showResult && isSelected && !isCorrectAnswer && "bg-red-500/20 border-red-500 text-red-400"
                  )}
                  onClick={() => handleSelect(index)}
                  disabled={showResult}
                >
                  {option}
                  {showResult && isCorrectAnswer && (
                    <CheckCircle className="w-4 h-4 absolute right-3 text-green-400" />
                  )}
                  {showResult && isSelected && !isCorrectAnswer && (
                    <XCircle className="w-4 h-4 absolute right-3 text-red-400" />
                  )}
                </Button>
              );
            })}
          </div>

          {showResult && (
            <p className={cn(
              "text-center mt-6 font-medium animate-fade-in",
              isCorrect ? "text-green-400" : "text-red-400"
            )}>
              {isCorrect ? "Correct! 🎉" : `The answer was: ${question.options[question.correct]}`}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SynonymChallenge;
