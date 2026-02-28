import {
  Subscription,
  Notification,
  CreateSubscriptionPayload,
  GetNotificationsParams,
} from './types';

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

async function request<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(body || `HTTP ${res.status}`);
  }

  return res.json() as Promise<T>;
}

export async function getSubscriptions(userId: string): Promise<Subscription[]> {
  return request<Subscription[]>(
    `/subscriptions?userId=${encodeURIComponent(userId)}`,
  );
}

export async function createSubscription(
  data: CreateSubscriptionPayload,
): Promise<Subscription> {
  return request<Subscription>('/subscriptions', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateSubscription(
  id: string,
  data: Partial<Omit<Subscription, 'id' | 'user_id' | 'created_at' | 'updated_at'>>,
): Promise<Subscription> {
  return request<Subscription>(`/subscriptions/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deleteSubscription(id: string): Promise<void> {
  return request<void>(`/subscriptions/${id}`, { method: 'DELETE' });
}

export async function getNotifications(
  params: GetNotificationsParams,
): Promise<Notification[]> {
  const qs = new URLSearchParams();
  if (params.userId) qs.set('userId', params.userId);
  if (params.subscriptionId) qs.set('subscriptionId', params.subscriptionId);
  if (params.limit != null) qs.set('limit', String(params.limit));
  if (params.offset != null) qs.set('offset', String(params.offset));
  return request<Notification[]>(`/notifications?${qs.toString()}`);
}
