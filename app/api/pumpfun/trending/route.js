import { NextResponse } from 'next/server';

// In-memory cache for trending tokens
let trendingTokensCache = [];
let lastUpdate = 0;
const CACHE_DURATION = 30000; // 30 seconds

/**
 * GET /api/pumpfun/trending
 * Get trending tokens on pump.fun
 */
export async function GET(req) {
    try {
        const now = Date.now();

        // Return cached data if fresh
        if (trendingTokensCache.length > 0 && (now - lastUpdate) < CACHE_DURATION) {
            return NextResponse.json({
                success: true,
                tokens: trendingTokensCache,
                cached: true,
                lastUpdate: new Date(lastUpdate).toISOString()
            });
        }

        // TODO: Implement actual trending token fetching
        // For now, we'll use PumpPortal WebSocket data when available
        // This is a placeholder that should be replaced with real data

        const placeholderTokens = [
            {
                mint: 'example1...',
                name: 'Trending Token 1',
                symbol: 'TT1',
                marketCap: 15000,
                volume24h: 50000,
                priceChange24h: 25.5,
                bondingCurveProgress: 35,
                holders: 250
            }
        ];

        trendingTokensCache = placeholderTokens;
        lastUpdate = now;

        return NextResponse.json({
            success: true,
            tokens: trendingTokensCache,
            cached: false,
            lastUpdate: new Date(lastUpdate).toISOString()
        });

    } catch (error) {
        console.error('Trending API Error:', error);
        return NextResponse.json({
            success: false,
            error: error.message
        }, { status: 500 });
    }
}
