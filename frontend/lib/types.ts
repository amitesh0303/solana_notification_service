export type EventType =
  | 'transfer'
  | 'nft_sale'
  | 'defi_position'
  | 'token_transfer'
  | 'program_interaction';

export type Channel = 'email' | 'sms' | 'telegram' | 'discord';

export type DeliveryStatus = 'delivered' | 'pending' | 'failed';

export interface SubscriptionConditions {
  minAmount?: number;
  minValue?: number;
  [key: string]: unknown;
}

export interface EmailChannelConfig {
  to: string;
}

export interface SmsChannelConfig {
  to: string;
}

export interface TelegramChannelConfig {
  chatId: string;
}

export interface DiscordChannelConfig {
  channelId: string;
}

export type ChannelConfig =
  | EmailChannelConfig
  | SmsChannelConfig
  | TelegramChannelConfig
  | DiscordChannelConfig;

export interface Subscription {
  id: string;
  user_id: string;
  event_type: EventType;
  target_address: string;
  channel: Channel;
  conditions: SubscriptionConditions;
  channel_config: ChannelConfig;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface SolanaEvent {
  type: EventType;
  signature: string;
  timestamp: number;
  accountKeys: string[];
  data: Record<string, unknown>;
}

export interface Notification {
  id: string;
  subscription_id: string;
  event_data: SolanaEvent;
  channel: Channel;
  delivered: boolean;
  delivered_at: string | null;
  error: string | null;
  created_at: string;
}

export interface CreateSubscriptionPayload {
  userId: string;
  eventType: EventType;
  targetAddress: string;
  channel: Channel;
  conditions: SubscriptionConditions;
  channelConfig: ChannelConfig;
}

export interface GetNotificationsParams {
  userId?: string;
  subscriptionId?: string;
  limit?: number;
  offset?: number;
}
