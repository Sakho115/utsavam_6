import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { CheckCircle, XCircle, BookOpen } from 'lucide-react';
import GameCompletionScreen from './GameCompletionScreen';

interface Question {
  definition: string;
  options: string[];
  correct: number;
}

const QUESTIONS: Question[] = [
  {
    definition: "A feeling of great happiness and triumph",
    options: ["Sorrow", "Elation", "Anxiety", "Boredom"],
    correct: 1
  },
  {
    definition: "To make something larger or more extensive",
    options: ["Shrink", "Delete", "Expand", "Compress"],
    correct: 2
  },
  {
    definition: "A person who travels to a sacred place for religious reasons",
    options: ["Tourist", "Pilgrim", "Wanderer", "Explorer"],
    correct: 1
  },
  {
    definition: "Extremely beautiful and delicate",
    options: ["Ordinary", "Ugly", "Exquisite", "Plain"],
    correct: 2
  },
  {
    definition: "The action of working together to achieve a goal",
    options: ["Competition", "Isolation", "Conflict", "Collaboration"],
    correct: 3
  },
];

const GuessTheWord = () => {
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
        title="Vocabulary Star!" 
        subtitle={`You guessed ${correctCount} out of ${QUESTIONS.length} correctly!`}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_hsl(38_100%_50%_/_0.05)_0%,_transparent_50%)]" />
      
      <div className="relative z-10 container mx-auto px-4 py-8 md:py-12">
        {/* Header */}
        <div 
          className={cn(
            "text-center mb-8 transition-all duration-700",
            isLoaded ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
          )}
        >
          <div className="inline-flex items-center gap-2 bg-accent/20 border border-accent/30 rounded-full px-4 py-1.5 mb-4">
            <BookOpen className="w-4 h-4 text-accent" />
            <span className="text-sm font-medium text-accent">Guess the Word</span>
          </div>
          
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-foreground text-glow mb-3">
            Definition Game
          </h1>
          
          {/* Progress */}
          <div className="flex justify-center gap-2 mt-4">
            {QUESTIONS.map((_, i) => (
              <div 
                key={i}
                className={cn(
                  "w-3 h-3 rounded-full transition-all duration-300",
                  i < currentQuestion ? "bg-accent" :
                  i === currentQuestion ? "bg-accent/50 animate-pulse" :
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
          <p className="text-muted-foreground text-sm mb-4 text-center">
            Question {currentQuestion + 1} of {QUESTIONS.length}
          </p>
          
          {/* Definition */}
          <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 mb-6">
            <p className="text-sm text-primary/70 mb-1">Definition:</p>
            <p className="text-foreground text-lg italic">"{question.definition}"</p>
          </div>

          <p className="text-muted-foreground text-sm mb-4 text-center">
            Which word matches this definition?
          </p>

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
              {isCorrect ? "Perfect! 📚" : `The answer was: ${question.options[question.correct]}`}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default GuessTheWord;
