"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.matchSubscriptions = matchSubscriptions;
const client_1 = require("../db/client");
// In-memory debounce store: key = subscriptionId:signature, value = timestamp
const recentNotifications = new Map();
const DEBOUNCE_MS = 60_000;
function cleanDebounceStore() {
    const now = Date.now();
    for (const [key, ts] of recentNotifications.entries()) {
        if (now - ts > DEBOUNCE_MS) {
            recentNotifications.delete(key);
        }
    }
}
function matchesConditions(event, conditions) {
    if (conditions.minAmount !== undefined && event.type === 'transfer') {
        const amount = event.data['amount'];
        if (typeof amount === 'number' && amount < conditions.minAmount) {
            return false;
        }
    }
    if (conditions.minValue !== undefined && event.type === 'nft_sale') {
        const value = event.data['salePrice'];
        if (typeof value === 'number' && value < conditions.minValue) {
            return false;
        }
    }
    return true;
}
async function matchSubscriptions(event) {
    cleanDebounceStore();
    const result = await client_1.pool.query(`SELECT * FROM subscriptions WHERE active = true AND event_type = $1`, [event.type]);
    const matched = [];
    for (const row of result.rows) {
        if (!event.accountKeys.includes(row.target_address)) {
            continue;
        }
        if (!matchesConditions(event, row.conditions)) {
            continue;
        }
        const debounceKey = `${row.id}:${event.signature}`;
        const lastSent = recentNotifications.get(debounceKey);
        if (lastSent !== undefined && Date.now() - lastSent < DEBOUNCE_MS) {
            continue;
        }
        recentNotifications.set(debounceKey, Date.now());
        matched.push({
            id: row.id,
            userId: row.user_id,
            eventType: row.event_type,
            targetAddress: row.target_address,
            channel: row.channel,
            conditions: row.conditions,
            channelConfig: row.channel_config,
            active: row.active,
            createdAt: row.created_at,
            updatedAt: row.updated_at,
        });
    }
    return matched;
}
//# sourceMappingURL=filterEngine.js.map