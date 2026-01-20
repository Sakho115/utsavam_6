import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  ArrowRight, 
  User, 
  Sun, 
  Sunset, 
  Users, 
  UserPlus, 
  ClipboardList,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

interface HowToRegisterProps {
  onProceed: () => void;
}

const HowToRegister = ({ onProceed }: HowToRegisterProps) => {
  const [understood, setUnderstood] = useState(false);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground text-glow mb-3">
          How to Register
        </h1>
        <p className="text-muted-foreground">
          Please read these instructions carefully before registering
        </p>
      </div>

      {/* Step 1: Personal Info */}
      <Card className="bg-card/60 backdrop-blur-sm border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="font-display text-lg text-foreground flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">1</div>
            <User className="w-5 h-5 text-primary" />
            Fill Your Personal Details
          </CardTitle>
        </CardHeader>
        <CardContent className="text-muted-foreground">
          <p>Enter your name with initial, Full college, department, phone number, and email address.</p>
          <p className="mt-2 text-sm text-primary/80">⚠️ Every person must register individually – including team leaders and teammates.</p>
        </CardContent>
      </Card>

      {/* Step 2: Morning Event */}
      <Card className="bg-card/60 backdrop-blur-sm border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="font-display text-lg text-foreground flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">2</div>
            <Sun className="w-5 h-5 text-amber-400" />
            Choose ONE Morning Event
          </CardTitle>
        </CardHeader>
        <CardContent className="text-muted-foreground space-y-3">
          <p>You must select exactly one morning event:</p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li><strong>Trispark</strong> – Solo (just you, no team needed)</li>
            <li><strong>Scramble Zone</strong> – Pair (exactly 2 people per team)</li>
            <li><strong>Frames to Fame</strong> – Group (exactly 3 people per team)</li>
          </ul>
        </CardContent>
      </Card>

      {/* Step 3: Afternoon Event */}
      <Card className="bg-card/60 backdrop-blur-sm border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="font-display text-lg text-foreground flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">3</div>
            <Sunset className="w-5 h-5 text-orange-400" />
            Choose ONE Afternoon Event
          </CardTitle>
        </CardHeader>
        <CardContent className="text-muted-foreground space-y-3">
          <p>You must also select exactly one afternoon event:</p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li><strong>Wordora</strong> – Group (exactly 3 people per team)</li>
            <li><strong>The Static Chase</strong> – Group (exactly 3 people per team)</li>
          </ul>
          <p className="text-sm text-primary/80">⚠️ All afternoon events require team registration.</p>
        </CardContent>
      </Card>

      {/* Step 4: Team Registration */}
      <Card className="bg-card/60 backdrop-blur-sm border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="font-display text-lg text-foreground flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">4</div>
            <Users className="w-5 h-5 text-primary" />
            Team Registration (If Required)
          </CardTitle>
        </CardHeader>
        <CardContent className="text-muted-foreground space-y-4">
          <p>For pair or group events, you need to either create or join a team:</p>
          
          <div className="grid gap-4 md:grid-cols-2">
            <div className="bg-primary/10 rounded-lg p-4 border border-primary/20">
              <div className="flex items-center gap-2 text-primary font-semibold mb-2">
                <UserPlus className="w-4 h-4" />
                Create Team (Leader)
              </div>
              <ul className="text-sm space-y-1">
                <li>• Give your team a name</li>
                <li>• You'll get a unique Team ID</li>
                <li>• Share this ID with your teammates</li>
              </ul>
            </div>
            
            <div className="bg-secondary/10 rounded-lg p-4 border border-secondary/20">
              <div className="flex items-center gap-2 text-secondary font-semibold mb-2">
                <Users className="w-4 h-4" />
                Join Team (Teammate)
              </div>
              <ul className="text-sm space-y-1">
                <li>• Get Team ID from your leader</li>
                <li>• Select the same event</li>
                <li>• Enter the Team ID to join</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Important Notes */}
      <Card className="bg-destructive/10 backdrop-blur-sm border-destructive/30">
        <CardHeader className="pb-3">
          <CardTitle className="font-display text-lg text-destructive flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            Important Notes
          </CardTitle>
        </CardHeader>
        <CardContent className="text-muted-foreground space-y-2">
          <ul className="space-y-2">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-destructive mt-0.5 flex-shrink-0" />
              <span>Morning Team IDs (start with M-) are different from Afternoon Team IDs (start with A-)</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-destructive mt-0.5 flex-shrink-0" />
              <span>You cannot join a team for a different event than the one you selected</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-destructive mt-0.5 flex-shrink-0" />
              <span>Teams cannot exceed their maximum size (pair = 2, group = 3)</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-destructive mt-0.5 flex-shrink-0" />
              <span>Each person can only be in one team per event session</span>
            </li>
          </ul>
        </CardContent>
      </Card>

      {/* Understanding Checkbox */}
      <div className="bg-card/60 backdrop-blur-sm border border-border/50 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Checkbox 
            id="understood" 
            checked={understood}
            onCheckedChange={(checked) => setUnderstood(checked === true)}
            className="mt-0.5"
          />
          <label 
            htmlFor="understood" 
            className="text-sm text-foreground cursor-pointer leading-relaxed"
          >
            I have read and understood the registration instructions. I know how to select events and manage team registration.
          </label>
        </div>
      </div>

      {/* Proceed Button */}
      <Button 
        variant="hero" 
        size="xl" 
        className="w-full group"
        disabled={!understood}
        onClick={onProceed}
      >
        <ClipboardList className="w-5 h-5 mr-2" />
        <span>Proceed to Registration Form</span>
        <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
      </Button>
    </div>
  );
};

export default HowToRegister;
