import fs from 'fs';
import path from 'path';

const LOG_FILE = 'd:/Claude/pumpfun-bot-activity.log';

/**
 * Persist a log message to the log file and dashboard state
 */
export function addBotLog(message) {
    const logEntry = {
        timestamp: new Date().toISOString(),
        message: message
    };

    try {
        // Append to file for persistence
        fs.appendFileSync(LOG_FILE, JSON.stringify(logEntry) + '\n');
        console.log(`[BOT LOG] ${message}`);
    } catch (error) {
        console.error('Error writing bot log:', error);
    }
}

/**
 * Get recent logs
 */
export function getRecentLogs(limit = 50) {
    try {
        if (!fs.existsSync(LOG_FILE)) return [];
        const content = fs.readFileSync(LOG_FILE, 'utf8');
        const lines = content.trim().split('\n');
        return lines.slice(-limit).map(line => JSON.parse(line)).reverse();
    } catch (error) {
        console.error('Error reading bot logs:', error);
        return [];
    }
}
