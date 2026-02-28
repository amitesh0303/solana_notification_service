import { Worker } from 'bullmq';
import TelegramBot from 'node-telegram-bot-api';
import { NotificationJob, TelegramChannelConfig } from '../types';
import { pool } from '../db/client';

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN ?? '', { polling: false });

export const telegramWorker = new Worker<NotificationJob>(
  'telegram',
  async (job) => {
    const { subscription, event, notificationId } = job.data;
    const config = subscription.channelConfig as TelegramChannelConfig;

    const { buildNotification } = await import('../services/notificationBuilder');
    const notification = buildNotification(event);

    try {
      await bot.sendMessage(config.chatId, notification.plainText);

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
