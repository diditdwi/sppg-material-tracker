import { NextResponse } from 'next/server';

export async function GET() {
    try {
        // Using Polymarket Gamma API for richer exhibition data (Questions, etc.)
        // reliable public endpoint for trending/top markets
        const response = await fetch('https://gamma-api.polymarket.com/events?limit=10&active=true&closed=false&sort=volume', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            },
            next: { revalidate: 10 } // Cache for 10s
        });

        if (!response.ok) {
            throw new Error(`Gamma API Error: ${response.status}`);
        }

        const json = await response.json();

        // Gamma API returns a list of events. Each event has 'markets'.
        // We want to flatten this to get the main market for each event.

        const simplified = json.map(event => {
            // Usually the first market is the main one or we pick one
            const market = event.markets?.[0];
            if (!market) return null;

            return {
                question: event.title,
                condition_id: market.conditionId,
                tokens: market.clobTokenIds,
                rewards: market.rewards,
                // We can try to get the current price from the Outcome Prices if available in Gamma, 
                // sometimes it's in 'outcomePrices' mock or we just show the question.
                // For a 'Scanner', just the question is good.
            };
        }).filter(item => item !== null);

        return NextResponse.json({ success: true, data: simplified });
    } catch (error) {
        console.error("Market fetch error:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
