export type EventType =
  | 'transfer'
  | 'nft_sale'
  | 'defi_position'
  | 'token_transfer'
  | 'program_interaction';

export type Channel = 'email' | 'sms' | 'telegram' | 'discord';

export interface SolanaEvent {
  type: EventType;
  signature: string;
  timestamp: number;
  accountKeys: string[];
  data: Record<string, unknown>;
}

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
  userId: string;
  eventType: EventType;
  targetAddress: string;
  channel: Channel;
  conditions: SubscriptionConditions;
  channelConfig: ChannelConfig;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Notification {
  id: string;
  subscriptionId: string;
  eventData: SolanaEvent;
  channel: Channel;
  delivered: boolean;
  deliveredAt: Date | null;
  error: string | null;
  createdAt: Date;
}

export interface NotificationJob {
  subscription: Subscription;
  event: SolanaEvent;
  notificationId: string;
}

export interface BuiltNotification {
  subject: string;
  htmlBody: string;
  plainText: string;
}
