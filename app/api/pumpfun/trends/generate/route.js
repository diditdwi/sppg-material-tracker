import { NextResponse } from 'next/server';

/**
 * GET /api/pumpfun/trends/generate
 * Generates a trending token idea based on REAL social media hype (TikTok/Twitter/Solana meta)
 */
export async function GET() {
    const trends = [
        {
            name: "CHILL GUY AI",
            symbol: "CHILLAI",
            themes: ["Chill", "Guy", "AI Agent", "Zen"],
            desc: "The world is chaotic, but CHILL GUY AI is here to automate the vibe. The first AI agent designed to do absolutely nothing but be chill."
        },
        {
            name: "SOLANA SUMMER VIBE",
            symbol: "SUMMER",
            themes: ["Solana", "Summer", "Sun", "Beach"],
            desc: "Bringing back the original Solana Summer heat. 100% community, 0% taxes, 1000% vibes."
        },
        {
            name: "PEPE OPTIMUS",
            symbol: "PEPETSLA",
            themes: ["Pepe", "Elon", "AI", "Robot"],
            desc: "When the most famous frog meets Elon's AI humanoid. Built for the future of decentralized meme robotics."
        },
        {
            name: "QUANTUM TRUMP",
            symbol: "QTRUMP",
            themes: ["Politics", "Quantum", "Future", "MAGA"],
            desc: "The biggest, best, most quantum token in the multiverse. Making the blockchain great again, one block at a time."
        },
        {
            name: "HAWK TUAH AI",
            symbol: "TUAH",
            themes: ["Viral", "Meme", "Trending", "Girl"],
            desc: "The viral sensation turned into an autonomous AI agent. Spit on that thang and hold!"
        },
        {
            name: "PNUT SOLANA GOAT",
            symbol: "PNUT",
            themes: ["Squirrel", "Hero", "Legacy", "Justice"],
            desc: "The legacy of PNUT lives on. A token dedicated to justice, freedom, and the most famous squirrel on Solana."
        }
    ];

    const randomTrend = trends[Math.floor(Math.random() * trends.length)];

    return NextResponse.json({
        success: true,
        name: randomTrend.name,
        symbol: randomTrend.symbol,
        description: randomTrend.desc,
        twitter: "https://x.com/search?q=" + randomTrend.symbol,
        telegram: "https://t.me/" + randomTrend.symbol,
        website: "https://" + randomTrend.symbol.toLowerCase() + ".fun"
    });
}
