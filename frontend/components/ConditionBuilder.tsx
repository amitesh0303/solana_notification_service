'use client';

import { EventType, SubscriptionConditions } from '@/lib/types';

interface Props {
  eventType: EventType;
  conditions: SubscriptionConditions;
  onChange: (conditions: SubscriptionConditions) => void;
}

export default function ConditionBuilder({ eventType, conditions, onChange }: Props) {
  const showMinAmount = eventType === 'transfer';
  const showMinValue = eventType === 'nft_sale';

  if (!showMinAmount && !showMinValue) {
    return (
      <p className="text-sm text-gray-500 dark:text-gray-400 italic">
        No conditions available for this event type.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {showMinAmount && (
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Minimum Amount (SOL)
          </label>
          <div className="relative">
            <input
              type="number"
              min="0"
              step="0.01"
              placeholder="e.g. 1.0"
              value={conditions.minAmount ?? ''}
              onChange={(e) =>
                onChange({
                  ...conditions,
                  minAmount: e.target.value ? parseFloat(e.target.value) : undefined,
                })
              }
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 pr-14"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-400">
              SOL
            </span>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Only alert when transferred amount exceeds this threshold.
          </p>
        </div>
      )}

      {showMinValue && (
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Minimum Sale Value (USD)
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-gray-400">
              $
            </span>
            <input
              type="number"
              min="0"
              step="1"
              placeholder="e.g. 500"
              value={conditions.minValue ?? ''}
              onChange={(e) =>
                onChange({
                  ...conditions,
                  minValue: e.target.value ? parseFloat(e.target.value) : undefined,
                })
              }
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 pl-8 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Only alert when the NFT sale exceeds this value.
          </p>
        </div>
      )}
    </div>
  );
}
