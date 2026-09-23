import { describe, expect, it, vi } from 'vitest';
import type { Pool } from 'mysql2/promise';
import { GameRepository } from '../../server/src/modules/game-sessions/game.repository';

describe('resumen administrativo de partidas', () => {
  it('agrupa todas las sesiones por usuario, incluidos los estados en curso', async () => {
    const totals = [{
      total_users: '2', total_sessions: '6', configuration_count: '1', active_count: '2',
      finished_count: '2', abandoned_count: '1', guest_sessions: '2',
    }];
    const rows = [
      {
        user_id: 'user-1', email: 'one@example.com', nickname: 'One', is_active: 1,
        total_sessions: '3', configuration_count: '0', active_count: '1', finished_count: '2', abandoned_count: '0',
        last_activity_at: '2026-08-30 12:00:00',
      },
      {
        user_id: 'user-2', email: 'two@example.com', nickname: null, is_active: 0,
        total_sessions: 1, configuration_count: 1, active_count: 0, finished_count: 0, abandoned_count: 0,
        last_activity_at: '2026-08-29 10:00:00',
      },
    ];
    const execute = vi.fn()
      .mockResolvedValueOnce([totals, []])
      .mockResolvedValueOnce([rows, []]);
    const repository = new GameRepository({ execute } as unknown as Pool);

    await expect(repository.adminSummaryByUser()).resolves.toEqual({
      users: [
        {
          userId: 'user-1', email: 'one@example.com', nickname: 'One', isActive: true,
          sessions: 3, configuration: 0, active: 1, finished: 2, abandoned: 0,
          lastActivityAt: '2026-08-30 12:00:00',
        },
        {
          userId: 'user-2', email: 'two@example.com', nickname: null, isActive: false,
          sessions: 1, configuration: 1, active: 0, finished: 0, abandoned: 0,
          lastActivityAt: '2026-08-29 10:00:00',
        },
      ],
      totals: { users: 2, sessions: 6, configuration: 1, active: 2, finished: 2, abandoned: 1, guestSessions: 2 },
      pagination: { page: 1, pageSize: 20, total: 2, totalPages: 1 },
    });
    expect(execute).toHaveBeenCalledTimes(2);
    expect(execute.mock.calls[1]?.[0]).toContain('ORDER BY total_sessions DESC, last_activity_at DESC, u.id DESC');
    expect(execute.mock.calls[1]?.[0]).toContain('LIMIT 20 OFFSET 0');
  });

  it('ajusta una página fuera de rango antes de consultar las filas', async () => {
    const execute = vi.fn()
      .mockResolvedValueOnce([[{ total_users: 21, total_sessions: 21, configuration_count: 0, active_count: 21, finished_count: 0, abandoned_count: 0, guest_sessions: 0 }], []])
      .mockResolvedValueOnce([[], []]);
    const repository = new GameRepository({ execute } as unknown as Pool);

    const result = await repository.adminSummaryByUser(99, 20);

    expect(result.pagination).toEqual({ page: 2, pageSize: 20, total: 21, totalPages: 2 });
    expect(execute.mock.calls[1]?.[0]).toContain('LIMIT 20 OFFSET 20');
  });
});
