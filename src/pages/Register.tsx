import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Sparkles, CheckCircle2, User, Users, AlertCircle } from 'lucide-react';
import heroBg from '@/assets/hero-bg.jpg';

const GOOGLE_SHEET_WEBAPP_URL = "https://script.google.com/macros/s/AKfycbws31vRhbeydLFZxFk8MjAH1yO0BCXM3Yinc3i7R0wpFYyC4bBzC8fFVwBnUcCZPotrbg/exec";


interface FormData {
  fullName: string;
  college: string;
  department: string;
  phone: string;
  email: string;
  morningEvent: string;
  afternoonEvent: string;
}

interface Registration extends FormData {
  id: string;
  registeredAt: string;
}

const morningEvents = [
  { id: 'commentary-clash', name: 'Commentary Clash' },
  { id: 'word-wizard', name: 'Word Wizard' },
  { id: 'debate-duel', name: 'Debate Duel' }
];

const afternoonEvents = [
  { id: 'skit-spectacular', name: 'Skit Spectacular' },
  { id: 'quiz-quest', name: 'Quiz Quest' }
];

const generateId = () => {
  return 'reg_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
};

const Register = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    college: '',
    department: '',
    phone: '',
    email: '',
    morningEvent: '',
    afternoonEvent: ''
  });

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const isFormValid = () => {
    return (
      formData.fullName.trim() !== '' &&
      formData.college.trim() !== '' &&
      formData.department.trim() !== '' &&
      formData.phone.trim() !== '' &&
      formData.email.trim() !== '' &&
      formData.morningEvent !== '' &&
      formData.afternoonEvent !== ''
    );
  };

  const validateForm = (): boolean => {
    if (!formData.fullName.trim()) {
      toast({ title: 'Please enter your full name', variant: 'destructive' });
      return false;
    }
    if (!formData.college.trim()) {
      toast({ title: 'Please enter your college name', variant: 'destructive' });
      return false;
    }
    if (!formData.department.trim()) {
      toast({ title: 'Please enter your department and year', variant: 'destructive' });
      return false;
    }
    if (!formData.phone.trim() || !/^\d{10}$/.test(formData.phone.trim())) {
      toast({ title: 'Please enter a valid 10-digit phone number', variant: 'destructive' });
      return false;
    }
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      toast({ title: 'Please enter a valid email address', variant: 'destructive' });
      return false;
    }
    if (!formData.morningEvent) {
      toast({ title: 'Please select a morning event', variant: 'destructive' });
      return false;
    }
    if (!formData.afternoonEvent) {
      toast({ title: 'Please select an afternoon event', variant: 'destructive' });
      return false;
    }
    return true;
  };
// ----------------------------------------------------------------------------------------
  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!validateForm()) return;

  setIsSubmitting(true);

  const registration: Registration = {
    id: generateId(),
    ...formData,
    morningEvent:
      morningEvents.find(e => e.id === formData.morningEvent)?.name ||
      formData.morningEvent,
    afternoonEvent:
      afternoonEvents.find(e => e.id === formData.afternoonEvent)?.name ||
      formData.afternoonEvent,
    registeredAt: new Date().toISOString()
  };

  try {
    // ✅ SEND TO GOOGLE SHEETS (CORS-SAFE)
    await fetch(GOOGLE_SHEET_WEBAPP_URL, {
      method: "POST",
      mode: "no-cors",
      body: JSON.stringify(registration)
    });

    // ✅ LOCAL BACKUP
    const existingData = localStorage.getItem("utsavam_registrations");
    const registrations = existingData
      ? JSON.parse(existingData)
      : { registrations: [] };

    registrations.registrations.push(registration);
    localStorage.setItem(
      "utsavam_registrations",
      JSON.stringify(registrations)
    );

    // ✅ SUCCESS FLOW
    setTimeout(() => {
      navigate("/registration-success", {
        state: { registration }
      });
    }, 500);

  } catch (error) {
    console.error(error);
    toast({
      title: "Registration failed",
      description: "Please try again later.",
      variant: "destructive"
    });
    setIsSubmitting(false);
  }
};


  const showEventValidationMessage = !formData.morningEvent || !formData.afternoonEvent;

  return (
    <div className="relative min-h-screen">
      {/* Background */}
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat -z-10"
        style={{ backgroundImage: `url(${heroBg})` }}
      >
        <div className="absolute inset-0 bg-gradient-hero" />
        <div className="absolute inset-0 bg-background/80" />
      </div>

      <div className="relative z-10 px-4 py-8 md:py-12 max-w-2xl mx-auto">
        {/* Back Button */}
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground text-glow mb-3">
            Register for Utsavam 6.0
          </h1>
          <p className="text-muted-foreground">
            Fill in your details and choose your events
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Details Card */}
          <Card className="bg-card/60 backdrop-blur-sm border-border/50">
            <CardHeader className="pb-4">
              <CardTitle className="font-display text-xl text-foreground flex items-center gap-2">
                <User className="w-5 h-5 text-primary" />
                Personal Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  placeholder="Enter your full name"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  className="bg-input/50 border-border/50 focus:border-primary"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="college">College Name</Label>
                <Input
                  id="college"
                  placeholder="Enter your college name"
                  value={formData.college}
                  onChange={(e) => handleInputChange('college', e.target.value)}
                  className="bg-input/50 border-border/50 focus:border-primary"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="department">Department / Year</Label>
                <Input
                  id="department"
                  placeholder="e.g., CSE / 3rd Year"
                  value={formData.department}
                  onChange={(e) => handleInputChange('department', e.target.value)}
                  className="bg-input/50 border-border/50 focus:border-primary"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="10-digit number"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value.replace(/\D/g, '').slice(0, 10))}
                    className="bg-input/50 border-border/50 focus:border-primary"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email ID</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="bg-input/50 border-border/50 focus:border-primary"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Morning Events Card */}
          <Card className="bg-card/60 backdrop-blur-sm border-border/50">
            <CardHeader className="pb-4">
              <CardTitle className="font-display text-xl text-foreground flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-primary" />
                Morning Event
                <span className="text-sm font-normal text-muted-foreground ml-2">(Choose 1 Solo Event)</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={formData.morningEvent}
                onValueChange={(value) => handleInputChange('morningEvent', value)}
                className="space-y-3"
              >
                {morningEvents.map((event) => (
                  <div 
                    key={event.id}
                    className={`flex items-center space-x-3 p-3 rounded-lg border transition-all cursor-pointer ${
                      formData.morningEvent === event.id 
                        ? 'border-primary bg-primary/10' 
                        : 'border-border/50 hover:border-primary/50'
                    }`}
                    onClick={() => handleInputChange('morningEvent', event.id)}
                  >
                    <RadioGroupItem value={event.id} id={event.id} />
                    <Label htmlFor={event.id} className="flex-1 cursor-pointer font-medium">
                      {event.name}
                    </Label>
                    <User className="w-4 h-4 text-muted-foreground" />
                  </div>
                ))}
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Afternoon Events Card */}
          <Card className="bg-card/60 backdrop-blur-sm border-border/50">
            <CardHeader className="pb-4">
              <CardTitle className="font-display text-xl text-foreground flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-secondary" />
                Afternoon Event
                <span className="text-sm font-normal text-muted-foreground ml-2">(Choose 1 Group Event)</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={formData.afternoonEvent}
                onValueChange={(value) => handleInputChange('afternoonEvent', value)}
                className="space-y-3"
              >
                {afternoonEvents.map((event) => (
                  <div 
                    key={event.id}
                    className={`flex items-center space-x-3 p-3 rounded-lg border transition-all cursor-pointer ${
                      formData.afternoonEvent === event.id 
                        ? 'border-secondary bg-secondary/10' 
                        : 'border-border/50 hover:border-secondary/50'
                    }`}
                    onClick={() => handleInputChange('afternoonEvent', event.id)}
                  >
                    <RadioGroupItem value={event.id} id={event.id} />
                    <Label htmlFor={event.id} className="flex-1 cursor-pointer font-medium">
                      {event.name}
                    </Label>
                    <Users className="w-4 h-4 text-muted-foreground" />
                  </div>
                ))}
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Validation Message */}
          {showEventValidationMessage && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/20 p-3 rounded-lg">
              <AlertCircle className="w-4 h-4 text-primary" />
              <span>Please select 1 morning and 1 afternoon event to continue.</span>
            </div>
          )}

          {/* Submit Button */}
          <Button 
            type="submit" 
            variant="hero" 
            size="xl" 
            className="w-full group"
            disabled={!isFormValid() || isSubmitting}
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                Registering...
              </span>
            ) : (
              <>
                <span>Complete Registration</span>
                <Sparkles className="w-5 h-5 transition-transform group-hover:rotate-12" />
              </>
            )}
          </Button>

          {/* Event Details Link */}
          <p className="text-center text-sm text-muted-foreground">
            Not sure which events to choose?{' '}
            <Link to="/events" className="text-primary hover:underline">
              Explore all events
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
