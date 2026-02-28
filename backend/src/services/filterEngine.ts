import { SolanaEvent, Subscription, SubscriptionConditions } from '../types';
import { pool } from '../db/client';

// In-memory debounce store: key = subscriptionId:signature, value = timestamp
const recentNotifications = new Map<string, number>();
const DEBOUNCE_MS = 60_000;

function cleanDebounceStore(): void {
  const now = Date.now();
  for (const [key, ts] of recentNotifications.entries()) {
    if (now - ts > DEBOUNCE_MS) {
      recentNotifications.delete(key);
    }
  }
}

function matchesConditions(event: SolanaEvent, conditions: SubscriptionConditions): boolean {
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

export async function matchSubscriptions(event: SolanaEvent): Promise<Subscription[]> {
  cleanDebounceStore();

  const result = await pool.query<{
    id: string;
    user_id: string;
    event_type: string;
    target_address: string;
    channel: string;
    conditions: SubscriptionConditions;
    channel_config: Record<string, unknown>;
    active: boolean;
    created_at: Date;
    updated_at: Date;
  }>(
    `SELECT * FROM subscriptions WHERE active = true AND event_type = $1`,
    [event.type],
  );

  const matched: Subscription[] = [];

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
      eventType: row.event_type as Subscription['eventType'],
      targetAddress: row.target_address,
      channel: row.channel as Subscription['channel'],
      conditions: row.conditions,
      channelConfig: row.channel_config as unknown as Subscription['channelConfig'],
      active: row.active,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    });
  }

  return matched;
}
