import { NextResponse } from 'next/server';
import { getSolanaWallet, getSolBalance } from '@/app/lib/solana';
import { addBotLog } from '@/app/lib/logger';

// State shared with sniper/route.js (in-memory)
let sniperState = {
    isRunning: false,
    settings: {
        maxSolPerTrade: 0.01,
        minMarketCap: 15000,
        maxMarketCap: 60000,
        profitTargetPercent: 50,
        stopLossPercent: 20
    }
};

/**
 * POST /api/pumpfun/sniper/execute
 */
export async function POST(req) {
    try {
        const tokenData = await req.json();
        const { mint, name, symbol, vSolInBondingCurve, uri } = tokenData;

        const solInCurve = vSolInBondingCurve > 1000000 ? vSolInBondingCurve / 1000000000 : vSolInBondingCurve;
        const estimatedMarketCap = solInCurve * 200;

        // --- 1. SOCIAL DENSITY CHECK ---
        let socialScore = 0;
        let metadata = null;
        if (uri) {
            try {
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 2000);
                const metadataRes = await fetch(uri, { signal: controller.signal });
                clearTimeout(timeoutId);

                if (metadataRes.ok) {
                    metadata = await metadataRes.json();
                    if (metadata.twitter) socialScore += 2;
                    if (metadata.telegram) socialScore += 1;
                    if (metadata.website) socialScore += 2;
                    if (metadata.description && metadata.description.length > 50) socialScore += 1;
                }
            } catch (e) { /* skip */ }
        }

        // --- 2. DYNAMIC ENTRY LOGIC ---
        const isHyped = tokenData.isHyped || false;

        // AGGRESSIVE MODE: Jika ada Twitter & Telegram (Score >= 3), MC minimal turun ke $6k
        // Ini agar kita tidak telat masuk koin yang terbang cepat.
        let MIN_MC = 12000;
        let entryReason = "STANDARD";

        if (socialScore >= 5) {
            MIN_MC = 5500; // 💎 ULTRA GEM
            entryReason = "💎 EARLY BIRD";
        } else if (socialScore >= 3) {
            MIN_MC = 6500; // 🚀 AGGRESSIVE QUALITY
            entryReason = "🚀 AGGRESSIVE QUALITY";
        } else if (isHyped) {
            MIN_MC = 7500; // 🔥 MOMENTUM
            entryReason = "🔥 MOMENTUM";
        }

        // Filter Keamanan
        if (socialScore < 3) {
            const reason = `Weak Socials (${socialScore}/6)`;
            addBotLog(`⏭️ Skipped ${name} - ${reason}`);
            return NextResponse.json({ success: true, executed: false, reason });
        }

        if (estimatedMarketCap < MIN_MC || estimatedMarketCap > 65000) {
            const reason = `MC $${estimatedMarketCap.toFixed(0)} outside ${entryReason} range ($${MIN_MC}-$65k)`;
            addBotLog(`⏭️ Skipped ${name} - ${reason}`);
            return NextResponse.json({ success: true, executed: false, reason });
        }

        // --- 3. BALANCE CHECK ---
        const currentBalance = await getSolBalance();
        const MAX_SOL = 0.01;
        const GAS_RESERVE = 0.012; // Sedikit diturunkan agar lebih longgar

        if (currentBalance < (MAX_SOL + GAS_RESERVE)) {
            const reason = `Low SOL: ${currentBalance.toFixed(4)}`;
            addBotLog(`⏭️ Skipped ${name} - ${reason}`);
            return NextResponse.json({ success: true, executed: false, reason });
        }

        // EXECUTE
        addBotLog(`${entryReason}: ${name} (${symbol}) | Score: ${socialScore}/6 | MC: $${estimatedMarketCap.toFixed(0)}`);

        const tradeRes = await fetch('http://localhost:3000/api/pumpfun/trade', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                action: 'buy',
                mint: mint,
                amount: MAX_SOL,
                denominatedInSol: true,
                slippage: 30, // Ditambah ke 30% biar pasti dapet
                priorityFee: 0.006 // Ditambah biar lebih cepat
            })
        });

        const tradeResult = await tradeRes.json();
        if (tradeResult.success) {
            addBotLog(`✅ SNIPE SUCCESS: ${name} - TX: ${tradeResult.signature.substring(0, 8)}...`);
            return NextResponse.json({ success: true, executed: true, signature: tradeResult.signature });
        } else {
            addBotLog(`❌ SNIPE FAILED: ${name} - ${tradeResult.error}`);
            return NextResponse.json({ success: true, executed: false, error: tradeResult.error });
        }

    } catch (error) {
        addBotLog(`❌ SNIPER ERROR: ${error.message}`);
        return NextResponse.json({ success: false, error: error.message });
    }
}
