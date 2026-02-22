import { NextResponse } from 'next/server';
import { getClobClient } from '@/app/lib/polymarket';
import { ethers } from 'ethers';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const client = getClobClient();
        if (!client.signer) {
            return NextResponse.json({ success: false, error: "No wallet connected (Private Key missing)" }, { status: 401 });
        }

        const address = await client.signer.getAddress();

        // 1. Get MATIC Balance (Gas)
        const maticBalanceWei = await client.signer.provider.getBalance(address);
        const maticBalance = ethers.formatEther(maticBalanceWei);

        // 2. Get USDC Balance (Collateral)
        // We need L2 authentication (API Keys) to fetch the portfolio balance from the CLOB
        let usdcBalance = "0.00";
        try {
            // Derive API Keys from the Private Key (L2 Auth)
            const creds = await client.createOrDeriveApiKey();
            const { ClobClient } = require("@polymarket/clob-client");
            // Instantiate an authenticated client
            const authClient = new ClobClient("https://clob.polymarket.com", 137, client.signer, creds);

            // Fetch Balance (Asset Type: COLLATERAL = USDC)
            const bal = await authClient.getBalanceAllowance({ asset_type: "COLLATERAL" });

            if (bal && bal.balance) {
                // USDC has 6 decimals. API returns raw integer string (e.g. "1000000" for 1 USDC)
                usdcBalance = ethers.formatUnits(bal.balance, 6);
            }

            // FALLBACK: Check Both Wallets (EOA + Deposit Wallet)
            if (parseFloat(usdcBalance) === 0) {
                const EOA_ADDRESS = address; // Current signer address
                const DEPOSIT_WALLET = "0x6F72e948F9DdfC9991b04De0431dE10374164DD1"; // Polymarket deposit
                const USDC_POS = "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174";
                const USDC_NATIVE = "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359";
                const abi = ["function balanceOf(address owner) view returns (uint256)"];

                try {
                    let totalBalance = 0;

                    // Check both USDC contracts for both addresses
                    const usdcPos = new ethers.Contract(USDC_POS, abi, client.signer.provider);
                    const usdcNative = new ethers.Contract(USDC_NATIVE, abi, client.signer.provider);

                    // EOA balances
                    const eoaPosWei = await usdcPos.balanceOf(EOA_ADDRESS);
                    const eoaNativeWei = await usdcNative.balanceOf(EOA_ADDRESS);
                    const eoaPos = parseFloat(ethers.formatUnits(eoaPosWei, 6));
                    const eoaNative = parseFloat(ethers.formatUnits(eoaNativeWei, 6));

                    // Deposit wallet balances
                    const depPosWei = await usdcPos.balanceOf(DEPOSIT_WALLET);
                    const depNativeWei = await usdcNative.balanceOf(DEPOSIT_WALLET);
                    const depPos = parseFloat(ethers.formatUnits(depPosWei, 6));
                    const depNative = parseFloat(ethers.formatUnits(depNativeWei, 6));

                    totalBalance = eoaPos + eoaNative + depPos + depNative;

                    console.log(`[Balance Check] EOA PoS: ${eoaPos}, Native: ${eoaNative}`);
                    console.log(`[Balance Check] Deposit PoS: ${depPos}, Native: ${depNative}`);
                    console.log(`[Balance Check] Total: ${totalBalance}`);

                    if (totalBalance > 0) {
                        usdcBalance = totalBalance.toString();
                    }
                } catch (proxyErr) {
                    console.error("Wallet Check Error:", proxyErr.message);
                }
            }
        } catch (apiErr) {
            console.error("USDC Fetch Error:", apiErr.message);
            // If API fails, default to 0.00
        }

        return NextResponse.json({
            success: true,
            address: address,
            maticBalance: parseFloat(maticBalance).toFixed(4),
            usdcBalance: parseFloat(usdcBalance).toFixed(2),
            activePositions: 0
        });

    } catch (error) {
        console.error("Portfolio error:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
