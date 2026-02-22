import { NextResponse } from 'next/server';
import { getClobClient } from '@/app/lib/polymarket';
import { Side } from "@polymarket/clob-client";

// In-memory state for demo purposes (since we might not have a database)
// In prod, use Redis or DB
let botState = {
    isRunning: false,
    activePositions: []
    // Structure: { marketId, entryPrice, qty, currentPrice }
};

export async function POST(req) {
    try {
        const body = await req.json();
        const { action, toggleState } = body;

        // 1. Handle Toggle ON/OFF
        if (action === 'TOGGLE') {
            botState.isRunning = toggleState;
            return NextResponse.json({ success: true, isRunning: botState.isRunning, message: `Bot ${toggleState ? 'STARTED' : 'STOPPED'}` });
        }

        // If bot is stopped, do nothing on tick
        if (!botState.isRunning && action === 'TICK') {
            return NextResponse.json({ success: true, status: 'STOPPED' });
        }

        // 2. LOGIC ENGINE (The "Brain")
        const client = getClobClient();
        const logs = [];

        // --- A. RISK MANAGEMENT (EXIT RULES) ---
        // Fetch real positions if possible
        let positions = [];
        try {
            // Mocking positions for the logic demonstration if wallet empty
            // In real code: positions = await client.getPositions(...)
            // Let's assume we have one "virtual" position for testing the logic
            /* 
            positions = [{ 
               conditionId: '0x123...', 
               side: 'YES', 
               entryPrice: 0.50, 
               currentPrice: 0.48, // -4% Loss -> Should Trigger SL
               size: 10 
            }];
            */
        } catch (e) { console.log("Pos fetch error", e); }

        // Logic Loop for Exits
        for (const pos of positions) {
            const pnlPercent = ((pos.currentPrice - pos.entryPrice) / pos.entryPrice) * 100;

            // STOP LOSS (-3%)
            if (pnlPercent <= -3) {
                logs.push(`⚠️ STOP LOSS TRIGGERED: ${pos.conditionId} (PnL: ${pnlPercent.toFixed(2)}%)`);
                // await client.createOrder({ side: Side.SELL, ... })
            }

            // TAKE PROFIT (+5%)
            else if (pnlPercent >= 5) {
                logs.push(`✅ TAKE PROFIT TRIGGERED: ${pos.conditionId} (PnL: ${pnlPercent.toFixed(2)}%)`);
                // await client.createOrder({ side: Side.SELL, ... })
            }
        }

        // --- B. ENTRY LOGIC (OPPORTUNITY SCANNER) ---
        // Only look for new trades if we have capacity (e.g., max 1 open position)
        if (positions.length < 1) {
            // Fetch top markets by VOLUME (high liquidity)
            const trendingRes = await fetch('https://gamma-api.polymarket.com/events?limit=20&active=true&closed=false&order=volume24hr');
            const trending = await trendingRes.json();

            // REAL STRATEGY: Volume + Value Detection
            let bestOpportunity = null;
            let bestScore = 0;

            for (const event of trending) {
                if (!event.markets || event.markets.length === 0) continue;

                const market = event.markets[0]; // Primary market (usually Yes/No)

                // Filter criteria
                const volume = parseFloat(market.volume || 0);
                const liquidity = parseFloat(market.liquidity || 0);

                // MINIMUM REQUIREMENTS
                if (volume < 10000) continue; // Skip low volume (<$10k)
                if (liquidity < 1000) continue; // Skip illiquid markets
                if (!market.clobTokenIds || market.clobTokenIds.length === 0) continue;

                // Get current market prices
                const outcomes = market.outcomes || [];
                const yesPrice = parseFloat(outcomes[0]?.price || 0.5);
                const noPrice = parseFloat(outcomes[1]?.price || 0.5);

                // VALUE DETECTION LOGIC
                // Look for markets where price is significantly different from 50/50
                // but has high volume (indicating uncertainty/opportunity)

                let opportunityScore = 0;
                let signal = null;

                // Scenario 1: Undervalued YES (price < 30% but high volume)
                if (yesPrice < 0.30 && volume > 50000) {
                    opportunityScore = (0.30 - yesPrice) * 100 + (volume / 10000);
                    signal = { side: 'YES', price: yesPrice, reason: 'Undervalued YES with high volume' };
                }
                // Scenario 2: Undervalued NO (price < 30% but high volume)
                else if (noPrice < 0.30 && volume > 50000) {
                    opportunityScore = (0.30 - noPrice) * 100 + (volume / 10000);
                    signal = { side: 'NO', price: noPrice, reason: 'Undervalued NO with high volume' };
                }
                // Scenario 3: High volume + extreme pricing (potential reversal)
                else if (volume > 100000 && (yesPrice < 0.15 || yesPrice > 0.85)) {
                    const edge = yesPrice < 0.15 ? (0.15 - yesPrice) : (yesPrice - 0.85);
                    opportunityScore = edge * 50 + (volume / 20000);
                    signal = {
                        side: yesPrice < 0.15 ? 'YES' : 'NO',
                        price: yesPrice < 0.15 ? yesPrice : noPrice,
                        reason: 'Extreme pricing with massive volume'
                    };
                }

                // Track best opportunity
                if (signal && opportunityScore > bestScore) {
                    bestScore = opportunityScore;
                    bestOpportunity = {
                        event: event,
                        market: market,
                        signal: signal,
                        score: opportunityScore,
                        volume: volume,
                        liquidity: liquidity
                    };
                }
            }

            // Execute if we found a good opportunity
            if (bestOpportunity && bestScore > 5) {
                const opp = bestOpportunity;
                logs.push(`🚀 BUY SIGNAL: "${opp.event.title}"`);
                logs.push(`   Reason: ${opp.signal.reason}`);
                logs.push(`   ${opp.signal.side} @ $${opp.signal.price.toFixed(3)} | Vol: $${(opp.volume / 1000).toFixed(1)}k | Score: ${opp.score.toFixed(1)}`);

                // ⚠️ REAL TRADING ENABLED ⚠️
                if (client.signer) {
                    try {
                        const MAX_TRADE_AMOUNT = 1.0;
                        const tradeAmount = MAX_TRADE_AMOUNT;

                        // Determine which token to buy (YES or NO)
                        const tokenIndex = opp.signal.side === 'YES' ? 0 : 1;
                        const tokenId = opp.market.clobTokenIds[tokenIndex];

                        if (!tokenId) {
                            logs.push(`⚠️ No token ID found for ${opp.signal.side}`);
                        } else {
                            // Get current orderbook
                            const orderbook = await client.getOrderBook(tokenId);
                            const bestAsk = orderbook.asks?.[0];

                            if (!bestAsk) {
                                logs.push(`⚠️ No liquidity available for this market`);
                            } else {
                                const price = parseFloat(bestAsk.price);
                                const size = (tradeAmount / price).toFixed(2);

                                logs.push(`📋 Creating order: ${size} shares @ $${price} (Total: ~$${tradeAmount})`);

                                // Derive API keys
                                const creds = await client.createOrDeriveApiKey();
                                const { ClobClient } = require("@polymarket/clob-client");
                                const authClient = new ClobClient("https://clob.polymarket.com", 137, client.signer, creds);

                                // Create and post order
                                const order = await authClient.createOrder({
                                    tokenID: tokenId,
                                    price: price,
                                    side: Side.BUY,
                                    size: parseFloat(size),
                                });

                                const result = await authClient.postOrder(order, { orderType: "GTC" });

                                logs.push(`✅ ORDER EXECUTED!`);
                                logs.push(`→ Order ID: ${result.orderID || result.id}`);
                                logs.push(`→ Status: ${result.status || 'PENDING'}`);
                                logs.push(`→ Check Polygonscan for confirmation`);

                                // Log to file
                                const fs = require('fs');
                                const tradeLog = {
                                    timestamp: new Date().toISOString(),
                                    market: opp.event.title,
                                    side: opp.signal.side,
                                    tokenId: tokenId,
                                    price: price,
                                    size: size,
                                    amount: tradeAmount,
                                    volume: opp.volume,
                                    reason: opp.signal.reason,
                                    score: opp.score,
                                    orderId: result.orderID || result.id,
                                    status: result.status
                                };
                                fs.appendFileSync('d:/Claude/trade-history.log', JSON.stringify(tradeLog) + '\n');
                            }
                        }
                    } catch (orderError) {
                        logs.push(`❌ ORDER FAILED: ${orderError.message}`);
                        console.error("Order execution error:", orderError);
                    }
                } else {
                    logs.push(`→ WAITING FOR WALLET (Simulation Mode)`);
                }
            } else {
                logs.push(`Scanning ${trending.length} markets... No strong signals (Best Score: ${bestScore.toFixed(1)}, Need: >5)`);
            }
        }

        return NextResponse.json({
            success: true,
            logs: logs,
            isRunning: botState.isRunning
        });

    } catch (error) {
        console.error("Bot Engine Error:", error);
        return NextResponse.json({ success: false, error: error.message });
    }
}
