import { NextResponse } from 'next/server';
import { getTokenAccounts, getSolanaWallet, getSolanaConnection } from '@/app/lib/solana';
import { addBotLog } from '@/app/lib/logger';

/**
 * GET /api/pumpfun/sniper/monitor
 * Checks all held positions and executes auto-sell if targets are met
 */
export async function GET(req) {
    try {
        // 1. Get real positions from wallet
        const tokens = await getTokenAccounts();
        const activeTokens = tokens.filter(t => t.amount > 0);

        if (activeTokens.length === 0) {
            return NextResponse.json({ success: true, message: 'No active positions to monitor' });
        }

        const logs = [];
        const fs = require('fs');
        const positionsFile = 'd:/Claude/pumpfun-positions.json';
        let positionsList = [];
        if (fs.existsSync(positionsFile)) {
            try {
                positionsList = JSON.parse(fs.readFileSync(positionsFile, 'utf8'));
            } catch (e) { positionsList = []; }
        }

        for (const token of activeTokens) {
            try {
                // Add a small delay between each token check to avoid Rate Limits
                await new Promise(r => setTimeout(r, 2000));

                const priceRes = await fetch(`https://frontend-api.pump.fun/coins/${token.mint}`);
                if (!priceRes.ok) {
                    console.warn(`[Monitor] Could not fetch price for ${token.mint}: ${priceRes.status}`);
                    continue;
                }

                const coinData = await priceRes.json();
                const currentMc = coinData.usd_market_cap;
                const uri = coinData.uri;

                // 2. Determine Dynamic Targets based on Quality
                let profitTarget = 50; // Standard: 50%
                let qualityLabel = "Standard";

                if (uri) {
                    try {
                        const metaRes = await fetch(uri);
                        if (metaRes.ok) {
                            const meta = await metaRes.json();
                            let score = 0;
                            if (meta.twitter) score += 2;
                            if (meta.telegram) score += 1;
                            if (meta.website) score += 2;
                            if (score >= 5) {
                                profitTarget = 150; // High Quality: 150%
                                qualityLabel = "💎 GEM (High-Profit)";
                            }
                        }
                    } catch (e) { /* fallback to standard */ }
                }

                // Get real entry MC from file
                const pos = positionsList.find(p => p.mint === token.mint);
                const entryMc = pos ? pos.entryMc : 5000;

                const pnlPercent = ((currentMc - entryMc) / entryMc) * 100;

                console.log(`[Auto-Sell Monitor] ${token.mint.substring(0, 8)} | Target: ${profitTarget}% (${qualityLabel}) | PnL: ${pnlPercent.toFixed(1)}%`);

                // 3. Check Targets
                const STOP_LOSS = -20;    // Safety Stop Loss

                if (pnlPercent >= profitTarget || pnlPercent <= STOP_LOSS) {
                    const reason = pnlPercent >= profitTarget ? 'TAKE PROFIT' : 'STOP LOSS';
                    addBotLog(`🚨 ${reason} TRIGGERED for ${token.mint.substring(0, 8)} at ${pnlPercent.toFixed(1)}% (${qualityLabel} target: ${profitTarget}%)`);

                    // EXECUTE SELL
                    const sellRes = await fetch('http://localhost:3000/api/pumpfun/trade', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            action: 'sell',
                            mint: token.mint,
                            amount: "100%",
                            denominatedInSol: false,
                            slippage: 25, // Higher slippage for fast moves
                            priorityFee: 0.005 // Higher priority
                        })
                    });

                    const sellResult = await sellRes.json();
                    if (sellResult.success) {
                        const msg = `✅ AUTO-SOLD ${token.mint.substring(0, 8)}: ${reason} at ${pnlPercent.toFixed(1)}%`;
                        addBotLog(msg);
                        logs.push(msg);
                    } else {
                        const msg = `❌ Auto-sell FAILED for ${token.mint.substring(0, 8)}: ${sellResult.error}`;
                        addBotLog(msg);
                        logs.push(msg);
                    }
                }
            } catch (err) {
                console.error(`Error monitoring ${token.mint}:`, err.message);
            }
        }

        return NextResponse.json({
            success: true,
            monitoredCount: activeTokens.length,
            logs: logs
        });

    } catch (error) {
        console.error('Monitor API Error:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
