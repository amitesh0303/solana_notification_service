'use client';

import { EventType } from '@/lib/types';

interface EventOption {
  value: EventType;
  label: string;
  icon: string;
  description: string;
}

const EVENT_OPTIONS: EventOption[] = [
  {
    value: 'transfer',
    label: 'SOL Transfer',
    icon: '💸',
    description: 'Receive alerts when SOL is sent or received',
  },
  {
    value: 'nft_sale',
    label: 'NFT Sale',
    icon: '🖼️',
    description: 'Get notified when an NFT sells on-chain',
  },
  {
    value: 'token_transfer',
    label: 'Token Transfer',
    icon: '🪙',
    description: 'Monitor SPL token movements',
  },
  {
    value: 'defi_position',
    label: 'DeFi Position',
    icon: '📊',
    description: 'Track liquidity and lending positions',
  },
  {
    value: 'program_interaction',
    label: 'Program Interaction',
    icon: '⚙️',
    description: 'Watch any program for specific calls',
  },
];

interface Props {
  value: EventType;
  onChange: (type: EventType) => void;
}

export default function EventTypePicker({ value, onChange }: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {EVENT_OPTIONS.map((opt) => {
        const selected = value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={`flex items-start gap-3 p-4 rounded-xl border-2 text-left transition-all ${
              selected
                ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/20 dark:border-brand-400'
                : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-brand-300 dark:hover:border-brand-600'
            }`}
          >
            <span className="text-2xl">{opt.icon}</span>
            <div>
              <p
                className={`font-semibold text-sm ${
                  selected
                    ? 'text-brand-700 dark:text-brand-300'
                    : 'text-gray-900 dark:text-gray-100'
                }`}
              >
                {opt.label}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                {opt.description}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
}
