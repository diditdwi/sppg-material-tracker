import { NextResponse } from 'next/server';
import { getClobClient } from '@/app/lib/polymarket';
import { Side, OrderType } from "@polymarket/clob-client";

export async function POST(req) {
    try {
        const body = await req.json();
        const { token_id, price, size, side } = body;
        // side: 'BUY' or 'SELL' -> Map to Side.BUY / Side.SELL

        if (!token_id || !price || !size || !side) {
            return NextResponse.json({ success: false, error: "Missing parameters" }, { status: 400 });
        }

        const client = getClobClient();
        if (!client.signer) {
            return NextResponse.json({ success: false, error: "No wallet configuration" }, { status: 401 });
        }

        // Create Order
        // Note: Polymarket CLOB uses specific order stuctures.
        // We place a Limit Order.

        const order = await client.createOrder({
            tokenID: token_id,
            price: price, // Limit price
            side: side === 'BUY' ? Side.BUY : Side.SELL,
            size: size, // Quantity
            feeRateBps: 0, // usually 0 for maker? check fee schedule
            nonce: Date.now(), // or let SDK handle
        });

        // Post Order
        const response = await client.postOrder(order);

        return NextResponse.json({ success: true, orderId: response.orderID, status: 'submitted' });

    } catch (error) {
        console.error("Trade execution error:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
