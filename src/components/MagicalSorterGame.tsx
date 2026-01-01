import { useState, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { Wand2 } from 'lucide-react';

// House definitions
export type House = 'gryffindor' | 'ravenclaw' | 'hufflepuff' | 'slytherin';

export const HOUSES: Record<House, { name: string; description: string; color: string; trait: string }> = {
  gryffindor: {
    name: 'Gryffindor',
    description: 'Where dwell the brave at heart. Your daring, nerve, and chivalry set you apart.',
    color: 'hsl(0, 80%, 50%)',
    trait: 'Courage & Stage Presence'
  },
  ravenclaw: {
    name: 'Ravenclaw',
    description: 'Where those of wit and learning will always find their kind.',
    color: 'hsl(220, 70%, 50%)',
    trait: 'Intelligence & Language Mastery'
  },
  hufflepuff: {
    name: 'Hufflepuff',
    description: 'Where they are just and loyal, patient and unafraid of toil.',
    color: 'hsl(45, 90%, 50%)',
    trait: 'Teamwork & Empathy'
  },
  slytherin: {
    name: 'Slytherin',
    description: 'You will make real friends, those cunning folk use any means to achieve their ends.',
    color: 'hsl(140, 60%, 40%)',
    trait: 'Ambition & Strategy'
  }
};

// Answer structure with weighted scoring
interface Answer {
  text: string;
  primary: House;    // Gets 2 points
  secondary: House;  // Gets 1 point
  nextQuestion?: number; // For branching (optional)
}

interface Question {
  id: number;
  text: string;
  context?: string;
  answers: Answer[];
}

// Questions with branched paths and weighted scoring
const QUESTIONS: Question[] = [
  {
    id: 1,
    text: "You're given 60 seconds to deliver an impromptu speech. What's your approach?",
    context: "The audience is waiting...",
    answers: [
      { 
        text: "Jump in confidently, improvising as I go — passion beats perfection", 
        primary: 'gryffindor', 
        secondary: 'slytherin'
      },
      { 
        text: "Quickly structure my thoughts into a clear opening, body, and conclusion", 
        primary: 'ravenclaw', 
        secondary: 'hufflepuff'
      },
      { 
        text: "Connect with the audience first — read the room and adapt", 
        primary: 'hufflepuff', 
        secondary: 'gryffindor'
      },
      { 
        text: "Find the most persuasive angle that will win them over", 
        primary: 'slytherin', 
        secondary: 'ravenclaw'
      }
    ]
  },
  {
    id: 2,
    text: "In a heated group debate, your teammate makes a factual error. How do you respond?",
    context: "The judges are watching closely...",
    answers: [
      { 
        text: "Boldly redirect the argument, covering for them while taking the lead", 
        primary: 'gryffindor', 
        secondary: 'slytherin'
      },
      { 
        text: "Subtly correct it by rephrasing with accurate information", 
        primary: 'ravenclaw', 
        secondary: 'hufflepuff'
      },
      { 
        text: "Support them publicly, then discuss the error privately later", 
        primary: 'hufflepuff', 
        secondary: 'gryffindor'
      },
      { 
        text: "Use their mistake to pivot the argument in our favor", 
        primary: 'slytherin', 
        secondary: 'ravenclaw'
      }
    ]
  },
  {
    id: 3,
    text: "You discover a rare word that perfectly fits your essay, but your audience might not understand it. What do you do?",
    context: "Precision versus accessibility...",
    answers: [
      { 
        text: "Use it boldly — it shows mastery and the audience will learn", 
        primary: 'gryffindor', 
        secondary: 'ravenclaw'
      },
      { 
        text: "Use it with a subtle contextual explanation woven in", 
        primary: 'ravenclaw', 
        secondary: 'hufflepuff'
      },
      { 
        text: "Choose a simpler word — communication should be inclusive", 
        primary: 'hufflepuff', 
        secondary: 'ravenclaw'
      },
      { 
        text: "Use it strategically where it will have maximum impact", 
        primary: 'slytherin', 
        secondary: 'gryffindor'
      }
    ]
  },
  {
    id: 4,
    text: "Your team is stuck on a creative project with a looming deadline. What role do you naturally take?",
    context: "Time is running out...",
    answers: [
      { 
        text: "Take charge and make decisive calls to push us forward", 
        primary: 'gryffindor', 
        secondary: 'slytherin'
      },
      { 
        text: "Analyze the problem and propose the most logical solution", 
        primary: 'ravenclaw', 
        secondary: 'slytherin'
      },
      { 
        text: "Encourage the team and help everyone contribute their best", 
        primary: 'hufflepuff', 
        secondary: 'gryffindor'
      },
      { 
        text: "Find shortcuts and negotiate for what we actually need", 
        primary: 'slytherin', 
        secondary: 'ravenclaw'
      }
    ]
  },
  {
    id: 5,
    text: "You're writing a story and must choose an ending. Which resonates with you most?",
    context: "The final chapter awaits...",
    answers: [
      { 
        text: "The hero triumphs through a brave sacrifice", 
        primary: 'gryffindor', 
        secondary: 'hufflepuff'
      },
      { 
        text: "The mystery is solved through brilliant deduction", 
        primary: 'ravenclaw', 
        secondary: 'slytherin'
      },
      { 
        text: "The characters find peace through understanding and unity", 
        primary: 'hufflepuff', 
        secondary: 'ravenclaw'
      },
      { 
        text: "The underdog outsmarts everyone and claims victory", 
        primary: 'slytherin', 
        secondary: 'gryffindor'
      }
    ]
  }
];

interface MagicalSorterGameProps {
  onComplete: (house: House, scores: Record<House, number>) => void;
}

const MagicalSorterGame = ({ onComplete }: MagicalSorterGameProps) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [scores, setScores] = useState<Record<House, number>>({
    gryffindor: 0,
    ravenclaw: 0,
    hufflepuff: 0,
    slytherin: 0
  });
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const currentQuestion = QUESTIONS[currentQuestionIndex];

  const handleAnswerSelect = useCallback((answerIndex: number) => {
    if (isTransitioning) return;
    
    setSelectedAnswer(answerIndex);
    setIsTransitioning(true);

    const answer = currentQuestion.answers[answerIndex];
    
    // Update scores with weighted points
    const newScores = { ...scores };
    newScores[answer.primary] += 2;
    newScores[answer.secondary] += 1;
    setScores(newScores);

    // Transition to next question or complete
    setTimeout(() => {
      if (currentQuestionIndex < QUESTIONS.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
        setSelectedAnswer(null);
        setIsTransitioning(false);
      } else {
        // Determine winning house
        const maxScore = Math.max(...Object.values(newScores));
        const winningHouse = (Object.keys(newScores) as House[]).find(
          house => newScores[house] === maxScore
        ) as House;
        
        onComplete(winningHouse, newScores);
      }
    }, 800);
  }, [currentQuestion, currentQuestionIndex, isTransitioning, onComplete, scores]);

  return (
    <div className="w-full max-w-2xl mx-auto px-4">
      {/* Progress indicator */}
      <div className="flex items-center justify-center gap-2 mb-8">
        {QUESTIONS.map((_, index) => (
          <div
            key={index}
            className={cn(
              "w-10 h-1.5 rounded-full transition-all duration-500",
              index < currentQuestionIndex 
                ? "bg-primary" 
                : index === currentQuestionIndex 
                  ? "bg-primary/60 animate-pulse" 
                  : "bg-muted/30"
            )}
          />
        ))}
      </div>

      <p className="text-center text-sm text-muted-foreground mb-2">
        Question {currentQuestionIndex + 1} of {QUESTIONS.length}
      </p>

      {/* Question card */}
      <div 
        className={cn(
          "bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6 md:p-8 transition-all duration-500",
          isTransitioning ? "opacity-50 scale-98" : "opacity-100 scale-100"
        )}
      >
        {/* Context */}
        {currentQuestion.context && (
          <p className="text-xs text-primary/70 uppercase tracking-wider mb-3 flex items-center gap-2">
            <Wand2 className="w-3 h-3" />
            {currentQuestion.context}
          </p>
        )}

        {/* Question text */}
        <h2 className="font-display text-xl md:text-2xl font-semibold text-foreground mb-6 leading-relaxed">
          {currentQuestion.text}
        </h2>

        {/* Answers */}
        <div className="space-y-3">
          {currentQuestion.answers.map((answer, index) => (
            <button
              key={index}
              onClick={() => handleAnswerSelect(index)}
              disabled={isTransitioning}
              className={cn(
                "w-full text-left p-4 rounded-xl border transition-all duration-300",
                "hover:border-primary/50 hover:bg-primary/5",
                "focus:outline-none focus:ring-2 focus:ring-primary/30",
                selectedAnswer === index
                  ? "border-primary bg-primary/10 scale-[0.98]"
                  : "border-border/50 bg-muted/10",
                isTransitioning && selectedAnswer !== index && "opacity-50"
              )}
            >
              <span className="text-foreground/90 leading-relaxed">
                {answer.text}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Hint */}
      <p className="text-center text-xs text-muted-foreground/50 mt-6">
        Choose wisely — your answers shape your destiny
      </p>
    </div>
  );
};

export default MagicalSorterGame;
