'use client';

import { useEffect, useState } from 'react';
import { getNotifications } from '@/lib/api';
import { Notification, Channel } from '@/lib/types';
import { getUserId } from '@/lib/userId';
import NotificationBadge from '@/components/NotificationBadge';

const PAGE_SIZE = 20;

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

type StatusFilter = 'all' | 'delivered' | 'pending' | 'failed';

function formatDate(iso: string) {
  return new Date(iso).toLocaleString();
}

export default function NotificationsPage() {
  const [all, setAll] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [channelFilter, setChannelFilter] = useState<Channel | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');

  const userId = getUserId();

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const data = await getNotifications({ userId, limit: 200, offset: 0 });
      setAll(data);
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

  const filtered = all.filter((n) => {
    if (channelFilter !== 'all' && n.channel !== channelFilter) return false;
    if (statusFilter === 'delivered' && !n.delivered) return false;
    if (statusFilter === 'pending' && (n.delivered || n.error)) return false;
    if (statusFilter === 'failed' && !n.error) return false;
    return true;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages - 1);
  const visible = filtered.slice(safePage * PAGE_SIZE, safePage * PAGE_SIZE + PAGE_SIZE);

  function handleFilterChange() {
    setPage(0);
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
          Notification History
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          All alerts delivered (or attempted) for your subscriptions.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        {/* Channel filter */}
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
            Channel:
          </label>
          <select
            value={channelFilter}
            onChange={(e) => {
              setChannelFilter(e.target.value as Channel | 'all');
              handleFilterChange();
            }}
            className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            <option value="all">All channels</option>
            <option value="email">✉️ Email</option>
            <option value="sms">📱 SMS</option>
            <option value="telegram">✈️ Telegram</option>
            <option value="discord">🎮 Discord</option>
          </select>
        </div>

        {/* Status filter */}
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
            Status:
          </label>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value as StatusFilter);
              handleFilterChange();
            }}
            className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            <option value="all">All statuses</option>
            <option value="delivered">Delivered</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
          </select>
        </div>

        <span className="ml-auto text-sm text-gray-500 dark:text-gray-400 self-center">
          {loading ? '…' : `${filtered.length} notification${filtered.length !== 1 ? 's' : ''}`}
        </span>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 rounded-xl p-4 text-sm">
          {error} —{' '}
          <button onClick={load} className="underline font-medium">
            Retry
          </button>
        </div>
      )}

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                {['Event Type', 'Target', 'Channel', 'Status', 'Timestamp'].map(
                  (h) => (
                    <th
                      key={h}
                      className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                    >
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i}>
                    {[...Array(5)].map((__, j) => (
                      <td key={j} className="px-6 py-4">
                        <div className="h-4 bg-gray-100 dark:bg-gray-700 rounded animate-pulse w-24" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : visible.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-16 text-center text-gray-400 dark:text-gray-500"
                  >
                    No notifications found.
                  </td>
                </tr>
              ) : (
                visible.map((n) => (
                  <tr
                    key={n.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100 whitespace-nowrap">
                      {EVENT_LABELS[n.event_data?.type] ?? n.event_data?.type ?? '—'}
                    </td>
                    <td className="px-6 py-4 text-sm font-mono text-gray-500 dark:text-gray-400 whitespace-nowrap">
                      {n.subscription_id.slice(0, 8)}…
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300 whitespace-nowrap">
                      {CHANNEL_ICONS[n.channel] ?? ''} {n.channel}
                    </td>
                    <td className="px-6 py-4">
                      <NotificationBadge delivered={n.delivered} error={n.error} />
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
                      {formatDate(n.created_at)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={safePage === 0}
              className="text-sm font-medium text-brand-600 dark:text-brand-400 disabled:text-gray-300 dark:disabled:text-gray-600 hover:underline"
            >
              ← Previous
            </button>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Page {safePage + 1} of {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={safePage >= totalPages - 1}
              className="text-sm font-medium text-brand-600 dark:text-brand-400 disabled:text-gray-300 dark:disabled:text-gray-600 hover:underline"
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
