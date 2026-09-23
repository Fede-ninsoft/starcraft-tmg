import { afterEach, describe, expect, it, vi } from 'vitest';
import { currentUser, getAdminGameStats, getEmailDeliveryLogs, listAdminUsers, listSupportTickets } from '@/auth/authService';

describe('cliente de autenticación', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('no permite que el navegador reutilice una respuesta antigua de /auth/me', async () => {
    const fetchMock = vi.fn(async () => new Response(JSON.stringify({ user: { id: 'user-1' } }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    }));
    vi.stubGlobal('fetch', fetchMock);

    await currentUser();

    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining('/auth/me'),
      expect.objectContaining({ credentials: 'include', cache: 'no-store' }),
    );
  });

  it('envía página, tamaño y filtro en las consultas administrativas', async () => {
    const fetchMock = vi.fn(async (_input: RequestInfo | URL, _init?: RequestInit) => new Response(JSON.stringify({}), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    }));
    vi.stubGlobal('fetch', fetchMock);

    await listAdminUsers({ page: 2, pageSize: 20 });
    await getAdminGameStats({ page: 3, pageSize: 25 });
    await getEmailDeliveryLogs({ page: 4, pageSize: 50 });
    await listSupportTickets({ page: 5, pageSize: 10, status: 'ANSWERED' });

    const urls = fetchMock.mock.calls.map(([url]) => String(url));
    expect(urls[0]).toContain('/admin/users?page=2&pageSize=20');
    expect(urls[1]).toContain('/admin/match-stats?page=3&pageSize=25');
    expect(urls[2]).toContain('/admin/smtp/logs?page=4&pageSize=50');
    expect(urls[3]).toContain('/admin/support?page=5&pageSize=10&status=ANSWERED');
  });
});
