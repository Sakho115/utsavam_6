import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  ArrowLeft, Calendar, MapPin, Users, User, Music, Mic2, BookOpen, 
  Drama, Trophy, Star, CheckCircle, Heart, Phone, Instagram, Sparkles 
} from 'lucide-react';
import ScrollRevealCard from '@/components/ScrollRevealCard';
import CountdownTimer from '@/components/CountdownTimer';

const LearnMore = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Back to home</span>
            </Button>
          </Link>
          <h1 className="font-display text-xl font-bold text-foreground hidden md:block">Utsavam 6.0</h1>
          <div className="scale-75 sm:scale-90 md:scale-100 origin-right">
            <CountdownTimer />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-primary/5 to-transparent">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4">
            About the event
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover the magic of Utsavam 6.0 — a celebration of talent, creativity, and cultural expression.
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 space-y-6 max-w-4xl">
          
          {/* Event Details Card */}
          <ScrollRevealCard
            title="Event details"
            icon={<Calendar className="w-5 h-5" />}
          >
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium text-foreground">Date</p>
                  <p className="text-muted-foreground">February 2025</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-secondary mt-0.5" />
                <div>
                  <p className="font-medium text-foreground">Venue</p>
                  <p className="text-muted-foreground">P. A. College of Engineering and Technology</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Trophy className="w-5 h-5 text-accent mt-0.5" />
                <div>
                  <p className="font-medium text-foreground">Edition</p>
                  <p className="text-muted-foreground">Sixth edition of our annual cultural celebration</p>
                </div>
              </div>
            </div>
          </ScrollRevealCard>

          {/* About Card */}
          <ScrollRevealCard
            title="What is Utsavam?"
            description="A celebration of culture and creativity"
            icon={<Music className="w-5 h-5" />}
            delay={80}
          >
            <p className="text-muted-foreground leading-relaxed">
              Utsavam is the flagship cultural event organized by P. A. English Language Club. 
              Now in its sixth edition, it brings together students from across disciplines to 
              showcase their talents in various artistic and literary competitions. From solo 
              performances to collaborative group events, Utsavam offers a platform for creativity, 
              expression, and cultural exchange.
            </p>
          </ScrollRevealCard>

          {/* Event Rounds Structure */}
          <ScrollRevealCard
            title="Event rounds"
            description="Compete across 5 exciting categories"
            icon={<Users className="w-5 h-5" />}
            delay={80}
          >
            <div className="grid gap-4">
              <div className="p-4 bg-primary/5 rounded-lg border-2 border-primary/20">
                <div className="flex items-center gap-2 mb-2">
                  <User className="w-5 h-5 text-primary" />
                  <h4 className="font-semibold text-foreground">Solo events (3 rounds)</h4>
                </div>
                <p className="text-sm text-muted-foreground">
                  Individual competitions showcasing personal talent and creativity
                </p>
              </div>
              <div className="p-4 bg-secondary/5 rounded-lg border-2 border-secondary/20">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="w-5 h-5 text-secondary" />
                  <h4 className="font-semibold text-foreground">Group events (2 rounds)</h4>
                </div>
                <p className="text-sm text-muted-foreground">
                  Team-based competitions that celebrate collaboration and collective expression
                </p>
              </div>
            </div>
          </ScrollRevealCard>

          {/* Solo Events */}
          <ScrollRevealCard
            title="Solo events"
            icon={<User className="w-5 h-5" />}
            delay={80}
          >
            <div className="grid gap-4 md:grid-cols-3">
              <div className="p-4 bg-primary/5 rounded-lg border-2 border-primary/20">
                <div className="flex items-center gap-2 mb-2">
                  <Mic2 className="w-5 h-5 text-primary" />
                  <h4 className="font-medium text-foreground">Poetry recitation</h4>
                </div>
                <p className="text-sm text-muted-foreground">
                  Express emotions through the power of verse
                </p>
              </div>
              <div className="p-4 bg-secondary/5 rounded-lg border-2 border-secondary/20">
                <div className="flex items-center gap-2 mb-2">
                  <BookOpen className="w-5 h-5 text-secondary" />
                  <h4 className="font-medium text-foreground">Essay writing</h4>
                </div>
                <p className="text-sm text-muted-foreground">
                  Craft compelling narratives and arguments
                </p>
              </div>
              <div className="p-4 bg-accent/5 rounded-lg border-2 border-accent/20">
                <div className="flex items-center gap-2 mb-2">
                  <Drama className="w-5 h-5 text-accent" />
                  <h4 className="font-medium text-foreground">Elocution</h4>
                </div>
                <p className="text-sm text-muted-foreground">
                  Master the art of public speaking
                </p>
              </div>
            </div>
          </ScrollRevealCard>

          {/* Group Events */}
          <ScrollRevealCard
            title="Group events"
            icon={<Users className="w-5 h-5" />}
            delay={80}
          >
            <div className="grid gap-4 md:grid-cols-2">
              <div className="p-4 bg-primary/5 rounded-lg border-2 border-primary/20">
                <div className="flex items-center gap-2 mb-2">
                  <Drama className="w-5 h-5 text-primary" />
                  <h4 className="font-medium text-foreground">Skit performance</h4>
                </div>
                <p className="text-sm text-muted-foreground">
                  Bring stories to life through dramatic performances with your team
                </p>
              </div>
              <div className="p-4 bg-secondary/5 rounded-lg border-2 border-secondary/20">
                <div className="flex items-center gap-2 mb-2">
                  <Mic2 className="w-5 h-5 text-secondary" />
                  <h4 className="font-medium text-foreground">Group discussion</h4>
                </div>
                <p className="text-sm text-muted-foreground">
                  Engage in thought-provoking debates and discussions
                </p>
              </div>
            </div>
          </ScrollRevealCard>

          {/* Rules & Eligibility */}
          <ScrollRevealCard
            title="Rules & eligibility"
            description="Everything you need to know before participating"
            icon={<CheckCircle className="w-5 h-5" />}
            delay={80}
          >
            <ul className="space-y-3 text-muted-foreground">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                <span>Open to all students currently enrolled in P. A. College of Engineering and Technology</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                <span>Participants can register for multiple events (solo and group)</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                <span>Group events require teams of 3-6 members</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                <span>All performances must adhere to time limits specified for each event</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                <span>Decision of judges will be final and binding</span>
              </li>
            </ul>
          </ScrollRevealCard>

          {/* Why Participate */}
          <ScrollRevealCard
            title="Why participate?"
            description="More than just a competition"
            icon={<Star className="w-5 h-5" />}
            delay={80}
          >
            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Trophy className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium text-foreground">Win exciting prizes</h4>
                  <p className="text-sm text-muted-foreground">Certificates, trophies, and cash prizes for winners</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-secondary/10">
                  <Users className="w-4 h-4 text-secondary" />
                </div>
                <div>
                  <h4 className="font-medium text-foreground">Build connections</h4>
                  <p className="text-sm text-muted-foreground">Meet like-minded peers and make lasting friendships</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-accent/10">
                  <Sparkles className="w-4 h-4 text-accent" />
                </div>
                <div>
                  <h4 className="font-medium text-foreground">Showcase your talent</h4>
                  <p className="text-sm text-muted-foreground">Perform in front of an enthusiastic audience</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Heart className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium text-foreground">Create memories</h4>
                  <p className="text-sm text-muted-foreground">Experience a day full of fun, laughter, and celebration</p>
                </div>
              </div>
            </div>
          </ScrollRevealCard>

          {/* About The Club */}
          <ScrollRevealCard
            title="About the club"
            description="P. A. English Language Club"
            icon={<BookOpen className="w-5 h-5" />}
            variant="elegant"
            delay={80}
          >
            <div className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                The P. A. English Language Club is a vibrant student community dedicated to promoting 
                English language proficiency and literary appreciation. Established with the vision of 
                nurturing communication skills and creative expression, the club organizes various 
                activities throughout the academic year.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                As the proud organizers of Utsavam, we bring together the best of talent, creativity, 
                and enthusiasm. Our dedicated team of student coordinators and faculty advisors work 
                tirelessly to make each edition of Utsavam bigger and better than the last.
              </p>
              <div className="pt-2 flex flex-wrap gap-2">
                <span className="px-3 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full">Literary events</span>
                <span className="px-3 py-1 text-xs font-medium bg-secondary/10 text-secondary rounded-full">Workshops</span>
                <span className="px-3 py-1 text-xs font-medium bg-accent/10 text-accent rounded-full">Guest lectures</span>
                <span className="px-3 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full">Cultural activities</span>
              </div>
            </div>
          </ScrollRevealCard>

          {/* Contact & Social */}
          <ScrollRevealCard
            title="Contact us"
            description="Get in touch for queries and registrations"
            icon={<Phone className="w-5 h-5" />}
            delay={80}
          >
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg border border-border">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Phone className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Coordinator</p>
                    <a href="tel:+919876543210" className="font-medium text-foreground hover:text-primary transition-colors">
                      +91 98765 43210
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg border border-border">
                  <div className="p-2 rounded-lg bg-secondary/10">
                    <Phone className="w-5 h-5 text-secondary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Co-coordinator</p>
                    <a href="tel:+919876543211" className="font-medium text-foreground hover:text-primary transition-colors">
                      +91 98765 43211
                    </a>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-pink-500/10 to-purple-500/10 rounded-lg border border-pink-500/20">
                <div className="p-2 rounded-lg bg-gradient-to-br from-pink-500/20 to-purple-500/20">
                  <Instagram className="w-5 h-5 text-pink-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Follow us on Instagram</p>
                  <a 
                    href="https://instagram.com/pa_english_club" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="font-medium text-foreground hover:text-pink-500 transition-colors"
                  >
                    @pa_english_club
                  </a>
                </div>
              </div>
            </div>
          </ScrollRevealCard>

          {/* CTA */}
          <div className="text-center pt-8 pb-16">
            <Link to="/">
              <Button variant="hero" size="xl">
                Back to home
              </Button>
            </Link>
          </div>

        </div>
      </section>
    </div>
  );
};

export default LearnMore;