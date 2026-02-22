import { NextResponse } from 'next/server';
import { getSolanaConnection, getSolanaWallet } from '@/app/lib/solana';
import { VersionedTransaction, Keypair } from '@solana/web3.js';

/**
 * POST /api/pumpfun/launch
 * Mint a new token and perform an initial buy
 */
export async function POST(req) {
    try {
        const formData = await req.formData();
        const file = formData.get('file');
        const name = formData.get('name');
        const symbol = formData.get('symbol');
        const description = formData.get('description');
        const twitter = formData.get('twitter');
        const telegram = formData.get('telegram');
        const website = formData.get('website');
        const amount = formData.get('amount') || 0; // SOL to buy on launch
        const imageUrl = formData.get('imageUrl');

        let fileToUpload = file;

        // If no manual file, but we have an AI URL, download it on server
        if (!fileToUpload && imageUrl) {
            console.log(`[Launcher] Downloading AI Logo from: ${imageUrl}`);
            const imgRes = await fetch(imageUrl);
            if (imgRes.ok) {
                const buffer = await imgRes.arrayBuffer();
                fileToUpload = new Blob([buffer], { type: 'image/png' });
            }
        }

        if (!fileToUpload || !name || !symbol) {
            return NextResponse.json({ success: false, error: 'Missing name, symbol, or logo' }, { status: 400 });
        }

        // 1. Upload to IPFS via pump.fun API
        const ipfsFormData = new FormData();
        ipfsFormData.append('file', fileToUpload, 'logo.png');
        ipfsFormData.append('name', name);
        ipfsFormData.append('symbol', symbol);
        ipfsFormData.append('description', description || '');
        ipfsFormData.append('twitter', twitter || '');
        ipfsFormData.append('telegram', telegram || '');
        ipfsFormData.append('website', website || '');
        ipfsFormData.append('showName', 'true');

        const ipfsResponse = await fetch('https://pump.fun/api/ipfs', {
            method: 'POST',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'application/json, text/plain, */*',
                'Origin': 'https://pump.fun',
                'Referer': 'https://pump.fun/create'
            },
            body: ipfsFormData
        });

        if (!ipfsResponse.ok) {
            const errCode = ipfsResponse.status;
            const errText = await ipfsResponse.text();

            // Helpful error for Cloudflare blocks
            if (errText.includes('<!DOCTYPE html>')) {
                throw new Error(`Cloudflare blocked the request (Edge Error ${errCode}). Pump.fun is protecting their API. Try again in a few minutes or use a manual logo upload.`);
            }
            throw new Error(`IPFS Upload Failed (${errCode}): ${errText.substring(0, 100)}`);
        }

        const metadataResponse = await ipfsResponse.json();
        const metadataUri = metadataResponse.metadataUri;
        console.log(`[Launcher] Metadata URI: ${metadataUri}`);

        // 2. Generate Mint Keypair
        const mintKeypair = Keypair.generate();
        const wallet = getSolanaWallet();

        // Standardize SOL amount (handle commas if user typed them)
        const solAmount = typeof amount === 'string' ? parseFloat(amount.replace(',', '.')) : parseFloat(amount);
        const finalAmount = isNaN(solAmount) || solAmount < 0.001 ? 0.001 : solAmount;

        console.log(`[Launcher] Requesting Create Tx for ${name} with buy: ${finalAmount} SOL`);

        // 3. Get Serialized Transaction from PumpPortal
        const response = await fetch('https://pumpportal.fun/api/trade-local', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                publicKey: wallet.publicKey.toString(),
                action: 'create',
                tokenMetadata: {
                    name: name,
                    symbol: symbol,
                    uri: metadataUri
                },
                mint: mintKeypair.publicKey.toString(),
                amount: finalAmount,
                denominatedInSol: 'true',
                slippage: 15,
                priorityFee: 0.005,
                pool: 'pump'
            })
        });

        if (!response.ok) {
            const errBody = await response.text();
            console.error(`[Launcher] PumpPortal Detailed Error:`, errBody);
            throw new Error(`PumpPortal Create Error: ${errBody || response.statusText}`);
        }

        const txData = await response.arrayBuffer();
        const tx = VersionedTransaction.deserialize(new Uint8Array(txData));

        // 4. Sign with both Wallet and Mint Keypair
        tx.sign([wallet, mintKeypair]);

        // 5. Send Transaction
        const connection = getSolanaConnection();
        const signature = await connection.sendTransaction(tx, { skipPreflight: false });

        return NextResponse.json({
            success: true,
            signature: signature,
            mint: mintKeypair.publicKey.toString(),
            metadataUri: metadataUri,
            explorerUrl: `https://solscan.io/tx/${signature}`
        });

    } catch (error) {
        console.error('Launch Error:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
