import { describe, expect, it, vi } from 'vitest';
import type { Pool } from 'mysql2/promise';
import { AuthRepository } from '../../server/src/modules/auth/auth.repository';
import { parseAdminPagination } from '../../server/src/modules/admin/admin.routes';
import { EmailDeliveryLogRepository } from '../../server/src/modules/email/email-delivery-log.repository';
import { SupportRepository } from '../../server/src/modules/support/support.repository';

describe('paginación de administración', () => {
  it('valida las consultas y convierte parámetros inválidos en un error HTTP 400', () => {
    expect(parseAdminPagination({})).toEqual({ page: 1, pageSize: 20 });
    expect(parseAdminPagination({ page: '3', pageSize: '50' })).toEqual({ page: 3, pageSize: 50 });

    for (const query of [
      { page: '0' },
      { page: '1.5' },
      { page: 'no' },
      { pageSize: '0' },
      { pageSize: '101' },
    ]) {
      try {
        parseAdminPagination(query);
        throw new Error('La consulta inválida fue aceptada.');
      } catch (error) {
        expect(error).toMatchObject({ status: 400, code: 'INVALID_INPUT' });
      }
    }
  });

  it('pagina usuarios con un orden estable y conserva el total global', async () => {
    const execute = vi.fn()
      .mockResolvedValueOnce([[
        {
          id: 'user-1', email: 'one@example.com', nickname: 'One', locale: 'es', is_active: 1,
          email_verified_at: null, google_sub: null, has_password: 1, last_login_at: null, saved_lists: '4',
        },
      ], []])
      .mockResolvedValueOnce([[{ total: '273' }], []]);
    const repository = new AuthRepository({ execute } as unknown as Pool);

    const users = await repository.listUsersForAdmin(20, 40);
    const total = await repository.countUsersForAdmin();

    expect(users).toHaveLength(1);
    expect(users[0]?.savedLists).toBe(4);
    expect(total).toBe(273);
    expect(execute.mock.calls[0]?.[0]).toContain('ORDER BY u.created_at DESC, u.id DESC LIMIT 20 OFFSET 40');
  });

  it('aplica el filtro de soporte antes de LIMIT/OFFSET y cuenta ese filtro', async () => {
    const execute = vi.fn()
      .mockResolvedValueOnce([[
        {
          id: 'ticket-1', user_id: null, contact_email: 'help@example.com', subject: 'Ayuda', locale: 'es',
          status: 'OPEN', terms_version: '2026-08-01', terms_accepted_at: '2026-09-01 10:00:00',
          created_at: '2026-09-01 10:00:00', updated_at: '2026-09-02 10:00:00',
        },
      ], []])
      .mockResolvedValueOnce([[{ total: 31 }], []]);
    const repository = new SupportRepository({ execute } as unknown as Pool);

    const tickets = await repository.listTickets('OPEN', 20, 20);
    const total = await repository.countTickets('OPEN');

    expect(tickets[0]?.status).toBe('OPEN');
    expect(total).toBe(31);
    expect(execute).toHaveBeenNthCalledWith(
      1,
      expect.stringContaining('WHERE status = ? ORDER BY updated_at DESC, id DESC LIMIT 20 OFFSET 20'),
      ['OPEN'],
    );
    expect(execute).toHaveBeenNthCalledWith(2, expect.stringContaining('WHERE status = ?'), ['OPEN']);
  });

  it('pagina el historial y calcula los fallos sobre todo el registro', async () => {
    const query = vi.fn()
      .mockResolvedValueOnce([[
        {
          id: 9, recipient: 'one@example.com', message_type: 'SMTP_TEST', subject: 'Test', locale: 'es',
          status: 'SENT', provider_message_id: null, error_message: null, created_at: '2026-09-22 10:00:00',
        },
      ], []])
      .mockResolvedValueOnce([[{ total: '148', failed: '7' }], []]);
    const repository = new EmailDeliveryLogRepository({ query } as unknown as Pool);

    const logs = await repository.list(20, 60);
    const summary = await repository.countSummary();

    expect(logs).toHaveLength(1);
    expect(summary).toEqual({ total: 148, failed: 7 });
    expect(query.mock.calls[0]?.[0]).toContain('ORDER BY created_at DESC, id DESC');
    expect(query.mock.calls[0]?.[0]).toContain('LIMIT 20 OFFSET 60');
  });

  it('limita tamaños y desplazamientos interpolados a valores seguros', async () => {
    const execute = vi.fn().mockResolvedValue([[], []]);
    const repository = new AuthRepository({ execute } as unknown as Pool);

    await repository.listUsersForAdmin(999, -10);

    expect(execute.mock.calls[0]?.[0]).toContain('LIMIT 100 OFFSET 0');
  });
});
