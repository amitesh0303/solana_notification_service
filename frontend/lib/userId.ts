const DEMO_USER_ID = 'demo-user-00000000-0000-0000-0000-000000000001';

export function getUserId(): string {
  if (typeof window === 'undefined') return DEMO_USER_ID;
  const stored = localStorage.getItem('solnotify_user_id');
  if (stored) return stored;
  localStorage.setItem('solnotify_user_id', DEMO_USER_ID);
  return DEMO_USER_ID;
}
