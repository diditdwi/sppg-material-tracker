import { NextResponse } from 'next/server';
import { getSolanaWallet, getSolBalance, getWalletPublicKey, getTokenAccounts } from '@/app/lib/solana';

/**
 * GET /api/pumpfun/wallet
 * Get wallet information and balances
 */
export async function GET(req) {
    try {
        // Load wallet
        const wallet = getSolanaWallet();
        const publicKey = getWalletPublicKey();

        // Get SOL balance
        const solBalance = await getSolBalance();

        // Get token balances
        let tokenAccounts = [];
        try {
            tokenAccounts = await getTokenAccounts();
        } catch (error) {
            console.error('Error fetching token accounts:', error);
        }

        return NextResponse.json({
            success: true,
            wallet: {
                publicKey: publicKey,
                solBalance: solBalance.toFixed(4),
                tokenAccounts: tokenAccounts
            }
        });

    } catch (error) {
        console.error('Wallet API Error:', error);
        return NextResponse.json({
            success: false,
            error: error.message
        }, { status: 500 });
    }
}
