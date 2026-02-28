"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const crypto_1 = __importDefault(require("crypto"));
const eventProcessor_1 = require("../services/eventProcessor");
const router = (0, express_1.Router)();
const VALID_EVENT_TYPES = [
    'transfer',
    'nft_sale',
    'defi_position',
    'token_transfer',
    'program_interaction',
];
function verifyHeliusSignature(rawBody, signature, secret) {
    const expected = crypto_1.default
        .createHmac('sha256', secret)
        .update(rawBody)
        .digest('hex');
    return crypto_1.default.timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
}
// POST /webhooks/helius
router.post('/helius', async (req, res) => {
    const secret = process.env.HELIUS_WEBHOOK_SECRET;
    if (secret) {
        const signature = req.headers['helius-signature'];
        if (!signature) {
            res.status(401).json({ error: 'Missing Helius-Signature header' });
            return;
        }
        const rawBody = req.rawBody;
        if (!rawBody) {
            res.status(401).json({ error: 'Cannot verify signature: raw body unavailable' });
            return;
        }
        if (!verifyHeliusSignature(rawBody, signature, secret)) {
            res.status(401).json({ error: 'Invalid signature' });
            return;
        }
    }
    const payload = req.body;
    // Helius sends an array of transactions
    const events = Array.isArray(payload) ? payload : [payload];
    const processed = [];
    const errors = [];
    for (const raw of events) {
        try {
            const rawEvent = raw;
            const eventType = rawEvent['type']?.toLowerCase();
            if (!eventType || !VALID_EVENT_TYPES.includes(eventType)) {
                continue;
            }
            const accountKeys = Array.isArray(rawEvent['accountData'])
                ? rawEvent['accountData'].map((a) => a.account)
                : Array.isArray(rawEvent['accountKeys'])
                    ? rawEvent['accountKeys']
                    : [];
            const event = {
                type: eventType,
                signature: rawEvent['signature'] ?? '',
                timestamp: typeof rawEvent['timestamp'] === 'number' ? rawEvent['timestamp'] : Math.floor(Date.now() / 1000),
                accountKeys,
                data: rawEvent['data'] ?? rawEvent,
            };
            await (0, eventProcessor_1.processEvent)(event);
            processed.push(event.signature);
        }
        catch (err) {
            console.error('Error processing webhook event:', err);
            errors.push(err instanceof Error ? err.message : String(err));
        }
    }
    res.json({ processed: processed.length, errors: errors.length > 0 ? errors : undefined });
});
exports.default = router;
//# sourceMappingURL=webhooks.js.map