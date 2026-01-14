import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowLeft, Sparkles, Search, Wand2, Home, Zap, FileEdit, BookOpen } from 'lucide-react';
import heroBg from '@/assets/hero-bg.jpg';

interface ExtraActivity {
  title: string;
  description: string;
  icon: React.ReactNode;
  path: string;
  gradient: string;
}

const extras: ExtraActivity[] = [
  {
    title: 'Word Search',
    description: 'Find hidden words in our Utsavam-themed puzzle. A fun warm-up challenge!',
    icon: <Search className="w-8 h-8" />,
    path: '/word-search',
    gradient: 'from-primary/20 to-orange-500/20'
  },
  {
    title: 'Magical House Sorter',
    description: 'Discover which Utsavam house matches your personality through our magical quiz!',
    icon: <Wand2 className="w-8 h-8" />,
    path: '/magical-sorter',
    gradient: 'from-secondary/20 to-accent/20'
  },
  {
    title: 'Rapid Synonym Challenge',
    description: 'Test your vocabulary speed! Find the best synonym in 5 quick rounds.',
    icon: <Zap className="w-8 h-8" />,
    path: '/synonym-challenge',
    gradient: 'from-yellow-500/20 to-primary/20'
  },
  {
    title: 'Sentence Fixer',
    description: 'Spot the grammar errors and pick the correct sentence. Sharpen your language skills!',
    icon: <FileEdit className="w-8 h-8" />,
    path: '/sentence-fixer',
    gradient: 'from-purple-500/20 to-secondary/20'
  },
  {
    title: 'Guess the Word',
    description: 'Read the definition and guess the word. How vast is your vocabulary?',
    icon: <BookOpen className="w-8 h-8" />,
    path: '/guess-the-word',
    gradient: 'from-accent/20 to-green-500/20'
  }
];

const Extras = () => {
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

      <div className="relative z-10 px-4 py-8 md:py-12 max-w-5xl mx-auto">
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
          <div className="inline-flex items-center gap-2 bg-accent/20 backdrop-blur-sm border border-accent/30 rounded-full px-4 py-1.5 mb-4">
            <Sparkles className="w-4 h-4 text-accent" />
            <span className="text-sm font-medium text-accent">Utsavam Mini Games</span>
          </div>
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground text-glow mb-4">
            Mini Games Hub
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            These fun activities are completely optional. Play them for fun, share with friends, or skip them entirely — your registration is already complete!
          </p>
        </div>

        {/* Activity Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {extras.map((extra, index) => (
            <Link 
              key={extra.title} 
              to={extra.path}
              className={`block transition-all duration-700 ${
                isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
              style={{ transitionDelay: `${(index + 1) * 100}ms` }}
            >
              <Card className={`h-full bg-gradient-to-br ${extra.gradient} backdrop-blur-sm border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-[0_0_30px_hsl(var(--gold)/0.2)] hover:scale-[1.02] cursor-pointer`}>
                <CardHeader>
                  <div className="w-14 h-14 rounded-xl bg-background/50 flex items-center justify-center mb-3 text-primary">
                    {extra.icon}
                  </div>
                  <CardTitle className="font-display text-xl text-foreground">
                    {extra.title}
                  </CardTitle>
                  <CardDescription className="text-muted-foreground text-sm">
                    {extra.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="heroOutline" className="w-full" size="sm">
                    Play Now
                  </Button>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Home Button */}
        <div 
          className={`text-center transition-all duration-700 ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
          style={{ transitionDelay: '600ms' }}
        >
          <Link to="/">
            <Button variant="ghost" size="lg" className="text-muted-foreground hover:text-foreground">
              <Home className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Extras;
