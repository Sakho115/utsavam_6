import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Sparkles, User, Users, AlertCircle, UserPlus, UsersRound, Sun, Sunset } from 'lucide-react';
import heroBg from '@/assets/hero-bg.jpg';
import { GOOGLE_SHEET_WEBAPP_URL } from '@/config/googleSheet';
import HowToRegister from '@/components/HowToRegister';

// ============= TYPE DEFINITIONS =============
type EventType = 'solo' | 'pair' | 'group';
type TeamMode = 'create' | 'join' | null;

interface EventDefinition {
  id: string;
  name: string;
  type: EventType;
  teamSize: number;
  session: 'morning' | 'afternoon';
}

interface FormData {
  fullName: string;
  college: string;
  department: string;
  phone: string;
  email: string;
  morningEvent: string;
  afternoonEvent: string;
}

interface TeamMember {
  name: string;
  email: string;
  phone: string;
  college: string;
  department: string;
  joinedAt: string;
}

interface MorningTeamData {
  teamId: string;
  teamName: string;
  eventId: string;
  eventType: 'pair' | 'group';
  requiredTeamSize: number;
  leaderName: string;
  leaderEmail: string;
  leaderPhone: string;
  members: TeamMember[];
  status: 'OPEN' | 'FULL';
  createdAt: string;
}

interface AfternoonTeamData {
  teamId: string;
  teamName: string;
  eventId: string;
  requiredTeamSize: number;
  leaderName: string;
  leaderEmail: string;
  leaderPhone: string;
  members: TeamMember[];
  status: 'OPEN' | 'FULL';
  createdAt: string;
}

interface RegistrationPayload {
  registrationId: string;
  name: string;
  email: string;
  phone: string;
  college: string;
  department: string;
  morningEventId: string;
  morningEventType: EventType;
  morningTeamId: string | null;
  afternoonEventId: string;
  afternoonTeamId: string | null;
  role: 'Leader' | 'Member';
  registrationType: 'SOLO' | 'MORNING_CREATE' | 'MORNING_JOIN' | 'AFTERNOON_CREATE' | 'AFTERNOON_JOIN';
  timestamp: string;
}

// ============= EVENT DEFINITIONS (SOURCE OF TRUTH) =============
const EVENTS: EventDefinition[] = [
  // Morning Events (OPTIONAL - user can register for morning only)
  { id: 'trispark', name: 'Trispark', type: 'solo', teamSize: 1, session: 'morning' },
  { id: 'scramble-zone', name: 'Scramble Zone', type: 'pair', teamSize: 2, session: 'morning' },
  { id: 'frames-to-fame', name: 'Frames to Fame', type: 'group', teamSize: 3, session: 'morning' },
  // Afternoon Events (REQUIRES morning event to be selected)
  { id: 'wordora', name: 'Wordora', type: 'group', teamSize: 3, session: 'afternoon' },
  { id: 'the-static-chase', name: 'The Static Chase', type: 'group', teamSize: 3, session: 'afternoon' },
];

const MORNING_EVENTS = EVENTS.filter(e => e.session === 'morning');
const AFTERNOON_EVENTS = EVENTS.filter(e => e.session === 'afternoon');

// ============= HELPER FUNCTIONS =============
const getEventById = (id: string): EventDefinition | undefined => EVENTS.find(e => e.id === id);

const requiresTeam = (event: EventDefinition): boolean => event.teamSize > 1;

const getEventTypeLabel = (event: EventDefinition): string => {
  if (event.type === 'solo') return 'Solo Event – direct registration, no team needed';
  if (event.type === 'pair') return 'Pair Event – exactly 2 members per team';
  return `Group Event – exactly ${event.teamSize} members per team`;
};

const generateId = () => 'reg_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 9);

const generateMorningTeamId = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = 'M-';
  for (let i = 0; i < 4; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

const generateAfternoonTeamId = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = 'A-';
  for (let i = 0; i < 4; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// Helper functions to get team name when joining
const getJoinedTeamName = (teams: MorningTeamData[] | AfternoonTeamData[], teamId: string): string => {
  const team = teams.find(t => t.teamId.toUpperCase() === teamId.toUpperCase());
  return team?.teamName || '';
};

// ============= STORAGE FUNCTIONS =============
const getMorningTeamsFromStorage = (): MorningTeamData[] => {
  try {
    const data = localStorage.getItem('utsavam_morning_teams');
    return data ? JSON.parse(data).teams : [];
  } catch {
    return [];
  }
};

const saveMorningTeamsToStorage = (teams: MorningTeamData[]) => {
  localStorage.setItem('utsavam_morning_teams', JSON.stringify({ teams }));
};

const getAfternoonTeamsFromStorage = (): AfternoonTeamData[] => {
  try {
    const data = localStorage.getItem('utsavam_afternoon_teams');
    return data ? JSON.parse(data).teams : [];
  } catch {
    return [];
  }
};

const saveAfternoonTeamsToStorage = (teams: AfternoonTeamData[]) => {
  localStorage.setItem('utsavam_afternoon_teams', JSON.stringify({ teams }));
};

// ============= MAIN COMPONENT =============
const Register = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);
  
  // Team modes for morning and afternoon
  const [morningTeamMode, setMorningTeamMode] = useState<TeamMode>(null);
  const [afternoonTeamMode, setAfternoonTeamMode] = useState<TeamMode>(null);
  
  // Team names for creation
  const [morningTeamName, setMorningTeamName] = useState('');
  const [afternoonTeamName, setAfternoonTeamName] = useState('');
  
  // Team IDs for joining
  const [joinMorningTeamId, setJoinMorningTeamId] = useState('');
  const [joinAfternoonTeamId, setJoinAfternoonTeamId] = useState('');
  
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    college: '',
    department: '',
    phone: '',
    email: '',
    morningEvent: '',
    afternoonEvent: ''
  });

  // Get selected event objects
  const selectedMorningEvent = getEventById(formData.morningEvent);
  const selectedAfternoonEvent = getEventById(formData.afternoonEvent);

  // Determine if team registration is needed
  const morningRequiresTeam = selectedMorningEvent ? requiresTeam(selectedMorningEvent) : false;
  const afternoonRequiresTeam = selectedAfternoonEvent ? requiresTeam(selectedAfternoonEvent) : true; // Always true for afternoon

  // Reset team modes when events change
  useEffect(() => {
    setMorningTeamMode(null);
    setMorningTeamName('');
    setJoinMorningTeamId('');
  }, [formData.morningEvent]);

  useEffect(() => {
    setAfternoonTeamMode(null);
    setAfternoonTeamName('');
    setJoinAfternoonTeamId('');
  }, [formData.afternoonEvent]);

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // ============= VALIDATION FUNCTIONS =============
  const isMorningTeamValid = (): boolean => {
    if (!morningRequiresTeam) return true;
    if (morningTeamMode === 'create') return morningTeamName.trim().length >= 2;
    if (morningTeamMode === 'join') return joinMorningTeamId.trim().length > 0;
    return false;
  };

  const isAfternoonTeamValid = (): boolean => {
    if (!afternoonRequiresTeam) return true;
    if (afternoonTeamMode === 'create') return afternoonTeamName.trim().length >= 2;
    if (afternoonTeamMode === 'join') return joinAfternoonTeamId.trim().length > 0;
    return false;
  };

  const isFormValid = () => {
    // Base personal details validation
    const personalDetailsValid = 
      formData.fullName.trim() !== '' &&
      formData.college.trim() !== '' &&
      formData.department.trim() !== '' &&
      formData.phone.trim() !== '' &&
      formData.email.trim() !== '';

    if (!personalDetailsValid) return false;

    // RULE: Afternoon event requires morning event
    if (formData.afternoonEvent && !formData.morningEvent) return false;

    // At least morning event must be selected (morning is optional, but need at least one)
    if (!formData.morningEvent && !formData.afternoonEvent) return false;

    // Validate morning team if morning event requires team
    if (formData.morningEvent && morningRequiresTeam && !isMorningTeamValid()) return false;

    // Validate afternoon team if afternoon event is selected
    if (formData.afternoonEvent && !isAfternoonTeamValid()) return false;

    return true;
  };

  const validateForm = (): boolean => {
    // Personal details validation
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

    // Event selection validation
    // RULE: At least morning event must be selected (can skip afternoon)
    if (!formData.morningEvent && !formData.afternoonEvent) {
      toast({ title: 'Please select at least a morning event', variant: 'destructive' });
      return false;
    }

    // RULE: Afternoon event REQUIRES morning event to be selected first
    if (formData.afternoonEvent && !formData.morningEvent) {
      toast({ title: 'You must select a morning event to register for an afternoon event', variant: 'destructive' });
      return false;
    }

    // Morning team validation
    if (morningRequiresTeam) {
      if (!morningTeamMode) {
        toast({ title: 'Please select "Create Morning Team" or "Join Morning Team"', variant: 'destructive' });
        return false;
      }

      if (morningTeamMode === 'create') {
        if (!morningTeamName.trim() || morningTeamName.trim().length < 2) {
          toast({ title: 'Please enter a valid morning team name (at least 2 characters)', variant: 'destructive' });
          return false;
        }
        const teams = getMorningTeamsFromStorage();
        const existingTeam = teams.find(
          t => t.teamName.toLowerCase() === morningTeamName.trim().toLowerCase() && 
               t.eventId === selectedMorningEvent?.id
        );
        if (existingTeam) {
          toast({ title: 'A morning team with this name already exists for this event', variant: 'destructive' });
          return false;
        }
      }

      if (morningTeamMode === 'join') {
        if (!joinMorningTeamId.trim()) {
          toast({ title: 'Please enter a Morning Team ID', variant: 'destructive' });
          return false;
        }
        
        const teams = getMorningTeamsFromStorage();
        const team = teams.find(t => t.teamId.toUpperCase() === joinMorningTeamId.trim().toUpperCase());
        
        if (!team) {
          toast({ title: 'Invalid Morning Team ID. Please check and try again.', variant: 'destructive' });
          return false;
        }
        
        if (team.eventId !== selectedMorningEvent?.id) {
          const teamEvent = getEventById(team.eventId);
          toast({ title: `This morning team is for "${teamEvent?.name}", not "${selectedMorningEvent?.name}"`, variant: 'destructive' });
          return false;
        }
        
        if (team.status === 'FULL') {
          toast({ title: 'This morning team is already full', variant: 'destructive' });
          return false;
        }
        
        const emailExists = team.leaderEmail === formData.email.trim() || 
          team.members.some(m => m.email === formData.email.trim());
        if (emailExists) {
          toast({ title: 'You are already registered in this morning team', variant: 'destructive' });
          return false;
        }
      }
    }

    // Afternoon team validation (only if afternoon event is selected)
    if (formData.afternoonEvent && !afternoonTeamMode) {
      toast({ title: 'Please select "Create Afternoon Team" or "Join Afternoon Team"', variant: 'destructive' });
      return false;
    }

    if (formData.afternoonEvent && afternoonTeamMode === 'create') {
      if (!afternoonTeamName.trim() || afternoonTeamName.trim().length < 2) {
        toast({ title: 'Please enter a valid afternoon team name (at least 2 characters)', variant: 'destructive' });
        return false;
      }
      const teams = getAfternoonTeamsFromStorage();
      const existingTeam = teams.find(
        t => t.teamName.toLowerCase() === afternoonTeamName.trim().toLowerCase() && 
             t.eventId === selectedAfternoonEvent?.id
      );
      if (existingTeam) {
        toast({ title: 'An afternoon team with this name already exists for this event', variant: 'destructive' });
        return false;
      }
    }

    if (formData.afternoonEvent && afternoonTeamMode === 'join') {
      if (!joinAfternoonTeamId.trim()) {
        toast({ title: 'Please enter an Afternoon Team ID', variant: 'destructive' });
        return false;
      }
      
      const teams = getAfternoonTeamsFromStorage();
      const team = teams.find(t => t.teamId.toUpperCase() === joinAfternoonTeamId.trim().toUpperCase());
      
      if (!team) {
        toast({ title: 'Invalid Afternoon Team ID. Please check and try again.', variant: 'destructive' });
        return false;
      }
      
      if (team.eventId !== selectedAfternoonEvent?.id) {
        const teamEvent = getEventById(team.eventId);
        toast({ title: `This afternoon team is for "${teamEvent?.name}", not "${selectedAfternoonEvent?.name}"`, variant: 'destructive' });
        return false;
      }
      
      if (team.status === 'FULL') {
        toast({ title: 'This afternoon team is already full', variant: 'destructive' });
        return false;
      }
      
      const emailExists = team.leaderEmail === formData.email.trim() || 
        team.members.some(m => m.email === formData.email.trim());
      if (emailExists) {
        toast({ title: 'You are already registered in this afternoon team', variant: 'destructive' });
        return false;
      }
    }

    return true;
  };

  // ============= SUBMISSION HANDLER =============
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      let morningTeamId: string | null = null;
      let afternoonTeamId: string | null = null;
      let isLeader = false;
      let registrationType: RegistrationPayload['registrationType'] = 'SOLO';

      // Handle morning team creation/joining
      if (morningRequiresTeam && selectedMorningEvent) {
        if (morningTeamMode === 'create') {
          registrationType = 'MORNING_CREATE';
          morningTeamId = generateMorningTeamId();
          isLeader = true;

          const newTeam: MorningTeamData = {
            teamId: morningTeamId,
            teamName: morningTeamName.trim(),
            eventId: selectedMorningEvent.id,
            eventType: selectedMorningEvent.type as 'pair' | 'group',
            requiredTeamSize: selectedMorningEvent.teamSize,
            leaderName: formData.fullName.trim(),
            leaderEmail: formData.email.trim(),
            leaderPhone: formData.phone.trim(),
            members: [],
            status: 'OPEN',
            createdAt: new Date().toISOString()
          };

          const teams = getMorningTeamsFromStorage();
          teams.push(newTeam);
          saveMorningTeamsToStorage(teams);
        } else if (morningTeamMode === 'join') {
          registrationType = 'MORNING_JOIN';
          const teams = getMorningTeamsFromStorage();
          const teamIndex = teams.findIndex(t => t.teamId.toUpperCase() === joinMorningTeamId.trim().toUpperCase());
          
          if (teamIndex !== -1) {
            const team = teams[teamIndex];
            morningTeamId = team.teamId;

            const newMember: TeamMember = {
              name: formData.fullName.trim(),
              email: formData.email.trim(),
              phone: formData.phone.trim(),
              college: formData.college.trim(),
              department: formData.department.trim(),
              joinedAt: new Date().toISOString()
            };

            team.members.push(newMember);
            
            // Check if team is now full (leader + members = teamSize)
            if (team.members.length + 1 >= team.requiredTeamSize) {
              team.status = 'FULL';
            }

            teams[teamIndex] = team;
            saveMorningTeamsToStorage(teams);
          }
        }
      }

      // Handle afternoon team creation/joining (only if afternoon event selected)
      if (formData.afternoonEvent && selectedAfternoonEvent) {
        if (afternoonTeamMode === 'create') {
          if (!morningRequiresTeam || morningTeamMode !== 'create') {
            registrationType = 'AFTERNOON_CREATE';
          }
          afternoonTeamId = generateAfternoonTeamId();
          if (!isLeader) isLeader = true;

          const newTeam: AfternoonTeamData = {
            teamId: afternoonTeamId,
            teamName: afternoonTeamName.trim(),
            eventId: selectedAfternoonEvent.id,
            requiredTeamSize: selectedAfternoonEvent.teamSize,
            leaderName: formData.fullName.trim(),
            leaderEmail: formData.email.trim(),
            leaderPhone: formData.phone.trim(),
            members: [],
            status: 'OPEN',
            createdAt: new Date().toISOString()
          };

          const teams = getAfternoonTeamsFromStorage();
          teams.push(newTeam);
          saveAfternoonTeamsToStorage(teams);
        } else if (afternoonTeamMode === 'join') {
          if (!morningRequiresTeam && registrationType === 'SOLO') {
            registrationType = 'AFTERNOON_JOIN';
          }
          const teams = getAfternoonTeamsFromStorage();
          const teamIndex = teams.findIndex(t => t.teamId.toUpperCase() === joinAfternoonTeamId.trim().toUpperCase());
          
          if (teamIndex !== -1) {
            const team = teams[teamIndex];
            afternoonTeamId = team.teamId;

            const newMember: TeamMember = {
              name: formData.fullName.trim(),
              email: formData.email.trim(),
              phone: formData.phone.trim(),
              college: formData.college.trim(),
              department: formData.department.trim(),
              joinedAt: new Date().toISOString()
            };

            team.members.push(newMember);
            
            if (team.members.length + 1 >= team.requiredTeamSize) {
              team.status = 'FULL';
            }

            teams[teamIndex] = team;
            saveAfternoonTeamsToStorage(teams);
          }
        }
      }

      // Create registration payload for internal use
      // Safe access - use empty strings/defaults when events are not selected
      const registration: RegistrationPayload = {
        registrationId: generateId(),
        name: formData.fullName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        college: formData.college.trim(),
        department: formData.department.trim(),
        morningEventId: selectedMorningEvent ? selectedMorningEvent.id : '',
        morningEventType: selectedMorningEvent ? selectedMorningEvent.type : 'solo',
        morningTeamId: morningTeamId,
        afternoonEventId: selectedAfternoonEvent ? selectedAfternoonEvent.id : '',
        afternoonTeamId: afternoonTeamId,
        role: isLeader ? 'Leader' : 'Member',
        registrationType: registrationType,
        timestamp: new Date().toISOString()
      };

      // Build Google Sheets payload with safe optional chaining - never crashes on undefined
      const sheetPayload = {
        Name: formData.fullName.trim(),
        Email: formData.email.trim(),
        Phone: formData.phone.trim(),
        College: formData.college.trim(),
        Department: formData.department.trim(),
        MorningEventID: selectedMorningEvent?.id || "",
        MorningEventName: selectedMorningEvent?.name || "",
        MorningEventType: selectedMorningEvent?.type || "",
        MorningTeamID: morningTeamId || "",
        MorningTeamName: morningTeamMode === 'create' ? morningTeamName.trim() : 
                         (morningTeamMode === 'join' ? getJoinedTeamName(getMorningTeamsFromStorage(), joinMorningTeamId.trim()) : ''),
        AfternoonEventID: selectedAfternoonEvent?.id || "",
        AfternoonEventName: selectedAfternoonEvent?.name || "",
        AfternoonTeamID: afternoonTeamId || "",
        AfternoonTeamName: afternoonTeamMode === 'create' ? afternoonTeamName.trim() : 
                           (afternoonTeamMode === 'join' ? getJoinedTeamName(getAfternoonTeamsFromStorage(), joinAfternoonTeamId.trim()) : ''),
        Role: isLeader ? "Leader" : "Member",
        RegistrationType: registrationType
      };

      // Submit to Google Sheets using no-cors mode (CORS-safe, no response parsing)
      await fetch(GOOGLE_SHEET_WEBAPP_URL, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(sheetPayload)
      });

      // Store in localStorage as backup
      const existingData = localStorage.getItem('utsavam_registrations');
      const registrations = existingData ? JSON.parse(existingData) : { registrations: [] };
      registrations.registrations.push(registration);
      localStorage.setItem('utsavam_registrations', JSON.stringify(registrations));

      // Always navigate to success (Google Sheets failure must not block user)
      navigate('/registration-success', { 
        state: { 
          registration,
          generatedMorningTeamId: morningTeamMode === 'create' ? morningTeamId : undefined,
          generatedAfternoonTeamId: afternoonTeamMode === 'create' ? afternoonTeamId : undefined,
          morningEventName: selectedMorningEvent?.name,
          afternoonEventName: selectedAfternoonEvent?.name
        } 
      });
    } catch (error) {
      console.error('Registration error:', error);
      // Still navigate to success - don't block user due to network issues
      navigate('/registration-success');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ============= UI HELPERS =============
  const getEventIcon = (event: EventDefinition) => {
    if (event.type === 'solo') return <User className="w-4 h-4 text-muted-foreground" />;
    if (event.type === 'pair') return <Users className="w-4 h-4 text-muted-foreground" />;
    return <UsersRound className="w-4 h-4 text-muted-foreground" />;
  };

  const getEventBadge = (event: EventDefinition) => {
    if (event.type === 'solo') return 'Solo';
    if (event.type === 'pair') return 'Pair (2)';
    return `Team (${event.teamSize})`;
  };

  const showMorningEventMessage = !formData.morningEvent;
  const showAfternoonEventMessage = !formData.afternoonEvent;
  const showMorningTeamMessage = morningRequiresTeam && !morningTeamMode;
  const showAfternoonTeamMessage = formData.afternoonEvent && !afternoonTeamMode;

  // ============= RENDER =============
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

        {/* Show Instructions or Form based on state */}
        {showInstructions ? (
          <HowToRegister onProceed={() => setShowInstructions(false)} />
        ) : (
          <>
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground text-glow mb-3">
                Register for Utsavam 6.0
              </h1>
              <p className="text-muted-foreground">
                Select 1 morning event + 1 afternoon event. Team registration required for pair/group events.
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
                <Sun className="w-5 h-5 text-primary" />
                Morning Event
                <span className="text-sm font-normal text-muted-foreground ml-2">(Choose 1)</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={formData.morningEvent}
                onValueChange={(value) => handleInputChange('morningEvent', value)}
                className="space-y-3"
              >
                {MORNING_EVENTS.map((event) => (
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
                    <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                      {getEventBadge(event)}
                    </span>
                    {getEventIcon(event)}
                  </div>
                ))}
              </RadioGroup>
              {selectedMorningEvent && (
                <p className={`mt-3 text-sm flex items-center gap-2 ${morningRequiresTeam ? 'text-secondary' : 'text-muted-foreground'}`}>
                  <AlertCircle className="w-4 h-4" />
                  {getEventTypeLabel(selectedMorningEvent)}
                </p>
              )}
            </CardContent>
          </Card>

          {/* Morning Team Registration Card */}
          {morningRequiresTeam && selectedMorningEvent && (
            <Card className="bg-card/60 backdrop-blur-sm border-primary/30 animate-fade-in">
              <CardHeader className="pb-4">
                <CardTitle className="font-display text-xl text-foreground flex items-center gap-2">
                  <Sun className="w-5 h-5 text-primary" />
                  Morning Team
                  <span className="text-sm font-normal text-muted-foreground ml-2">
                    (For {selectedMorningEvent.name})
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-primary/10 p-3 rounded-lg text-sm text-primary border border-primary/20">
                  <p className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    {getEventTypeLabel(selectedMorningEvent)} – Morning Team IDs start with "M-"
                  </p>
                </div>

                <RadioGroup
                  value={morningTeamMode || ''}
                  onValueChange={(value) => setMorningTeamMode(value as TeamMode)}
                  className="grid sm:grid-cols-2 gap-3"
                >
                  <div 
                    className={`flex items-center space-x-3 p-4 rounded-lg border transition-all cursor-pointer ${
                      morningTeamMode === 'create' 
                        ? 'border-primary bg-primary/10' 
                        : 'border-border/50 hover:border-primary/50'
                    }`}
                    onClick={() => setMorningTeamMode('create')}
                  >
                    <RadioGroupItem value="create" id="create-morning-team" />
                    <div className="flex-1">
                      <Label htmlFor="create-morning-team" className="cursor-pointer font-medium flex items-center gap-2">
                        <UserPlus className="w-4 h-4" />
                        Create Morning Team
                      </Label>
                      <p className="text-xs text-muted-foreground mt-1">Start a new team as leader</p>
                    </div>
                  </div>
                  
                  <div 
                    className={`flex items-center space-x-3 p-4 rounded-lg border transition-all cursor-pointer ${
                      morningTeamMode === 'join' 
                        ? 'border-primary bg-primary/10' 
                        : 'border-border/50 hover:border-primary/50'
                    }`}
                    onClick={() => setMorningTeamMode('join')}
                  >
                    <RadioGroupItem value="join" id="join-morning-team" />
                    <div className="flex-1">
                      <Label htmlFor="join-morning-team" className="cursor-pointer font-medium flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        Join Morning Team
                      </Label>
                      <p className="text-xs text-muted-foreground mt-1">Join using Team ID</p>
                    </div>
                  </div>
                </RadioGroup>

                {morningTeamMode === 'create' && (
                  <div className="space-y-4 pt-4 border-t border-border/30 animate-fade-in">
                    <div className="space-y-2">
                      <Label htmlFor="morningTeamName">Morning Team Name</Label>
                      <Input
                        id="morningTeamName"
                        placeholder="Enter a unique team name"
                        value={morningTeamName}
                        onChange={(e) => setMorningTeamName(e.target.value)}
                        className="bg-input/50 border-border/50 focus:border-primary"
                        maxLength={30}
                      />
                    </div>
                    <div className="bg-muted/20 p-3 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Team Size:</span>
                        <span className="text-sm font-medium text-foreground">
                          {selectedMorningEvent.teamSize} members (fixed)
                        </span>
                      </div>
                    </div>
                    <div className="bg-muted/20 p-3 rounded-lg text-sm text-muted-foreground">
                      <p className="flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-primary" />
                        A Morning Team ID (M-XXXX) will be generated. Share it with your teammates.
                      </p>
                    </div>
                  </div>
                )}

                {morningTeamMode === 'join' && (
                  <div className="space-y-4 pt-4 border-t border-border/30 animate-fade-in">
                    <div className="space-y-2">
                      <Label htmlFor="joinMorningTeamId">Morning Team ID</Label>
                      <Input
                        id="joinMorningTeamId"
                        placeholder="e.g., M-A1B2"
                        value={joinMorningTeamId}
                        onChange={(e) => setJoinMorningTeamId(e.target.value.toUpperCase())}
                        className="bg-input/50 border-border/50 focus:border-primary uppercase"
                        maxLength={6}
                      />
                      <p className="text-xs text-muted-foreground">Get this ID from your morning team leader</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Afternoon Events Card */}
          <Card className="bg-card/60 backdrop-blur-sm border-border/50">
            <CardHeader className="pb-4">
              <CardTitle className="font-display text-xl text-foreground flex items-center gap-2">
                <Sunset className="w-5 h-5 text-secondary" />
                Afternoon Event
                <span className="text-sm font-normal text-muted-foreground ml-2">(Choose 1)</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={formData.afternoonEvent}
                onValueChange={(value) => handleInputChange('afternoonEvent', value)}
                className="space-y-3"
              >
                {AFTERNOON_EVENTS.map((event) => (
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
                    <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                      {getEventBadge(event)}
                    </span>
                    {getEventIcon(event)}
                  </div>
                ))}
              </RadioGroup>
              {selectedAfternoonEvent && (
                <p className="mt-3 text-sm text-secondary flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  {getEventTypeLabel(selectedAfternoonEvent)} – Team registration required
                </p>
              )}
            </CardContent>
          </Card>

          {/* Afternoon Team Registration Card */}
          {selectedAfternoonEvent && (
            <Card className="bg-card/60 backdrop-blur-sm border-secondary/30 animate-fade-in">
              <CardHeader className="pb-4">
                <CardTitle className="font-display text-xl text-foreground flex items-center gap-2">
                  <Sunset className="w-5 h-5 text-secondary" />
                  Afternoon Team
                  <span className="text-sm font-normal text-muted-foreground ml-2">
                    (For {selectedAfternoonEvent.name})
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-secondary/10 p-3 rounded-lg text-sm text-secondary border border-secondary/20">
                  <p className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    {getEventTypeLabel(selectedAfternoonEvent)} – Afternoon Team IDs start with "A-"
                  </p>
                </div>

                <RadioGroup
                  value={afternoonTeamMode || ''}
                  onValueChange={(value) => setAfternoonTeamMode(value as TeamMode)}
                  className="grid sm:grid-cols-2 gap-3"
                >
                  <div 
                    className={`flex items-center space-x-3 p-4 rounded-lg border transition-all cursor-pointer ${
                      afternoonTeamMode === 'create' 
                        ? 'border-secondary bg-secondary/10' 
                        : 'border-border/50 hover:border-secondary/50'
                    }`}
                    onClick={() => setAfternoonTeamMode('create')}
                  >
                    <RadioGroupItem value="create" id="create-afternoon-team" />
                    <div className="flex-1">
                      <Label htmlFor="create-afternoon-team" className="cursor-pointer font-medium flex items-center gap-2">
                        <UserPlus className="w-4 h-4" />
                        Create Afternoon Team
                      </Label>
                      <p className="text-xs text-muted-foreground mt-1">Start a new team as leader</p>
                    </div>
                  </div>
                  
                  <div 
                    className={`flex items-center space-x-3 p-4 rounded-lg border transition-all cursor-pointer ${
                      afternoonTeamMode === 'join' 
                        ? 'border-secondary bg-secondary/10' 
                        : 'border-border/50 hover:border-secondary/50'
                    }`}
                    onClick={() => setAfternoonTeamMode('join')}
                  >
                    <RadioGroupItem value="join" id="join-afternoon-team" />
                    <div className="flex-1">
                      <Label htmlFor="join-afternoon-team" className="cursor-pointer font-medium flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        Join Afternoon Team
                      </Label>
                      <p className="text-xs text-muted-foreground mt-1">Join using Team ID</p>
                    </div>
                  </div>
                </RadioGroup>

                {afternoonTeamMode === 'create' && (
                  <div className="space-y-4 pt-4 border-t border-border/30 animate-fade-in">
                    <div className="space-y-2">
                      <Label htmlFor="afternoonTeamName">Afternoon Team Name</Label>
                      <Input
                        id="afternoonTeamName"
                        placeholder="Enter a unique team name"
                        value={afternoonTeamName}
                        onChange={(e) => setAfternoonTeamName(e.target.value)}
                        className="bg-input/50 border-border/50 focus:border-secondary"
                        maxLength={30}
                      />
                    </div>
                    <div className="bg-muted/20 p-3 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Team Size:</span>
                        <span className="text-sm font-medium text-foreground">
                          {selectedAfternoonEvent.teamSize} members (fixed)
                        </span>
                      </div>
                    </div>
                    <div className="bg-muted/20 p-3 rounded-lg text-sm text-muted-foreground">
                      <p className="flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-secondary" />
                        An Afternoon Team ID (A-XXXX) will be generated. Share it with your teammates.
                      </p>
                    </div>
                  </div>
                )}

                {afternoonTeamMode === 'join' && (
                  <div className="space-y-4 pt-4 border-t border-border/30 animate-fade-in">
                    <div className="space-y-2">
                      <Label htmlFor="joinAfternoonTeamId">Afternoon Team ID</Label>
                      <Input
                        id="joinAfternoonTeamId"
                        placeholder="e.g., A-X1Y2"
                        value={joinAfternoonTeamId}
                        onChange={(e) => setJoinAfternoonTeamId(e.target.value.toUpperCase())}
                        className="bg-input/50 border-border/50 focus:border-secondary uppercase"
                        maxLength={6}
                      />
                      <p className="text-xs text-muted-foreground">Get this ID from your afternoon team leader</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Validation Messages */}
          {(showMorningEventMessage || showAfternoonEventMessage) && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/20 p-3 rounded-lg">
              <AlertCircle className="w-4 h-4 text-primary" />
              <span>Please select 1 morning event and 1 afternoon event to continue.</span>
            </div>
          )}

          {showMorningTeamMessage && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/20 p-3 rounded-lg">
              <AlertCircle className="w-4 h-4 text-primary" />
              <span>Please select "Create Morning Team" or "Join Morning Team" for your morning event.</span>
            </div>
          )}

          {showAfternoonTeamMessage && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/20 p-3 rounded-lg">
              <AlertCircle className="w-4 h-4 text-secondary" />
              <span>Please select "Create Afternoon Team" or "Join Afternoon Team" for your afternoon event.</span>
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
          </>
        )}
      </div>
    </div>
  );
};

export default Register;
