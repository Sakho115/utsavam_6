
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Clock, Users, User, ArrowLeft, CheckCircle2 } from 'lucide-react';
import heroBg from '@/assets/hero-bg.jpg';

interface Event {
  name: string;
  type: 'Solo' | 'Pair' | 'Group';
  timeSlot: 'Morning' | 'Afternoon';
  howItWorks: string[];
  skillsTested: string[];
  duration: string;
}

const morningEvents: Event[] = [
  {
    name: 'Trispark',
    type: 'Solo',
    timeSlot: 'Morning',
    howItWorks: [
      'Participants compete across multiple language-based challenges involving word association, observation, listening, and spoken expression.',
      'Tasks include identifying hidden themes, interpreting audio-visual prompts, and delivering confident spoken responses under time limits.',
      'Challenges test attention to detail, emotional understanding, vocabulary strength, and clarity of expression using both screen and web-based platforms.',
      'Top-scoring participants progress through successive rounds based on accuracy, creativity, comprehension, and overall performance.'
    ],
    skillsTested: ['Spontaneous speaking', 'Vocabulary', 'Enthusiasm', 'Timing'],
    duration: '5-7 minutes per participant'
  },
  {
    name: 'Scramble zone',
    type: 'Pair',
    timeSlot: 'Morning',
    howItWorks: [
      'Teams compete in multiple word-based challenges involving rearranging letters, conveying information verbally, and logical word discovery.',
      'Activities test vocabulary strength, communication clarity, reasoning skills, and teamwork under time constraints.',
      'Participants must collaborate effectively to decode clues, transmit information accurately, and identify hidden words using limited cues.',
      'Teams are evaluated on accuracy, creativity, communication, logic, and overall performance across all rounds.'
    ],
    skillsTested: ['Vocabulary', 'Quick thinking', 'Storytelling', 'Expression'],
    duration: '4-6 minutes per participant'
  },
  {
    name: 'Frames to Fame',
    type: 'Group',
    timeSlot: 'Morning',
    howItWorks: [
      'Teams take part in multiple interactive rounds involving storytelling, perspective-based speaking, and grammar challenges.',
      'Members collaboratively build stories, express Toast–Roast–Neutral viewpoints, and correct language errors under time pressure.',
      'Rounds test creativity, spontaneity, language accuracy, and team coordination using on-screen prompts and an online response system.',
      'Top-performing teams across rounds qualify for the next stage based on overall performance and speed.'
    ],
    skillsTested: ['Argumentation', 'Logic', 'Persuasion', 'Confidence'],
    duration: '8-10 minutes per participant'
  }
];

const afternoonEvents: Event[] = [
  {
    name: 'Wordora',
    type: 'Group',
    timeSlot: 'Afternoon',
    howItWorks: [
      'Teams participate in creative and language-based rounds combining roleplay, grammar, and quick thinking.',
      'Members perform short scenes using randomly assigned characters with minimal preparation time.',
      'Participants also identify correct parts of speech for given words under time pressure.',
      'Teams are judged on creativity, accuracy, speed, coordination, and overall performance across rounds.'
    ],
    skillsTested: ['Teamwork', 'Acting', 'Script writing', 'Coordination'],
    duration: '10-15 minutes per team'
  },
  {
    name: 'The Static chase',
    type: 'Group',
    timeSlot: 'Afternoon',
    howItWorks: [
      'Teams participate in a campus-wide static treasure hunt to locate and capture multiple hidden checkpoints called Rifts.',
      'Using a dedicated navigation website and QR-based puzzles, teams must move strategically to unlock locations within the time limit.',
      'Each captured location is permanently secured for that team after solving the puzzle and obtaining the secret code.',
      'Winners are decided based on the number of locations captured, with completion speed used as a tie-breaker.'
    ],
    skillsTested: ['General knowledge', 'Language proficiency', 'Team strategy', 'Speed'],
    duration: '45-60 minutes total'
  }
];

const EventCard = ({ event, index }: { event: Event; index: number }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), index * 150);
    return () => clearTimeout(timer);
  }, [index]);

  return (
    <Card 
      className={`bg-card/60 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-all duration-500 hover:shadow-[0_0_30px_hsl(var(--gold)/0.2)] ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2 flex-wrap">
          <CardTitle className="font-display text-xl md:text-2xl text-foreground">
            {event.name}
          </CardTitle>
          <div className="flex gap-2">
            <Badge variant="outline" className="border-primary/50 text-primary">
              {event.type === 'Solo' ? <User className="w-3 h-3 mr-1" /> : <Users className="w-3 h-3 mr-1" />}
              {event.type}
            </Badge>
            <Badge variant="secondary" className="bg-secondary/20 text-secondary border-secondary/30">
              <Clock className="w-3 h-3 mr-1" />
              {event.timeSlot}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">
            How it works
          </h4>
          <ul className="space-y-1.5">
            {event.howItWorks.map((step, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-foreground/80">
                <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <span>{step}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">
            Skills Tested
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {event.skillsTested.map((skill, i) => (
              <Badge key={i} variant="outline" className="text-xs border-muted-foreground/30 text-muted-foreground">
                {skill}
              </Badge>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground pt-2 border-t border-border/50">
          <Clock className="w-4 h-4" />
          <span>{event.duration}</span>
        </div>
      </CardContent>
    </Card>
  );
};

const Events = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className="relative min-h-screen">
      {/* Background */}
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat -z-10"
        style={{ backgroundImage: `url(${heroBg})` }}
      >
        <div className="absolute inset-0 bg-gradient-hero" />
        <div className="absolute inset-0 bg-background/70" />
      </div>

      <div className="relative z-10 px-4 py-8 md:py-12 max-w-6xl mx-auto">
        {/* Back Button */}
        <Link 
          to="/" 
          className={`inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>

        {/* Header */}
        <div 
          className={`text-center mb-12 transition-all duration-700 ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground text-glow mb-4">
            Explore Events
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover the exciting events at Utsavam 6.0. Choose one morning and one afternoon event during registration.
          </p>
        </div>

        {/* Morning Events */}
        <section className="mb-12">
          <div 
            className={`flex items-center gap-3 mb-6 transition-all duration-700 ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
            style={{ transitionDelay: '200ms' }}
          >
            <div className="w-3 h-3 rounded-full bg-primary animate-pulse-glow" />
            <h2 className="font-display text-2xl md:text-3xl text-foreground">
              Morning Events
            </h2>
            <Badge className="bg-primary/20 text-primary border-primary/30">
              Solo • Choose 1
            </Badge>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {morningEvents.map((event, index) => (
              <EventCard key={event.name} event={event} index={index} />
            ))}
          </div>
        </section>

        {/* Afternoon Events */}
        <section className="mb-16">
          <div 
            className={`flex items-center gap-3 mb-6 transition-all duration-700 ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
            style={{ transitionDelay: '400ms' }}
          >
            <div className="w-3 h-3 rounded-full bg-secondary animate-pulse-glow" />
            <h2 className="font-display text-2xl md:text-3xl text-foreground">
              Afternoon Events
            </h2>
            <Badge className="bg-secondary/20 text-secondary border-secondary/30">
              Group • Choose 1
            </Badge>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {afternoonEvents.map((event, index) => (
              <EventCard key={event.name} event={event} index={index + 3} />
            ))}
          </div>
        </section>

        {/* CTA */}
        <div 
          className={`text-center transition-all duration-700 ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
          style={{ transitionDelay: '600ms' }}
        >
          <Link to="/register">
            <Button variant="hero" size="xl" className="group">
              <span>Register Now</span>
              <Sparkles className="w-5 h-5 transition-transform group-hover:rotate-12" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Events;

