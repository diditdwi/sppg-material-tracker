import { Connection, Keypair, PublicKey, Transaction, sendAndConfirmTransaction, LAMPORTS_PER_SOL } from '@solana/web3.js';
import bs58 from 'bs58';

// Solana RPC connection
let connection = null;
let wallet = null;

/**
 * Initialize Solana connection to mainnet
 */
export function getSolanaConnection() {
    if (!connection) {
        const rpcUrl = process.env.SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com';
        connection = new Connection(rpcUrl, 'confirmed');
    }
    return connection;
}

/**
 * Load wallet from private key in environment variable
 */
export function getSolanaWallet() {
    if (!wallet) {
        const privateKey = process.env.SOLANA_PRIVATE_KEY;
        if (!privateKey) {
            throw new Error('SOLANA_PRIVATE_KEY not found in environment variables');
        }

        try {
            const secretKey = bs58.decode(privateKey);
            wallet = Keypair.fromSecretKey(secretKey);
            console.log('Solana wallet loaded:', wallet.publicKey.toString());
        } catch (error) {
            throw new Error('Invalid SOLANA_PRIVATE_KEY format: ' + error.message);
        }
    }
    return wallet;
}

/**
 * Get SOL balance for the wallet
 * @returns {Promise<number>} Balance in SOL
 */
export async function getSolBalance() {
    const conn = getSolanaConnection();
    const walletKeypair = getSolanaWallet();
    const lamports = await conn.getBalance(walletKeypair.publicKey);
    return lamports / LAMPORTS_PER_SOL;
}

/**
 * Get wallet public key as string
 */
export function getWalletPublicKey() {
    const walletKeypair = getSolanaWallet();
    return walletKeypair.publicKey.toString();
}

/**
 * Send and confirm a transaction
 * @param {Transaction} transaction - The transaction to send
 * @returns {Promise<string>} Transaction signature
 */
export async function sendTransaction(transaction) {
    const conn = getSolanaConnection();
    const walletKeypair = getSolanaWallet();

    // Sign and send transaction
    const signature = await sendAndConfirmTransaction(
        conn,
        transaction,
        [walletKeypair],
        {
            commitment: 'confirmed',
            maxRetries: 3
        }
    );

    return signature;
}

/**
 * Get token accounts for the wallet
 * @returns {Promise<Array>} List of token accounts
 */
export async function getTokenAccounts() {
    const conn = getSolanaConnection();
    const walletKeypair = getSolanaWallet();

    const programs = [
        'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA', // Token Program
        'TokenzQhyuC17u2PrfS5fN7W93N38nK18u978LUR5eb', // Token-2022 Program
        'TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb'  // Custom/V2 Token Program
    ];

    // Parallel fetch with timeout to prevent dashboard hanging
    try {
        const fetchPromise = Promise.all(programs.map(async (progId) => {
            try {
                const tokenAccounts = await conn.getParsedTokenAccountsByOwner(
                    walletKeypair.publicKey,
                    { programId: new PublicKey(progId) }
                );

                return tokenAccounts.value.map(account => ({
                    mint: account.account.data.parsed.info.mint,
                    amount: account.account.data.parsed.info.tokenAmount.uiAmount,
                    decimals: account.account.data.parsed.info.tokenAmount.decimals,
                    programId: progId
                }));
            } catch (err) {
                console.error(`Error fetching ${progId}:`, err.message);
                return [];
            }
        }));

        // 5 second timeout
        const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error('RPC Timeout')), 5000)
        );

        const results = await Promise.race([fetchPromise, timeoutPromise]);
        return results.flat();
    } catch (error) {
        console.error('getTokenAccounts failed:', error.message);
        return [];
    }
}

/**
 * Calculate transaction fee estimate
 * @returns {Promise<number>} Fee in SOL
 */
export async function getTransactionFee() {
    const conn = getSolanaConnection();
    const recentBlockhash = await conn.getRecentBlockhash();
    const feeInLamports = recentBlockhash.feeCalculator.lamportsPerSignature;
    return feeInLamports / LAMPORTS_PER_SOL;
}
