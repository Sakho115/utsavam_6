import type { VercelRequest, VercelResponse } from '@vercel/node';

// CORS headers for handling cross-origin requests
const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

interface LogPayload {
    action: 'TEAM_CREATED' | 'TEAM_JOINED' | 'REGISTRATION';
    data: Record<string, unknown>;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
    // Handle CORS preflight requests
    if (req.method === 'OPTIONS') {
        res.status(200).json({});
        return;
    }

    // Set CORS headers for the actual response
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'authorization, x-client-info, apikey, content-type');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const GOOGLE_SHEET_WEBAPP_URL = process.env.GOOGLE_SHEET_WEBAPP_URL;

        if (!GOOGLE_SHEET_WEBAPP_URL) {
            console.warn('GOOGLE_SHEET_WEBAPP_URL not configured, skipping Google Sheets logging');
            return res.status(200).json({ success: true, message: 'Google Sheets logging skipped (not configured)' });
        }

        const payload: LogPayload = req.body;
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
            return res.status(200).json({ success: true, message: 'Registration saved, but Google Sheets logging failed' });
        }

        console.log('Successfully logged to Google Sheets');
        return res.status(200).json({ success: true, message: 'Logged to Google Sheets' });

    } catch (error) {
        console.error('Error in log-to-sheets function:', error);
        // Don't fail the request - Google Sheets logging is non-critical
        return res.status(200).json({ success: true, message: 'Logging skipped due to error', error: String(error) });
    }
}
