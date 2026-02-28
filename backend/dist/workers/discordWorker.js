"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.discordWorker = void 0;
const bullmq_1 = require("bullmq");
const discord_js_1 = require("discord.js");
const client_1 = require("../db/client");
const discordClient = new discord_js_1.Client({ intents: [discord_js_1.GatewayIntentBits.Guilds] });
let discordReady = false;
if (process.env.DISCORD_BOT_TOKEN) {
    discordClient.once('ready', () => {
        discordReady = true;
    });
    discordClient.login(process.env.DISCORD_BOT_TOKEN).catch(console.error);
}
exports.discordWorker = new bullmq_1.Worker('discord', async (job) => {
    const { subscription, event, notificationId } = job.data;
    const config = subscription.channelConfig;
    const { buildNotification } = await Promise.resolve().then(() => __importStar(require('../services/notificationBuilder')));
    const notification = buildNotification(event);
    try {
        if (!discordReady) {
            throw new Error('Discord client not ready');
        }
        const channel = await discordClient.channels.fetch(config.channelId);
        if (!channel || !(channel instanceof discord_js_1.TextChannel)) {
            throw new Error(`Channel ${config.channelId} not found or not a text channel`);
        }
        await channel.send(notification.plainText);
        await client_1.pool.query(`UPDATE notifications SET delivered = true, delivered_at = NOW() WHERE id = $1`, [notificationId]);
    }
    catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        await client_1.pool.query(`UPDATE notifications SET error = $1 WHERE id = $2`, [
            message,
            notificationId,
        ]);
        throw err;
    }
}, { connection: { url: process.env.REDIS_URL ?? 'redis://localhost:6379' } });
//# sourceMappingURL=discordWorker.js.map