import { NextResponse } from 'next/server';

// Store WebSocket connection info
let wsStatus = {
    connected: false,
    lastEvent: null,
    eventCount: 0,
    newTokens: []
};

/**
 * GET /api/pumpfun/monitor
 * Get monitoring status and recent token launches
 */
export async function GET(req) {
    return NextResponse.json({
        success: true,
        status: wsStatus.connected ? 'connected' : 'disconnected',
        lastEvent: wsStatus.lastEvent,
        eventCount: wsStatus.eventCount,
        recentTokens: wsStatus.newTokens.slice(-20) // Last 20 tokens
    });
}

/**
 * POST /api/pumpfun/monitor
 * Start/stop monitoring via WebSocket
 * 
 * Body:
 * {
 *   action: "start" | "stop"
 * }
 */
export async function POST(req) {
    try {
        const body = await req.json();
        const { action } = body;

        if (action === 'start') {
            // In a real implementation, this would start a WebSocket connection
            // For now, we'll just update the status
            wsStatus.connected = true;

            return NextResponse.json({
                success: true,
                message: 'Monitoring started',
                status: 'connected'
            });
        }

        if (action === 'stop') {
            wsStatus.connected = false;

            return NextResponse.json({
                success: true,
                message: 'Monitoring stopped',
                status: 'disconnected'
            });
        }

        return NextResponse.json({
            success: false,
            error: 'Invalid action. Must be "start" or "stop"'
        }, { status: 400 });

    } catch (error) {
        console.error('Monitor API Error:', error);
        return NextResponse.json({
            success: false,
            error: error.message
        }, { status: 500 });
    }
}

/**
 * Handle new token event from WebSocket
 * This function would be called by the WebSocket client
 */
export function handleNewToken(tokenData) {
    wsStatus.lastEvent = new Date().toISOString();
    wsStatus.eventCount++;

    // Add to recent tokens
    wsStatus.newTokens.push({
        ...tokenData,
        timestamp: new Date().toISOString()
    });

    // Keep only last 50 tokens in memory
    if (wsStatus.newTokens.length > 50) {
        wsStatus.newTokens = wsStatus.newTokens.slice(-50);
    }

    // Trigger sniper logic if enabled
    // import { executeSniperLogic } from '../sniper/route.js';
    // executeSniperLogic(tokenData);
}
