import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { CheckCircle, XCircle, FileEdit } from 'lucide-react';
import GameCompletionScreen from './GameCompletionScreen';

interface Question {
  incorrect: string;
  options: string[];
  correct: number;
}

const QUESTIONS: Question[] = [
  {
    incorrect: "She don't like pizza.",
    options: ["She doesn't like pizza.", "She not like pizza.", "She didn't likes pizza."],
    correct: 0
  },
  {
    incorrect: "Me and him went to store.",
    options: ["Me and he went to store.", "He and I went to the store.", "Him and me went to store."],
    correct: 1
  },
  {
    incorrect: "Their going to there house over they're.",
    options: ["They're going to their house over there.", "There going to they're house over their.", "Their going to they're house over there."],
    correct: 0
  },
  {
    incorrect: "I seen the movie yesterday.",
    options: ["I seened the movie yesterday.", "I saw the movie yesterday.", "I have see the movie yesterday."],
    correct: 1
  },
  {
    incorrect: "The team have won the match.",
    options: ["The team has won the match.", "The team having won the match.", "The team were won the match."],
    correct: 0
  },
];

const SentenceFixer = () => {
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
    }, 1500);
  };

  if (isComplete) {
    return (
      <GameCompletionScreen 
        title="Grammar Master!" 
        subtitle={`You fixed ${correctCount} out of ${QUESTIONS.length} sentences!`}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_hsl(280_70%_60%_/_0.05)_0%,_transparent_50%)]" />
      
      <div className="relative z-10 container mx-auto px-4 py-8 md:py-12">
        {/* Header */}
        <div 
          className={cn(
            "text-center mb-8 transition-all duration-700",
            isLoaded ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
          )}
        >
          <div className="inline-flex items-center gap-2 bg-secondary/20 border border-secondary/30 rounded-full px-4 py-1.5 mb-4">
            <FileEdit className="w-4 h-4 text-secondary" />
            <span className="text-sm font-medium text-secondary">Sentence Fixer</span>
          </div>
          
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-foreground text-glow mb-3">
            Fix the Sentence
          </h1>
          
          {/* Progress */}
          <div className="flex justify-center gap-2 mt-4">
            {QUESTIONS.map((_, i) => (
              <div 
                key={i}
                className={cn(
                  "w-3 h-3 rounded-full transition-all duration-300",
                  i < currentQuestion ? "bg-secondary" :
                  i === currentQuestion ? "bg-secondary/50 animate-pulse" :
                  "bg-muted/30"
                )}
              />
            ))}
          </div>
        </div>

        {/* Question Card */}
        <div 
          className={cn(
            "max-w-2xl mx-auto bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-6 md:p-8 transition-all duration-500",
            isLoaded ? "opacity-100 scale-100" : "opacity-0 scale-95"
          )}
        >
          <p className="text-muted-foreground text-sm mb-4 text-center">
            Question {currentQuestion + 1} of {QUESTIONS.length}
          </p>
          
          {/* Incorrect Sentence */}
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-6">
            <p className="text-sm text-red-400 mb-1">Incorrect sentence:</p>
            <p className="text-foreground text-lg italic">"{question.incorrect}"</p>
          </div>

          <p className="text-muted-foreground text-sm mb-4 text-center">
            Choose the correct version:
          </p>

          <div className="space-y-3">
            {question.options.map((option, index) => {
              const isSelected = selectedAnswer === index;
              const isCorrectAnswer = index === question.correct;
              
              return (
                <Button
                  key={index}
                  variant="outline"
                  className={cn(
                    "w-full h-auto py-4 px-4 text-left text-base transition-all duration-300 relative whitespace-normal",
                    !showResult && "hover:bg-primary/10 hover:border-primary/50",
                    showResult && isCorrectAnswer && "bg-green-500/20 border-green-500 text-green-400",
                    showResult && isSelected && !isCorrectAnswer && "bg-red-500/20 border-red-500 text-red-400"
                  )}
                  onClick={() => handleSelect(index)}
                  disabled={showResult}
                >
                  <span className="flex-1">{option}</span>
                  {showResult && isCorrectAnswer && (
                    <CheckCircle className="w-5 h-5 absolute right-4 top-1/2 -translate-y-1/2 text-green-400" />
                  )}
                  {showResult && isSelected && !isCorrectAnswer && (
                    <XCircle className="w-5 h-5 absolute right-4 top-1/2 -translate-y-1/2 text-red-400" />
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
              {isCorrect ? "Excellent grammar! 📝" : "Not quite right!"}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SentenceFixer;
