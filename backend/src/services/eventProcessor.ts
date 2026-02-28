import { Queue } from 'bullmq';
import { SolanaEvent, NotificationJob } from '../types';
import { matchSubscriptions } from './filterEngine';
import { pool } from '../db/client';

const connection = { url: process.env.REDIS_URL ?? 'redis://localhost:6379' };

const emailQueue = new Queue('email', { connection });
const smsQueue = new Queue('sms', { connection });
const telegramQueue = new Queue('telegram', { connection });
const discordQueue = new Queue('discord', { connection });

function getQueue(channel: string): Queue {
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

export async function processEvent(event: SolanaEvent): Promise<void> {
  const subscriptions = await matchSubscriptions(event);

  for (const subscription of subscriptions) {
    const notifResult = await pool.query<{ id: string }>(
      `INSERT INTO notifications (subscription_id, event_data, channel)
       VALUES ($1, $2, $3)
       RETURNING id`,
      [subscription.id, event, subscription.channel],
    );

    const notificationId = notifResult.rows[0].id;
    const job: NotificationJob = { subscription, event, notificationId };
    const queue = getQueue(subscription.channel);
    await queue.add('deliver', job);
  }
}
