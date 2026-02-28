'use client';

import { Subscription } from '@/lib/types';

interface Props {
  subscription: Subscription;
  onToggle: (id: string, active: boolean) => void;
  onDelete: (id: string) => void;
}

const EVENT_LABELS: Record<string, string> = {
  transfer: '💸 Transfer',
  nft_sale: '🖼️ NFT Sale',
  defi_position: '📊 DeFi Position',
  token_transfer: '🪙 Token Transfer',
  program_interaction: '⚙️ Program Interaction',
};

const CHANNEL_ICONS: Record<string, string> = {
  email: '✉️',
  sms: '📱',
  telegram: '✈️',
  discord: '🎮',
};

export default function SubscriptionCard({ subscription, onToggle, onDelete }: Props) {
  const shortAddress =
    subscription.target_address.slice(0, 6) +
    '...' +
    subscription.target_address.slice(-4);

  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-xl border shadow-sm p-5 flex flex-col gap-3 transition-opacity ${
        subscription.active ? 'border-gray-200 dark:border-gray-700' : 'border-gray-100 dark:border-gray-800 opacity-60'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-1">
          <span className="font-semibold text-gray-900 dark:text-gray-100">
            {EVENT_LABELS[subscription.event_type] ?? subscription.event_type}
          </span>
          <span className="text-xs font-mono text-gray-500 dark:text-gray-400">
            {shortAddress}
          </span>
        </div>

        {/* Toggle */}
        <button
          onClick={() => onToggle(subscription.id, !subscription.active)}
          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus:outline-none ${
            subscription.active ? 'bg-brand-600' : 'bg-gray-300 dark:bg-gray-600'
          }`}
          aria-label={subscription.active ? 'Deactivate' : 'Activate'}
        >
          <span
            className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
              subscription.active ? 'translate-x-5' : 'translate-x-0'
            }`}
          />
        </button>
      </div>

      <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
        <span>
          {CHANNEL_ICONS[subscription.channel] ?? ''} {subscription.channel}
        </span>
        {subscription.conditions.minAmount != null && (
          <span className="bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded text-xs">
            min {subscription.conditions.minAmount} SOL
          </span>
        )}
        {subscription.conditions.minValue != null && (
          <span className="bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded text-xs">
            min ${subscription.conditions.minValue}
          </span>
        )}
      </div>

      <div className="flex items-center justify-between">
        <span
          className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full ${
            subscription.active
              ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
          }`}
        >
          <span
            className={`h-1.5 w-1.5 rounded-full ${subscription.active ? 'bg-green-500' : 'bg-gray-400'}`}
          />
          {subscription.active ? 'Active' : 'Inactive'}
        </span>

        <button
          onClick={() => onDelete(subscription.id)}
          className="text-xs text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
