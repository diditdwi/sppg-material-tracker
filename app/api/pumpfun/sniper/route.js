import { NextResponse } from 'next/server';

// Bot state
let sniperState = {
    isRunning: false,
    settings: {
        maxSolPerTrade: 0.05,
        minMarketCap: 1000,
        maxMarketCap: 20000,
        profitTargetPercent: 50,
        stopLossPercent: 20,
        trailingStopEnabled: true
    },
    positions: [],
    logs: []
};

/**
 * GET /api/pumpfun/sniper
 * Get sniper bot status and configuration
 */
export async function GET(req) {
    return NextResponse.json({
        success: true,
        ...sniperState
    });
}

/**
 * POST /api/pumpfun/sniper
 * Control sniper bot (start/stop/configure)
 * 
 * Body:
 * {
 *   action: "start" | "stop" | "configure",
 *   settings: { ... } // for configure action
 * }
 */
export async function POST(req) {
    try {
        const body = await req.json();
        const { action, settings } = body;

        if (action === 'start') {
            sniperState.isRunning = true;
            sniperState.logs.push({
                timestamp: new Date().toISOString(),
                message: '🚀 Sniper bot STARTED'
            });

            return NextResponse.json({
                success: true,
                message: 'Sniper bot started',
                isRunning: true
            });
        }

        if (action === 'stop') {
            sniperState.isRunning = false;
            sniperState.logs.push({
                timestamp: new Date().toISOString(),
                message: '⛔ Sniper bot STOPPED'
            });

            return NextResponse.json({
                success: true,
                message: 'Sniper bot stopped',
                isRunning: false
            });
        }

        if (action === 'configure') {
            if (!settings) {
                return NextResponse.json({
                    success: false,
                    error: 'Settings required for configure action'
                }, { status: 400 });
            }

            // Update settings
            sniperState.settings = {
                ...sniperState.settings,
                ...settings
            };

            sniperState.logs.push({
                timestamp: new Date().toISOString(),
                message: '⚙️ Settings updated: ' + JSON.stringify(settings)
            });

            return NextResponse.json({
                success: true,
                message: 'Settings updated',
                settings: sniperState.settings
            });
        }

        // Invalid action
        return NextResponse.json({
            success: false,
            error: 'Invalid action. Must be "start", "stop", or "configure"'
        }, { status: 400 });

    } catch (error) {
        console.error('Sniper API Error:', error);
        return NextResponse.json({
            success: false,
            error: error.message
        }, { status: 500 });
    }
}

/**
 * Execute sniper logic (called by a background job or websocket listener)
 */
export async function executeSniperLogic(tokenData) {
    if (!sniperState.isRunning) {
        return;
    }

    const { mint, name, symbol, marketCap, initialLiquidity, creator, socials } = tokenData;

    // Check if token meets criteria
    if (marketCap < sniperState.settings.minMarketCap || marketCap > sniperState.settings.maxMarketCap) {
        return; // Outside market cap range
    }

    if (initialLiquidity < 5) {
        return; // Too low liquidity
    }

    // Check if creator is blacklisted (TODO: implement blacklist)

    // Execute buy
    try {
        const buyAmount = sniperState.settings.maxSolPerTrade;

        sniperState.logs.push({
            timestamp: new Date().toISOString(),
            message: `🎯 SNIPING: ${name} (${symbol}) @ ${marketCap} MC - Buying ${buyAmount} SOL`
        });

        // Call trade API
        const tradeResponse = await fetch('http://localhost:3000/api/pumpfun/trade', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                action: 'buy',
                mint: mint,
                amount: buyAmount,
                denominatedInSol: true,
                slippage: 10, // Higher slippage for sniping
                priorityFee: 0.001 // Higher priority fee for faster execution
            })
        });

        const tradeResult = await tradeResponse.json();

        if (tradeResult.success) {
            // Add to positions
            sniperState.positions.push({
                mint: mint,
                name: name,
                symbol: symbol,
                entryPrice: marketCap,
                entryTime: new Date().toISOString(),
                amount: buyAmount,
                signature: tradeResult.signature
            });

            sniperState.logs.push({
                timestamp: new Date().toISOString(),
                message: `✅ BUY SUCCESS: ${name} - TX: ${tradeResult.signature}`
            });
        } else {
            sniperState.logs.push({
                timestamp: new Date().toISOString(),
                message: `❌ BUY FAILED: ${name} - ${tradeResult.error}`
            });
        }

    } catch (error) {
        sniperState.logs.push({
            timestamp: new Date().toISOString(),
            message: `❌ ERROR: ${error.message}`
        });
    }
}
