import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface LogPayload {
  action: 'TEAM_CREATED' | 'TEAM_JOINED' | 'REGISTRATION';
  data: Record<string, unknown>;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const GOOGLE_SHEET_WEBAPP_URL = Deno.env.get('GOOGLE_SHEET_WEBAPP_URL');
    
    if (!GOOGLE_SHEET_WEBAPP_URL) {
      console.warn('GOOGLE_SHEET_WEBAPP_URL not configured, skipping Google Sheets logging');
      return new Response(
        JSON.stringify({ success: true, message: 'Google Sheets logging skipped (not configured)' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const payload: LogPayload = await req.json();
    console.log('Logging to Google Sheets:', payload.action, payload.data);

    // Format data for Google Sheets based on action type
    let sheetData: Record<string, unknown>;
    
    if (payload.action === 'TEAM_CREATED') {
      sheetData = {
        action: 'TEAM_CREATED',
        timestamp: new Date().toISOString(),
        teamId: payload.data.teamId,
        teamName: payload.data.teamName,
        eventType: payload.data.eventType,
        eventName: payload.data.eventName,
        teamSize: payload.data.teamSize,
        leaderName: payload.data.leaderName,
        leaderEmail: payload.data.leaderEmail,
        leaderPhone: payload.data.leaderPhone,
        leaderCollege: payload.data.leaderCollege,
        leaderDepartment: payload.data.leaderDepartment,
      };
    } else if (payload.action === 'TEAM_JOINED') {
      sheetData = {
        action: 'TEAM_JOINED',
        timestamp: new Date().toISOString(),
        teamId: payload.data.teamId,
        teamName: payload.data.teamName,
        memberName: payload.data.memberName,
        memberEmail: payload.data.memberEmail,
        memberPhone: payload.data.memberPhone,
        memberCollege: payload.data.memberCollege,
        memberDepartment: payload.data.memberDepartment,
      };
    } else {
      sheetData = {
        action: 'REGISTRATION',
        timestamp: new Date().toISOString(),
        ...payload.data,
      };
    }

    // POST to Google Sheets Web App
    const response = await fetch(GOOGLE_SHEET_WEBAPP_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(sheetData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Google Sheets API error:', response.status, errorText);
      // Don't fail the request if Google Sheets logging fails - it's just for logging
      return new Response(
        JSON.stringify({ success: true, message: 'Registration saved, but Google Sheets logging failed' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Successfully logged to Google Sheets');
    return new Response(
      JSON.stringify({ success: true, message: 'Logged to Google Sheets' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in log-to-sheets function:', error);
    // Don't fail the request - Google Sheets logging is non-critical
    return new Response(
      JSON.stringify({ success: true, message: 'Logging skipped due to error', error: String(error) }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
