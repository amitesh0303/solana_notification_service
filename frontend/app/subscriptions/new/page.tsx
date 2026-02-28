'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createSubscription } from '@/lib/api';
import { EventType, Channel, SubscriptionConditions, ChannelConfig as ChannelConfigType } from '@/lib/types';
import { getUserId } from '@/lib/userId';
import EventTypePicker from '@/components/EventTypePicker';
import ConditionBuilder from '@/components/ConditionBuilder';
import ChannelConfigInput from '@/components/ChannelConfig';

const CHANNELS: { value: Channel; label: string; icon: string }[] = [
  { value: 'email', label: 'Email', icon: '✉️' },
  { value: 'sms', label: 'SMS', icon: '📱' },
  { value: 'telegram', label: 'Telegram', icon: '✈️' },
  { value: 'discord', label: 'Discord', icon: '🎮' },
];

function defaultChannelConfig(channel: Channel): ChannelConfigType {
  switch (channel) {
    case 'email': return { to: '' };
    case 'sms': return { to: '' };
    case 'telegram': return { chatId: '' };
    case 'discord': return { webhookUrl: '' };
  }
}

export default function NewSubscriptionPage() {
  const router = useRouter();

  const [eventType, setEventType] = useState<EventType>('transfer');
  const [targetAddress, setTargetAddress] = useState('');
  const [channel, setChannel] = useState<Channel>('email');
  const [channelConfig, setChannelConfig] = useState<ChannelConfigType>({ to: '' });
  const [conditions, setConditions] = useState<SubscriptionConditions>({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  function handleChannelChange(c: Channel) {
    setChannel(c);
    setChannelConfig(defaultChannelConfig(c));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!targetAddress.trim()) {
      setError('Target address is required.');
      return;
    }

    setSubmitting(true);
    try {
      await createSubscription({
        userId: getUserId(),
        eventType,
        targetAddress: targetAddress.trim(),
        channel,
        conditions,
        channelConfig,
      });
      setSuccess(true);
      setTimeout(() => router.push('/dashboard'), 1500);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setSubmitting(false);
    }
  }

  if (success) {
    return (
      <main className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="text-6xl mb-6">🎉</div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Subscription Created!
        </h2>
        <p className="text-gray-500 dark:text-gray-400">Redirecting to dashboard…</p>
      </main>
    );
  }

  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
          Create New Alert
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          Configure an on-chain event subscription and choose how to receive alerts.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-8">
        {/* Event Type */}
        <section className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            1. Choose Event Type
          </h2>
          <EventTypePicker value={eventType} onChange={setEventType} />
        </section>

        {/* Target Address */}
        <section className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            2. Target Solana Address
          </h2>
          <input
            type="text"
            placeholder="e.g. 9xQeWvG816bUx9EPjHmaT23yvVM2ZWbrrpZb9PusVFin"
            value={targetAddress}
            onChange={(e) => setTargetAddress(e.target.value)}
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-4 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            The wallet, token, program, or NFT mint address to watch.
          </p>
        </section>

        {/* Conditions */}
        <section className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            3. Conditions <span className="text-sm font-normal text-gray-500">(optional)</span>
          </h2>
          <ConditionBuilder
            eventType={eventType}
            conditions={conditions}
            onChange={setConditions}
          />
        </section>

        {/* Channel */}
        <section className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            4. Notification Channel
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            {CHANNELS.map((ch) => (
              <button
                key={ch.value}
                type="button"
                onClick={() => handleChannelChange(ch.value)}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                  channel === ch.value
                    ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/20 dark:border-brand-400'
                    : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-brand-300'
                }`}
              >
                <span className="text-2xl">{ch.icon}</span>
                <span
                  className={`text-sm font-semibold ${
                    channel === ch.value
                      ? 'text-brand-700 dark:text-brand-300'
                      : 'text-gray-700 dark:text-gray-300'
                  }`}
                >
                  {ch.label}
                </span>
              </button>
            ))}
          </div>

          <ChannelConfigInput
            channel={channel}
            config={channelConfig}
            onChange={setChannelConfig}
          />
        </section>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 rounded-xl p-4 text-sm">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="bg-brand-600 hover:bg-brand-700 disabled:opacity-60 text-white font-bold py-3.5 rounded-xl transition-colors text-base shadow-lg shadow-brand-500/30"
        >
          {submitting ? 'Creating…' : 'Create Subscription'}
        </button>
      </form>
    </main>
  );
}
