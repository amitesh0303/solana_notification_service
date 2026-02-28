import { Worker } from 'bullmq';
import twilio from 'twilio';
import { NotificationJob, SmsChannelConfig } from '../types';
import { pool } from '../db/client';

const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN,
);
const fromNumber = process.env.TWILIO_FROM_NUMBER ?? '';

export const smsWorker = new Worker<NotificationJob>(
  'sms',
  async (job) => {
    const { subscription, event, notificationId } = job.data;
    const config = subscription.channelConfig as SmsChannelConfig;

    const { buildNotification } = await import('../services/notificationBuilder');
    const notification = buildNotification(event);

    try {
      await twilioClient.messages.create({
        body: notification.plainText,
        from: fromNumber,
        to: config.to,
      });

      await pool.query(
        `UPDATE notifications SET delivered = true, delivered_at = NOW() WHERE id = $1`,
        [notificationId],
      );
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      await pool.query(`UPDATE notifications SET error = $1 WHERE id = $2`, [
        message,
        notificationId,
      ]);
      throw err;
    }
  },
  { connection: { url: process.env.REDIS_URL ?? 'redis://localhost:6379' } },
);
