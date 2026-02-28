import { Worker } from 'bullmq';
import { Client, GatewayIntentBits, TextChannel } from 'discord.js';
import { NotificationJob, DiscordChannelConfig } from '../types';
import { pool } from '../db/client';

const discordClient = new Client({ intents: [GatewayIntentBits.Guilds] });
let discordReady = false;

if (process.env.DISCORD_BOT_TOKEN) {
  discordClient.once('ready', () => {
    discordReady = true;
  });
  discordClient.login(process.env.DISCORD_BOT_TOKEN).catch(console.error);
}

export const discordWorker = new Worker<NotificationJob>(
  'discord',
  async (job) => {
    const { subscription, event, notificationId } = job.data;
    const config = subscription.channelConfig as DiscordChannelConfig;

    const { buildNotification } = await import('../services/notificationBuilder');
    const notification = buildNotification(event);

    try {
      if (!discordReady) {
        throw new Error('Discord client not ready');
      }

      const channel = await discordClient.channels.fetch(config.channelId);
      if (!channel || !(channel instanceof TextChannel)) {
        throw new Error(`Channel ${config.channelId} not found or not a text channel`);
      }

      await channel.send(notification.plainText);

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
