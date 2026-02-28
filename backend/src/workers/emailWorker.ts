import { Worker } from 'bullmq';
import { Resend } from 'resend';
import { NotificationJob, EmailChannelConfig } from '../types';
import { pool } from '../db/client';

const resend = new Resend(process.env.RESEND_API_KEY);
const fromEmail = process.env.RESEND_FROM_EMAIL ?? 'notifications@solnotify.app';

export const emailWorker = new Worker<NotificationJob>(
  'email',
  async (job) => {
    const { subscription, event, notificationId } = job.data;
    const config = subscription.channelConfig as EmailChannelConfig;

    const { buildNotification } = await import('../services/notificationBuilder');
    const notification = buildNotification(event);

    try {
      await resend.emails.send({
        from: fromEmail,
        to: config.to,
        subject: notification.subject,
        html: notification.htmlBody,
        text: notification.plainText,
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
