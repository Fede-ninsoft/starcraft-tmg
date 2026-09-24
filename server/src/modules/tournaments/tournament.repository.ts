import type { Pool, RowDataPacket } from 'mysql2/promise';
import { TOURNAMENT_CLOSE_DELAY_MS, type StoredTournament } from '../../../../src/engine/tournaments.js';
import { HttpError } from '../../lib/errors.js';

interface TournamentRow extends RowDataPacket { id: string; owner_id: string; payload: string; revision: number }
function decode(row: TournamentRow): StoredTournament { return typeof row.payload === 'string' ? JSON.parse(row.payload) as StoredTournament : row.payload; }
const dateField = (key: string) => `CAST(REPLACE(LEFT(JSON_UNQUOTE(JSON_EXTRACT(payload, '$.config.${key}')), 23), 'T', ' ') AS DATETIME(3))`;
const endDate = `COALESCE(${dateField('endsAt')}, DATE_ADD(${dateField('startsAt')}, INTERVAL (JSON_EXTRACT(payload, '$.config.rounds') * JSON_EXTRACT(payload, '$.config.roundMinutes')) MINUTE))`;

/** A tournament is a transaction aggregate (max 128 players). One row lock
 * serializes seats, deadlines, pairings and results; history is append-only.
 * Catalog snapshots never leave the server in ordinary event responses. */
export class TournamentRepository {
  constructor(private readonly pool: Pool) {}
  /** Persist the automatic finish before directory, detail or command reads. */
  async completeExpired(now = new Date()): Promise<number> {
    // JSON dates are UTC; use an explicit UTC cutoff independent of DB timezone.
    const cutoff = new Date(now.getTime() - TOURNAMENT_CLOSE_DELAY_MS).toISOString().replace('T', ' ').replace('Z', '');
    let total = 0;
    for (;;) {
      const connection = await this.pool.getConnection();
      let count = 0;
      try {
        await connection.beginTransaction();
        const [rows] = await connection.query<TournamentRow[]>(`SELECT id, owner_id, payload, revision FROM tournaments WHERE status IN ('PUBLISHED', 'IN_PROGRESS') AND starts_at < ? AND ${endDate} < ? ORDER BY starts_at, id LIMIT 100 FOR UPDATE`, [cutoff, cutoff]);
        count = rows.length;
        for (const row of rows) {
          const event = decode(row);
          event.status = 'COMPLETED';
          event.revision = row.revision + 1;
          event.invitationHash = null;
          event.invitationExpiresAt = null;
          await connection.execute('UPDATE tournaments SET status = ?, revision = ?, payload = ? WHERE id = ?', [event.status, event.revision, JSON.stringify(event), row.id]);
          await connection.execute('INSERT INTO tournament_audit (tournament_id, revision, actor_id, action, detail) VALUES (?, ?, ?, ?, ?)', [row.id, event.revision, row.owner_id, 'AUTO_COMPLETE', JSON.stringify({ command: { type: 'AUTO_COMPLETE' }, previous: null })]);
        }
        await connection.commit();
      } catch (error) { await connection.rollback(); throw error; } finally { connection.release(); }
      total += count;
      if (count < 100) return total;
    }
  }
  async list(ownerId: string | null, offset: number, period: 'all' | 'current' | 'past' = 'all', now = new Date()): Promise<StoredTournament[]> {
    await this.completeExpired(now);
    const filter = period === 'current' ? " AND status NOT IN ('COMPLETED', 'CANCELLED')" : period === 'past' ? " AND status IN ('COMPLETED', 'CANCELLED')" : '';
    // Prioritize active registrations before LIMIT so they also lead the first page.
    const registered = `COALESCE(JSON_CONTAINS(payload, JSON_OBJECT('id', ?, 'status', 'ACTIVE'), '$.players'), 0)`;
    const [rows] = await this.pool.query<TournamentRow[]>(`SELECT payload, revision FROM tournaments WHERE (status <> 'DRAFT' OR owner_id = ?)${filter} ORDER BY ${registered} DESC, starts_at DESC, id LIMIT 25 OFFSET ?`, [ownerId, ownerId, offset]);
    return rows.map(decode);
  }
  async find(id: string): Promise<StoredTournament> {
    await this.completeExpired();
    const [rows] = await this.pool.execute<TournamentRow[]>('SELECT payload, revision FROM tournaments WHERE id = ?', [id]);
    if (!rows[0]) throw new HttpError(404, 'TOURNAMENT_NOT_FOUND', 'No existe ese torneo.');
    return decode(rows[0]);
  }
  async create(t: StoredTournament): Promise<void> {
    await this.pool.execute('INSERT INTO tournaments (id, owner_id, status, starts_at, payload) VALUES (?, ?, ?, ?, ?)', [t.id, t.ownerId, t.status, t.config.startsAt.slice(0, 19).replace('T', ' '), JSON.stringify(t)]);
  }
  async mutate(id: string, revision: number, actor: string, action: string, detail: unknown, change: (t: StoredTournament) => void | Promise<void>): Promise<StoredTournament> {
    await this.completeExpired();
    const connection = await this.pool.getConnection();
    try {
      await connection.beginTransaction();
      const [rows] = await connection.execute<TournamentRow[]>('SELECT payload, revision FROM tournaments WHERE id = ? FOR UPDATE', [id]);
      if (!rows[0]) throw new HttpError(404, 'TOURNAMENT_NOT_FOUND', 'No existe ese torneo.');
      if (rows[0].revision !== revision) throw new HttpError(409, 'TOURNAMENT_CONFLICT', 'El torneo ha cambiado. Actualiza antes de continuar.');
      const t = decode(rows[0]);
      const previous = ['ROSTER', 'GUEST_ROSTER', 'CORRECT_ROSTER', 'ROUND_COUNT', 'RESOLVE', 'RESULT', 'PENALTY', 'APPROVE_DQ', 'CONFIGURE', 'DEADLINE', 'REOPEN', 'GENERATE'].includes(action)
        ? { players: structuredClone(t.players), rounds: structuredClone(t.rounds), config: structuredClone(t.config), penalties: structuredClone(t.penalties) } : null;
      await change(t);
      t.revision++;
      await connection.execute('UPDATE tournaments SET status = ?, starts_at = ?, revision = ?, payload = ? WHERE id = ?', [t.status, t.config.startsAt.slice(0, 19).replace('T', ' '), t.revision, JSON.stringify(t), id]);
      await connection.execute('INSERT INTO tournament_audit (tournament_id, revision, actor_id, action, detail) VALUES (?, ?, ?, ?, ?)', [id, t.revision, actor, action, JSON.stringify({ command: detail, previous })]);
      await connection.commit();
      return t;
    } catch (error) { await connection.rollback(); throw error; } finally { connection.release(); }
  }
  async audit(id: string): Promise<unknown[]> {
    const [rows] = await this.pool.execute<RowDataPacket[]>('SELECT a.revision, a.actor_id, p.nickname AS actor_name, a.action, a.detail, a.created_at FROM tournament_audit a LEFT JOIN profiles p ON p.user_id = a.actor_id WHERE a.tournament_id = ? ORDER BY a.revision DESC LIMIT 500', [id]);
    return rows;
  }
}
