'use client';

import { type Channel, type ChannelConfig } from '@/lib/types';

interface Props {
  channel: Channel;
  config: ChannelConfig;
  onChange: (config: ChannelConfig) => void;
}

const inputClass =
  'w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500';

const labelClass = 'block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1';

export default function ChannelConfig({ channel, config, onChange }: Props) {
  switch (channel) {
    case 'email': {
      const c = config as { to?: string };
      return (
        <div>
          <label className={labelClass}>Email Address</label>
          <input
            type="email"
            placeholder="you@example.com"
            value={c.to ?? ''}
            onChange={(e) => onChange({ to: e.target.value })}
            className={inputClass}
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Notifications will be sent to this email.
          </p>
        </div>
      );
    }

    case 'sms': {
      const c = config as { to?: string };
      return (
        <div>
          <label className={labelClass}>Phone Number</label>
          <input
            type="tel"
            placeholder="+1 555 000 0000"
            value={c.to ?? ''}
            onChange={(e) => onChange({ to: e.target.value })}
            className={inputClass}
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Must include country code (e.g. +1 for US).
          </p>
        </div>
      );
    }

    case 'telegram': {
      const c = config as { chatId?: string };
      return (
        <div>
          <label className={labelClass}>Telegram Chat ID</label>
          <input
            type="text"
            placeholder="e.g. -1001234567890"
            value={c.chatId ?? ''}
            onChange={(e) => onChange({ chatId: e.target.value })}
            className={inputClass}
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Start a chat with your bot and copy the chat ID.
          </p>
        </div>
      );
    }

    case 'discord': {
      const c = config as { webhookUrl?: string };
      return (
        <div>
          <label className={labelClass}>Discord Webhook URL</label>
          <input
            type="url"
            placeholder="https://discord.com/api/webhooks/..."
            value={c.webhookUrl ?? ''}
            onChange={(e) => onChange({ webhookUrl: e.target.value })}
            className={inputClass}
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Create a webhook in your Discord channel settings.
          </p>
        </div>
      );
    }

    default:
      return null;
  }
}
