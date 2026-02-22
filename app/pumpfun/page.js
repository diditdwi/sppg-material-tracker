'use client';

import { useState, useEffect } from 'react';

export default function PumpFunDashboard() {
    const [wallet, setWallet] = useState(null);
    const [sniperStatus, setSniperStatus] = useState({ isRunning: false, settings: {} });
    const [trendingTokens, setTrendingTokens] = useState([]);
    const [positions, setPositions] = useState([]);
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch wallet info
    useEffect(() => {
        fetchWallet();
        fetchSniperStatus();
        fetchTrendingTokens();

        // Refresh every 10 seconds
        const interval = setInterval(() => {
            fetchWallet();
            fetchSniperStatus();
            fetchTrendingTokens();
        }, 10000);

        return () => clearInterval(interval);
    }, []);

    async function fetchWallet() {
        try {
            const res = await fetch('/api/pumpfun/wallet');
            const data = await res.json();
            if (data.success) {
                setWallet(data.wallet);
            }
        } catch (error) {
            console.error('Error fetching wallet:', error);
        } finally {
            setLoading(false);
        }
    }

    async function fetchSniperStatus() {
        try {
            const res = await fetch('/api/pumpfun/sniper');
            const data = await res.json();
            if (data.success) {
                setSniperStatus({
                    isRunning: data.isRunning,
                    settings: data.settings,
                    positions: data.positions || [],
                    logs: data.logs || []
                });

                // Fetch persistent logs
                try {
                    const logsRes = await fetch('/api/pumpfun/sniper/logs');
                    const logsData = await logsRes.json();
                    if (logsData.success) {
                        setLogs(logsData.logs || []);
                    }
                } catch (e) {
                    console.error('Error fetching logs:', e);
                }
            }
        } catch (error) {
            console.error('Error fetching sniper status:', error);
        }
    }

    async function fetchTrendingTokens() {
        try {
            const res = await fetch('/api/pumpfun/trending');
            const data = await res.json();
            if (data.success) {
                setTrendingTokens(data.tokens || []);
            }
        } catch (error) {
            console.error('Error fetching trending tokens:', error);
        }
    }

    async function toggleSniper() {
        try {
            const action = sniperStatus.isRunning ? 'stop' : 'start';
            const res = await fetch('/api/pumpfun/sniper', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action })
            });
            const data = await res.json();
            if (data.success) {
                fetchSniperStatus();
            }
        } catch (error) {
            console.error('Error toggling sniper:', error);
        }
    }

    async function executeTrade(mint, action, amount) {
        try {
            const res = await fetch('/api/pumpfun/trade', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action,
                    mint,
                    amount,
                    denominatedInSol: true,
                    slippage: 5,
                    priorityFee: 0.0001
                })
            });
            const data = await res.json();
            if (data.success) {
                alert(`Trade successful! TX: ${data.signature}`);
                fetchWallet();
                fetchSniperStatus();
            } else {
                alert(`Trade failed: ${data.error}`);
            }
        } catch (error) {
            console.error('Error executing trade:', error);
            alert(`Trade error: ${error.message}`);
        }
    }

    // Derive displayed positions from real wallet tokens
    const displayPositions = wallet?.tokenAccounts?.filter(acc => acc.amount > 0) || [];

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-pink-900 flex items-center justify-center">
                <div className="text-white text-2xl">Loading Pump.fun Bot...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-pink-900 text-white p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-5xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                            🚀 Pump.fun Sniper Bot
                        </h1>
                        <p className="text-gray-400">Automated trading bot for pump.fun meme coins</p>
                    </div>
                    <button
                        onClick={() => window.location.href = '/pumpfun/launch'}
                        className="px-8 py-4 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-black font-black rounded-xl shadow-[0_0_20px_rgba(234,179,8,0.4)] transition-all transform hover:scale-105 active:scale-95"
                    >
                        🪙 LAUNCH NEW TOKEN
                    </button>
                </div>

                {/* Wallet Info */}
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 mb-6 border border-white/20">
                    <h2 className="text-2xl font-bold mb-4">💼 Wallet</h2>
                    {wallet ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <p className="text-gray-400 text-sm">Public Key</p>
                                <p className="font-mono text-sm">{wallet.publicKey}</p>
                            </div>
                            <div>
                                <p className="text-gray-400 text-sm">SOL Balance</p>
                                <p className="text-3xl font-bold text-green-400">{wallet.solBalance} SOL</p>
                            </div>
                        </div>
                    ) : (
                        <p className="text-red-400">Wallet not loaded</p>
                    )}
                </div>

                {/* Sniper Control */}
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 mb-6 border border-white/20">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-bold">🎯 Sniper Bot</h2>
                        <button
                            onClick={toggleSniper}
                            className={`px-6 py-3 rounded-lg font-bold transition-all ${sniperStatus.isRunning
                                ? 'bg-red-500 hover:bg-red-600'
                                : 'bg-green-500 hover:bg-green-600'
                                }`}
                        >
                            {sniperStatus.isRunning ? '⛔ STOP BOT' : '🚀 START BOT'}
                        </button>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div className="bg-black/30 rounded-lg p-3">
                            <p className="text-gray-400 text-xs">Status</p>
                            <p className={`font-bold ${sniperStatus.isRunning ? 'text-green-400' : 'text-red-400'}`}>
                                {sniperStatus.isRunning ? '🟢 ACTIVE' : '🔴 STOPPED'}
                            </p>
                        </div>
                        <div className="bg-black/30 rounded-lg p-3">
                            <p className="text-gray-400 text-xs">Max SOL/Trade</p>
                            <p className="font-bold">{sniperStatus.settings.maxSolPerTrade || 0.05} SOL</p>
                        </div>
                        <div className="bg-black/30 rounded-lg p-3">
                            <p className="text-gray-400 text-xs">Profit Target</p>
                            <p className="font-bold text-green-400">+{sniperStatus.settings.profitTargetPercent || 50}%</p>
                        </div>
                        <div className="bg-black/30 rounded-lg p-3">
                            <p className="text-gray-400 text-xs">Stop Loss</p>
                            <p className="font-bold text-red-400">-{sniperStatus.settings.stopLossPercent || 20}%</p>
                        </div>
                    </div>
                </div>

                {/* Active Positions */}
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 mb-6 border border-white/20">
                    <h2 className="text-2xl font-bold mb-4">📊 Active Positions (Real-time Wallet)</h2>
                    {displayPositions.length > 0 ? (
                        <div className="space-y-3">
                            {displayPositions.map((pos, idx) => (
                                <div key={idx} className="bg-black/30 rounded-lg p-4 flex justify-between items-center">
                                    <div>
                                        <p className="font-bold text-lg">Token Account: {pos.mint.substring(0, 8)}...</p>
                                        <p className="text-sm text-green-400 font-bold">{pos.amount.toLocaleString()} Tokens</p>
                                        <p className="text-xs text-gray-500 font-mono">{pos.mint}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => executeTrade(pos.mint, 'sell', pos.amount * 0.5)}
                                            className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 rounded-lg font-bold"
                                        >
                                            Sell 50%
                                        </button>
                                        <button
                                            onClick={() => executeTrade(pos.mint, 'sell', pos.amount)}
                                            className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg font-bold"
                                        >
                                            Sell 100%
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-400 text-center py-8">No active positions</p>
                    )}
                </div>

                {/* Trending Tokens */}
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 mb-6 border border-white/20">
                    <h2 className="text-2xl font-bold mb-4">🔥 Trending Tokens</h2>
                    {trendingTokens.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {trendingTokens.map((token, idx) => (
                                <div key={idx} className="bg-black/30 rounded-lg p-4">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <p className="font-bold text-lg">{token.name}</p>
                                            <p className="text-sm text-gray-400">{token.symbol}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm text-gray-400">Market Cap</p>
                                            <p className="font-bold">${(token.marketCap || 0).toLocaleString()}</p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-3 gap-2 text-xs mb-3">
                                        <div>
                                            <p className="text-gray-400">24h Vol</p>
                                            <p className="font-bold">${(token.volume24h || 0).toLocaleString()}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-400">24h Change</p>
                                            <p className={`font-bold ${token.priceChange24h > 0 ? 'text-green-400' : 'text-red-400'}`}>
                                                {token.priceChange24h > 0 ? '+' : ''}{token.priceChange24h}%
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-gray-400">Holders</p>
                                            <p className="font-bold">{token.holders || 0}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => {
                                            const amount = prompt('Enter SOL amount to buy:', '0.01');
                                            if (amount) executeTrade(token.mint, 'buy', parseFloat(amount));
                                        }}
                                        className="w-full px-4 py-2 bg-green-500 hover:bg-green-600 rounded-lg font-bold"
                                    >
                                        Quick Buy
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-400 text-center py-8">No trending tokens available. Start monitoring to see new launches!</p>
                    )}
                </div>

                {/* Logs */}
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                    <h2 className="text-2xl font-bold mb-4">📝 Bot Logs</h2>
                    <div className="bg-black/50 rounded-lg p-4 font-mono text-sm max-h-64 overflow-y-auto">
                        {logs.length > 0 ? (
                            logs.slice().reverse().map((log, idx) => (
                                <div key={idx} className="mb-2">
                                    <span className="text-gray-400">{log.timestamp}</span> - {log.message}
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-400">No logs yet. Start the bot to see activity.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
