import { NextResponse } from 'next/server';
import { getSolanaConnection, getSolanaWallet } from '@/app/lib/solana';
import { VersionedTransaction } from '@solana/web3.js';

/**
 * POST /api/pumpfun/trade
 * Execute buy or sell trade via PumpPortal API
 * 
 * Body:
 * {
 *   action: "buy" | "sell",
 *   mint: "token_contract_address",
 *   amount: number (SOL or token amount),
 *   denominatedInSol: boolean,
 *   slippage: number (percent),
 *   priorityFee: number (SOL)
 * }
 */
export async function POST(req) {
    try {
        const body = await req.json();
        const { action, mint, amount, denominatedInSol = true, slippage = 5, priorityFee = 0.0001 } = body;

        // Validate inputs
        if (!action || !mint || !amount) {
            return NextResponse.json({
                success: false,
                error: 'Missing required parameters: action, mint, amount'
            }, { status: 400 });
        }

        if (!['buy', 'sell'].includes(action)) {
            return NextResponse.json({
                success: false,
                error: 'Invalid action. Must be "buy" or "sell"'
            }, { status: 400 });
        }

        // Get wallet
        const wallet = getSolanaWallet();
        const publicKey = wallet.publicKey.toString();

        console.log(`[PumpFun Trade] ${action.toUpperCase()} ${amount} (SOL: ${denominatedInSol}) for token ${mint}`);

        // Call PumpPortal API to get transaction
        const response = await fetch('https://pumpportal.fun/api/trade-local', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                publicKey: publicKey,
                action: action,
                mint: mint,
                amount: amount,
                denominatedInSol: denominatedInSol ? "true" : "false",
                slippage: slippage,
                priorityFee: priorityFee,
                pool: "pump"
            })
        });

        if (response.status !== 200) {
            const errorText = await response.text();
            throw new Error(`PumpPortal API error: ${response.statusText} - ${errorText}`);
        }

        // Deserialize the transaction
        const data = await response.arrayBuffer();
        const tx = VersionedTransaction.deserialize(new Uint8Array(data));

        // Sign the transaction
        tx.sign([wallet]);

        // Send the transaction
        const connection = getSolanaConnection();
        const signature = await connection.sendTransaction(tx);

        console.log(`[PumpFun Trade] Transaction sent: ${signature}`);

        // Wait for confirmation
        await connection.confirmTransaction(signature, 'confirmed');

        console.log(`[PumpFun Trade] Transaction confirmed: ${signature}`);

        // Log the trade
        const fs = require('fs');
        const tradeLog = {
            timestamp: new Date().toISOString(),
            action: action,
            mint: mint,
            amount: amount,
            denominatedInSol: denominatedInSol,
            slippage: slippage,
            priorityFee: priorityFee,
            signature: signature
        };

        try {
            fs.appendFileSync('d:/Claude/pumpfun-trades.log', JSON.stringify(tradeLog) + '\n');

            // Track positions for PnL calculation
            const positionsFile = 'd:/Claude/pumpfun-positions.json';
            if (action === 'buy') {
                let positions = [];
                if (fs.existsSync(positionsFile)) {
                    try {
                        positions = JSON.parse(fs.readFileSync(positionsFile, 'utf8'));
                    } catch (e) { positions = []; }
                }

                // Get current MC for accurate entry tracking
                let entryMc = 5000;
                try {
                    const priceRes = await fetch(`https://frontend-api.pump.fun/coins/${mint}`);
                    const coinData = await priceRes.json();
                    entryMc = coinData.usd_market_cap || 5000;
                } catch (e) {
                    console.error('Entry MC fetch failed, using default');
                }

                positions.push({
                    mint,
                    entryMc,
                    timestamp: new Date().toISOString()
                });
                fs.writeFileSync(positionsFile, JSON.stringify(positions, null, 2));
            } else if (action === 'sell') {
                if (fs.existsSync(positionsFile)) {
                    try {
                        let positions = JSON.parse(fs.readFileSync(positionsFile, 'utf8'));
                        positions = positions.filter(p => p.mint !== mint);
                        fs.writeFileSync(positionsFile, JSON.stringify(positions, null, 2));
                    } catch (e) { }
                }
            }
        } catch (logError) {
            console.error('Error writing trade/position log:', logError);
        }

        return NextResponse.json({
            success: true,
            signature: signature,
            explorerUrl: `https://solscan.io/tx/${signature}`,
            trade: {
                action: action,
                mint: mint,
                amount: amount
            }
        });

    } catch (error) {
        console.error('Trade API Error:', error);
        return NextResponse.json({
            success: false,
            error: error.message
        }, { status: 500 });
    }
}
