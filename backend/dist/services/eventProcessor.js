"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.processEvent = processEvent;
const bullmq_1 = require("bullmq");
const filterEngine_1 = require("./filterEngine");
const client_1 = require("../db/client");
const connection = { url: process.env.REDIS_URL ?? 'redis://localhost:6379' };
const emailQueue = new bullmq_1.Queue('email', { connection });
const smsQueue = new bullmq_1.Queue('sms', { connection });
const telegramQueue = new bullmq_1.Queue('telegram', { connection });
const discordQueue = new bullmq_1.Queue('discord', { connection });
function getQueue(channel) {
    switch (channel) {
        case 'email':
            return emailQueue;
        case 'sms':
            return smsQueue;
        case 'telegram':
            return telegramQueue;
        case 'discord':
            return discordQueue;
        default:
            throw new Error(`Unknown channel: ${channel}`);
    }
}
async function processEvent(event) {
    const subscriptions = await (0, filterEngine_1.matchSubscriptions)(event);
    for (const subscription of subscriptions) {
        const notifResult = await client_1.pool.query(`INSERT INTO notifications (subscription_id, event_data, channel)
       VALUES ($1, $2, $3)
       RETURNING id`, [subscription.id, event, subscription.channel]);
        const notificationId = notifResult.rows[0].id;
        const job = { subscription, event, notificationId };
        const queue = getQueue(subscription.channel);
        await queue.add('deliver', job);
    }
}
//# sourceMappingURL=eventProcessor.js.map