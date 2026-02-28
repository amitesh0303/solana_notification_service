'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getSubscriptions, getNotifications, updateSubscription, deleteSubscription } from '@/lib/api';
import { Subscription, Notification } from '@/lib/types';
import { getUserId } from '@/lib/userId';
import SubscriptionCard from '@/components/SubscriptionCard';
import NotificationBadge from '@/components/NotificationBadge';

const EVENT_LABELS: Record<string, string> = {
  transfer: '💸 Transfer',
  nft_sale: '🖼️ NFT Sale',
  defi_position: '📊 DeFi Position',
  token_transfer: '🪙 Token Transfer',
  program_interaction: '⚙️ Program Interaction',
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleString();
}

export default function DashboardPage() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    const userId = getUserId();
    setLoading(true);
    setError(null);
    try {
      const [subs, notifs] = await Promise.all([
        getSubscriptions(userId),
        getNotifications({ userId, limit: 5 }),
      ]);
      setSubscriptions(subs);
      setNotifications(notifs);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleToggle(id: string, active: boolean) {
    try {
      const updated = await updateSubscription(id, { active });
      setSubscriptions((prev) =>
        prev.map((s) => (s.id === id ? updated : s)),
      );
    } catch {
      // ignore
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this subscription?')) return;
    try {
      await deleteSubscription(id);
      setSubscriptions((prev) => prev.filter((s) => s.id !== id));
    } catch {
      // ignore
    }
  }

  const activeSubs = subscriptions.filter((s) => s.active).length;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const thisWeek = new Date(today);
  thisWeek.setDate(today.getDate() - 6);

  const notifsToday = notifications.filter(
    (n) => new Date(n.created_at) >= today,
  ).length;
  const notifsWeek = notifications.filter(
    (n) => new Date(n.created_at) >= thisWeek,
  ).length;

  const stats = [
    { label: 'Active Subscriptions', value: activeSubs, icon: '📡' },
    { label: 'Notifications Today', value: notifsToday, icon: '🔔' },
    { label: 'Notifications This Week', value: notifsWeek, icon: '📈' },
  ];

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Overview of your Solana notification subscriptions
          </p>
        </div>
        <Link
          href="/subscriptions/new"
          className="bg-brand-600 hover:bg-brand-700 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors"
        >
          + New Alert
        </Link>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-3 gap-5 mb-10">
        {stats.map((s) => (
          <div
            key={s.label}
            className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-3xl">{s.icon}</span>
            </div>
            <p className="text-4xl font-extrabold text-gray-900 dark:text-white mb-1">
              {loading ? '—' : s.value}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{s.label}</p>
          </div>
        ))}
      </div>

      {error && (
        <div className="mb-8 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 rounded-xl p-4 text-sm">
          {error} —{' '}
          <button onClick={load} className="underline font-medium">
            Retry
          </button>
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Subscriptions list */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Active Subscriptions
            </h2>
            <Link
              href="/subscriptions/new"
              className="text-brand-600 dark:text-brand-400 text-sm font-medium hover:underline"
            >
              Add new →
            </Link>
          </div>

          {loading ? (
            <div className="grid gap-4">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="h-32 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse"
                />
              ))}
            </div>
          ) : subscriptions.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-dashed border-gray-300 dark:border-gray-600 p-10 text-center">
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                No subscriptions yet.
              </p>
              <Link
                href="/subscriptions/new"
                className="bg-brand-600 hover:bg-brand-700 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors"
              >
                Create your first alert
              </Link>
            </div>
          ) : (
            <div className="grid gap-4">
              {subscriptions.map((s) => (
                <SubscriptionCard
                  key={s.id}
                  subscription={s}
                  onToggle={handleToggle}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </div>

        {/* Recent notifications */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Recent Alerts
            </h2>
            <Link
              href="/notifications"
              className="text-brand-600 dark:text-brand-400 text-sm font-medium hover:underline"
            >
              View all →
            </Link>
          </div>

          {loading ? (
            <div className="flex flex-col gap-3">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="h-16 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse"
                />
              ))}
            </div>
          ) : notifications.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-dashed border-gray-300 dark:border-gray-600 p-8 text-center text-gray-500 dark:text-gray-400 text-sm">
              No notifications yet.
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {notifications.map((n) => (
                <div
                  key={n.id}
                  className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 flex flex-col gap-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {EVENT_LABELS[n.event_data?.type] ?? n.event_data?.type}
                    </span>
                    <NotificationBadge delivered={n.delivered} error={n.error} />
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {formatDate(n.created_at)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
