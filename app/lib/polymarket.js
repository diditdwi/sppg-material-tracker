import { ClobClient } from "@polymarket/clob-client";
import { ethers } from "ethers";

// Singleton instance to avoid multiple connections/listeners if we were using WS
// For REST it's fine to re-instantiate, but let's keep it clean.

export function getClobClient() {
    const privateKey = process.env.PRIVATE_KEY;
    const chainId = 137; // Polygon Mainnet

    if (!privateKey) {
        console.warn("PRIVATE_KEY not found in env. Read-only mode only.");
        // Return a read-only client or throw error depending on usage
        // For now, we'll try to initialize without signer if the SDK supports it for public endpoints,
        // otherwise we might need a dummy signer or handle it gracefully.
        // The clob-client usually requires a signer for authenticated actions.
        return new ClobClient("https://clob.polymarket.com", 137);
    }

    const provider = new ethers.JsonRpcProvider("https://polygon-rpc.com");
    const wallet = new ethers.Wallet(privateKey, provider);

    // Patch for ethers v6 compatibility with clob-client (which expects v5)
    // clob-client calls _signTypedData, but v6 uses signTypedData
    if (!wallet._signTypedData && wallet.signTypedData) {
        // v6 signTypedData(domain, types, value) matches v5 signature mostly
        // but we need to bind it to the wallet instance
        wallet._signTypedData = wallet.signTypedData.bind(wallet);
    }

    return new ClobClient("https://clob.polymarket.com", chainId, wallet);
}
