// ============= GOOGLE SHEETS CONFIGURATION =============
// This is the ONLY place where the Apps Script URL should be defined.
// Replace this placeholder with your deployed Google Apps Script Web App URL.
//
// Your Google Apps Script should support:
// - POST: Save registration and team data
// - GET: Fetch team data by email (e.g., ?email=user@email.com)
//
// Expected columns in Google Sheets:
// Timestamp, Name, Email, Phone, College, Department,
// MorningEventID, MorningEventName, MorningEventType, MorningTeamID, MorningTeamName,
// AfternoonEventID, AfternoonEventName, AfternoonTeamID, AfternoonTeamName,
// Role, RegistrationType

export const GOOGLE_SHEET_WEBAPP_URL =
  import.meta.env.VITE_GOOGLE_SHEET_WEBAPP_URL || "";
