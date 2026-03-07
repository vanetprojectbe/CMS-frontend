import { AdminUser, AuditLogEntry, UserRole } from '@/types/admin';

/**
 * Admin API service — connects to your MongoDB backend.
 * Replace BASE_URL with your actual API endpoint.
 */
const BASE_URL = '/api/admin';

// ── Users ──────────────────────────────────────────────

export async function fetchUsers(): Promise<AdminUser[]> {
  const res = await fetch(`${BASE_URL}/users`);
  if (!res.ok) throw new Error('Failed to fetch users');
  return res.json();
}

export async function updateUserRole(userId: string, role: UserRole): Promise<AdminUser> {
  const res = await fetch(`${BASE_URL}/users/${userId}/role`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ role }),
  });
  if (!res.ok) throw new Error('Failed to update user role');
  return res.json();
}

export async function toggleUserStatus(userId: string, enabled: boolean): Promise<AdminUser> {
  const res = await fetch(`${BASE_URL}/users/${userId}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status: enabled ? 'active' : 'disabled' }),
  });
  if (!res.ok) throw new Error('Failed to update user status');
  return res.json();
}

export async function createUser(data: { email: string; name: string; role: UserRole }): Promise<AdminUser> {
  const res = await fetch(`${BASE_URL}/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create user');
  return res.json();
}

// ── Audit Logs ─────────────────────────────────────────

export async function fetchAuditLogs(params?: {
  action?: string;
  performedBy?: string;
  limit?: number;
  offset?: number;
}): Promise<AuditLogEntry[]> {
  const query = new URLSearchParams();
  if (params?.action) query.set('action', params.action);
  if (params?.performedBy) query.set('performedBy', params.performedBy);
  if (params?.limit) query.set('limit', String(params.limit));
  if (params?.offset) query.set('offset', String(params.offset));

  const res = await fetch(`${BASE_URL}/audit-logs?${query}`);
  if (!res.ok) throw new Error('Failed to fetch audit logs');
  return res.json();
}
