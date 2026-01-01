import { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { House, HOUSES } from '@/components/MagicalSorterGame';
import { ArrowLeft, CheckCircle, Crown, Send } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';

interface FormData {
  name: string;
  college: string;
  department: string;
  year: string;
  phone: string;
  email: string;
}

const Registration = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoaded, setIsLoaded] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  // Get house from navigation state
  const house = (location.state?.house as House) || null;
  const houseData = house ? HOUSES[house] : null;

  const [formData, setFormData] = useState<FormData>({
    name: '',
    college: '',
    department: '',
    year: '',
    phone: '',
    email: ''
  });

  useEffect(() => {
    setIsLoaded(true);
    
    // Redirect if no house assigned
    if (!house) {
      navigate('/');
    }
  }, [house, navigate]);

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      toast({ title: "Name is required", variant: "destructive" });
      return false;
    }
    if (!formData.college.trim()) {
      toast({ title: "College is required", variant: "destructive" });
      return false;
    }
    if (!formData.department.trim()) {
      toast({ title: "Department is required", variant: "destructive" });
      return false;
    }
    if (!formData.year.trim()) {
      toast({ title: "Year is required", variant: "destructive" });
      return false;
    }
    if (!formData.phone.trim() || !/^\d{10}$/.test(formData.phone.trim())) {
      toast({ title: "Valid 10-digit phone number is required", variant: "destructive" });
      return false;
    }
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      toast({ title: "Valid email is required", variant: "destructive" });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);

    // Simulate submission (replace with actual API call)
    await new Promise(resolve => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setIsSubmitted(true);

    toast({
      title: "Registration Successful!",
      description: `Welcome to ${houseData?.name}, ${formData.name}!`,
    });
  };

  if (!house || !houseData) {
    return null;
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div 
          className="text-center max-w-md animate-scale-in"
        >
          <div 
            className="inline-flex items-center justify-center w-24 h-24 rounded-full mb-6 animate-pulse-glow"
            style={{ 
              backgroundColor: `${houseData.color}30`,
              boxShadow: `0 0 40px ${houseData.color}40`
            }}
          >
            <CheckCircle className="w-12 h-12" style={{ color: houseData.color }} />
          </div>
          
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground text-glow mb-4">
            Registration Complete!
          </h1>
          
          <p className="text-muted-foreground mb-2">
            Welcome to Utsavam 6.0, <span className="text-foreground font-semibold">{formData.name}</span>
          </p>
          
          <p className="mb-8">
            You are now a proud member of{' '}
            <span style={{ color: houseData.color }} className="font-bold">
              {houseData.name}
            </span>
          </p>

          <Link to="/">
            <Button variant="heroOutline" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background effects */}
      <div 
        className="absolute inset-0 transition-all duration-1000"
        style={{
          background: `radial-gradient(ellipse at top, ${houseData.color}10 0%, transparent 50%)`
        }}
      />
      
      <div className="relative z-10 container mx-auto px-4 py-8 md:py-12">
        {/* Back button */}
        <Link 
          to="/"
          className={cn(
            "inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8",
            isLoaded ? "opacity-100" : "opacity-0"
          )}
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>

        <div className="max-w-xl mx-auto">
          {/* Header with house info */}
          <div 
            className={cn(
              "text-center mb-8 transition-all duration-1000",
              isLoaded ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
            )}
          >
            <div 
              className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4"
              style={{ 
                backgroundColor: `${houseData.color}20`,
                boxShadow: `0 0 30px ${houseData.color}30`
              }}
            >
              <Crown className="w-8 h-8" style={{ color: houseData.color }} />
            </div>
            
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground text-glow mb-2">
              Register to{' '}
              <span style={{ color: houseData.color }}>{houseData.name}</span>
            </h1>
            
            <p className="text-muted-foreground">
              Complete your registration for Utsavam 6.0
            </p>
          </div>

          {/* Registration form */}
          <form 
            onSubmit={handleSubmit}
            className={cn(
              "bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6 md:p-8 transition-all duration-1000",
              isLoaded ? "opacity-100 scale-100" : "opacity-0 scale-95"
            )}
            style={{ transitionDelay: '200ms' }}
          >
            {/* House badge (non-editable) */}
            <div className="mb-6 p-4 rounded-xl bg-muted/20 border border-border/30">
              <Label className="text-xs text-muted-foreground uppercase tracking-wider">
                Assigned House
              </Label>
              <div 
                className="font-display text-xl font-bold mt-1 flex items-center gap-2"
                style={{ color: houseData.color }}
              >
                <Crown className="w-5 h-5" />
                {houseData.name}
              </div>
            </div>

            <div className="space-y-5">
              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="bg-muted/20 border-border/50"
                />
              </div>

              {/* College */}
              <div className="space-y-2">
                <Label htmlFor="college">College *</Label>
                <Input
                  id="college"
                  placeholder="Enter your college name"
                  value={formData.college}
                  onChange={(e) => handleInputChange('college', e.target.value)}
                  className="bg-muted/20 border-border/50"
                />
              </div>

              {/* Department & Year */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="department">Department *</Label>
                  <Input
                    id="department"
                    placeholder="e.g., Computer Science"
                    value={formData.department}
                    onChange={(e) => handleInputChange('department', e.target.value)}
                    className="bg-muted/20 border-border/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="year">Year *</Label>
                  <Input
                    id="year"
                    placeholder="e.g., 2nd Year"
                    value={formData.year}
                    onChange={(e) => handleInputChange('year', e.target.value)}
                    className="bg-muted/20 border-border/50"
                  />
                </div>
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="10-digit mobile number"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value.replace(/\D/g, '').slice(0, 10))}
                  className="bg-muted/20 border-border/50"
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="bg-muted/20 border-border/50"
                />
              </div>
            </div>

            {/* Submit button */}
            <Button
              type="submit"
              variant="hero"
              size="lg"
              className="w-full mt-8 gap-2"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  <span>Complete Registration</span>
                </>
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Registration;
