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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.smsWorker = void 0;
const bullmq_1 = require("bullmq");
const twilio_1 = __importDefault(require("twilio"));
const client_1 = require("../db/client");
const twilioClient = (0, twilio_1.default)(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
const fromNumber = process.env.TWILIO_FROM_NUMBER ?? '';
exports.smsWorker = new bullmq_1.Worker('sms', async (job) => {
    const { subscription, event, notificationId } = job.data;
    const config = subscription.channelConfig;
    const { buildNotification } = await Promise.resolve().then(() => __importStar(require('../services/notificationBuilder')));
    const notification = buildNotification(event);
    try {
        await twilioClient.messages.create({
            body: notification.plainText,
            from: fromNumber,
            to: config.to,
        });
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
//# sourceMappingURL=smsWorker.js.map