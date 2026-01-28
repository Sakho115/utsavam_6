import { supabase } from '@/integrations/supabase/client';

export interface TeamMember {
    name: string;
    email: string;
    phone: string;
    college: string;
    department: string;
    joinedAt: string;
}

export interface TeamData {
    id?: string;
    team_id: string;
    team_name: string;
    event_type: 'Morning' | 'Afternoon';
    event_name: string;
    team_size: number;
    leader_name: string;
    leader_email: string;
    leader_phone: string;
    leader_college?: string;
    leader_department?: string;
    members: TeamMember[];
    status: 'OPEN' | 'FULL';
    created_at?: string;
    updated_at?: string;
}

export interface RegistrationData {
    registration_id: string;
    full_name: string;
    college: string;
    department: string;
    phone: string;
    email: string;
    morning_event: string;
    afternoon_event: string;
    registration_type: 'SOLO' | 'CREATE_TEAM' | 'JOIN_TEAM';
    team_id?: string;
    team_name?: string;
    is_team_leader: boolean;
}

// Generate team ID with prefix based on event type
export const generateTeamId = (eventType: 'Morning' | 'Afternoon'): string => {
    const prefix = eventType === 'Morning' ? 'M' : 'A';
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 4; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return `${prefix}-${result}`;
};

// Generate registration ID
export const generateRegistrationId = (): string => {
    return 'reg_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
};

// Create a new team in Lovable Cloud
export const createTeam = async (teamData: Omit<TeamData, 'id' | 'created_at' | 'updated_at'>): Promise<{ success: boolean; teamId?: string; error?: string }> => {
    try {
        const { data, error } = await supabase
            .from('teams')
            .insert({
                team_id: teamData.team_id,
                team_name: teamData.team_name,
                event_type: teamData.event_type,
                event_name: teamData.event_name,
                team_size: teamData.team_size,
                leader_name: teamData.leader_name,
                leader_email: teamData.leader_email,
                leader_phone: teamData.leader_phone,
                leader_college: teamData.leader_college,
                leader_department: teamData.leader_department,
                members: JSON.parse(JSON.stringify(teamData.members)),
                status: teamData.status,
            })
            .select('team_id')
            .single();

        if (error) {
            console.error('Error creating team:', error);
            return { success: false, error: error.message };
        }

        // Log to Google Sheets (non-blocking)
        logToSheets('TEAM_CREATED', {
            teamId: teamData.team_id,
            teamName: teamData.team_name,
            eventType: teamData.event_type,
            eventName: teamData.event_name,
            teamSize: teamData.team_size,
            leaderName: teamData.leader_name,
            leaderEmail: teamData.leader_email,
            leaderPhone: teamData.leader_phone,
            leaderCollege: teamData.leader_college,
            leaderDepartment: teamData.leader_department,
        });

        return { success: true, teamId: data.team_id };
    } catch (error) {
        console.error('Error creating team:', error);
        return { success: false, error: String(error) };
    }
};

// Fetch team by team ID
export const getTeamByTeamId = async (teamId: string): Promise<{ success: boolean; team?: TeamData; error?: string }> => {
    try {
        const { data, error } = await supabase
            .from('teams')
            .select('*')
            .eq('team_id', teamId.toUpperCase())
            .maybeSingle();

        if (error) {
            console.error('Error fetching team:', error);
            return { success: false, error: error.message };
        }

        if (!data) {
            return { success: false, error: 'Team not found' };
        }

        // Parse members from JSONB - safely cast to unknown first
        const membersArray = Array.isArray(data.members)
            ? (data.members as unknown as TeamMember[])
            : [];

        const team: TeamData = {
            ...data,
            event_type: data.event_type as 'Morning' | 'Afternoon',
            status: data.status as 'OPEN' | 'FULL',
            members: membersArray,
        };

        return { success: true, team };
    } catch (error) {
        console.error('Error fetching team:', error);
        return { success: false, error: String(error) };
    }
};

// Check if team name already exists for an event
export const checkTeamNameExists = async (teamName: string, eventName: string): Promise<boolean> => {
    try {
        const { data, error } = await supabase
            .from('teams')
            .select('id')
            .ilike('team_name', teamName.trim())
            .eq('event_name', eventName)
            .maybeSingle();

        if (error) {
            console.error('Error checking team name:', error);
            return false;
        }

        return !!data;
    } catch (error) {
        console.error('Error checking team name:', error);
        return false;
    }
};

// Join an existing team
export const joinTeam = async (
    teamId: string,
    member: TeamMember
): Promise<{ success: boolean; team?: TeamData; error?: string }> => {
    try {
        // First, fetch the current team data
        const teamResult = await getTeamByTeamId(teamId);

        if (!teamResult.success || !teamResult.team) {
            return { success: false, error: teamResult.error || 'Team not found' };
        }

        const team = teamResult.team;

        // Check if team is full
        if (team.status === 'FULL') {
            return { success: false, error: 'This team is already full' };
        }

        // Check if email already exists in team
        const emailExists =
            team.leader_email === member.email ||
            team.members.some(m => m.email === member.email);

        if (emailExists) {
            return { success: false, error: 'You are already registered in this team' };
        }

        // Add member to the team
        const updatedMembers = [...team.members, member];

        // Check if team is now full (leader + members = teamSize)
        const newStatus = updatedMembers.length + 1 >= team.team_size ? 'FULL' : 'OPEN';

        // Update the team in database
        const { error: updateError } = await supabase
            .from('teams')
            .update({
                members: JSON.parse(JSON.stringify(updatedMembers)),
                status: newStatus,
            })
            .eq('team_id', teamId.toUpperCase());

        if (updateError) {
            console.error('Error updating team:', updateError);
            return { success: false, error: updateError.message };
        }

        // Log to Google Sheets (non-blocking)
        logToSheets('TEAM_JOINED', {
            teamId: team.team_id,
            teamName: team.team_name,
            memberName: member.name,
            memberEmail: member.email,
            memberPhone: member.phone,
            memberCollege: member.college,
            memberDepartment: member.department,
        });

        return {
            success: true,
            team: { ...team, members: updatedMembers, status: newStatus as 'OPEN' | 'FULL' }
        };
    } catch (error) {
        console.error('Error joining team:', error);
        return { success: false, error: String(error) };
    }
};

// Save registration to database
export const saveRegistration = async (registration: RegistrationData): Promise<{ success: boolean; error?: string }> => {
    try {
        const { error } = await supabase
            .from('registrations')
            .insert(registration);

        if (error) {
            console.error('Error saving registration:', error);
            return { success: false, error: error.message };
        }

        // Log to Google Sheets (non-blocking)
        logToSheets('REGISTRATION', {
            registrationId: registration.registration_id,
            fullName: registration.full_name,
            college: registration.college,
            department: registration.department,
            phone: registration.phone,
            email: registration.email,
            morningEvent: registration.morning_event,
            afternoonEvent: registration.afternoon_event,
            registrationType: registration.registration_type,
            teamId: registration.team_id,
            teamName: registration.team_name,
            isTeamLeader: registration.is_team_leader,
        });

        return { success: true };
    } catch (error) {
        console.error('Error saving registration:', error);
        return { success: false, error: String(error) };
    }
};

// Non-blocking function to log to Google Sheets via Vercel Serverless Function
const logToSheets = async (
    action: 'TEAM_CREATED' | 'TEAM_JOINED' | 'REGISTRATION',
    data: Record<string, unknown>
) => {
    try {
        // Fire and forget - don't await and don't block the main flow
        fetch('/api/log-to-sheets', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ action, data }),
        }).then(result => {
            if (!result.ok) {
                console.warn('Google Sheets logging failed:', result.statusText);
            } else {
                console.log('Google Sheets logging successful');
            }
        }).catch(err => {
            console.warn('Google Sheets logging error:', err);
        });
    } catch (error) {
        console.warn('Google Sheets logging error:', error);
    }
};
