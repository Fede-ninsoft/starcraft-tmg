import type { Tournament } from '@/engine/tournaments';
import { TournamentIcon, type TournamentText } from './TournamentDisplay';

const labels: Record<string, [string, string]> = {
  EDIT_PAIRINGS: ['Emparejamientos modificados manualmente', 'Pairings edited manually'],
  ADD_GUEST: ['Participante invitado añadido', 'Guest player added'], GUEST_ROSTER: ['Lista de invitado entregada', 'Guest roster submitted'],
  CONFIGURE: ['Configuración actualizada', 'Settings updated'], DEADLINE: ['Plazo de listas modificado', 'Roster deadline changed'],
  ROUND_COUNT: ['Número de rondas modificado', 'Round count changed'], PUBLISH: ['Torneo publicado', 'Tournament published'],
  INVITATION: ['Enlace de invitación actualizado', 'Invitation link updated'], JOIN: ['Inscripción realizada', 'Player registered'],
  WITHDRAW: ['Participante retirado', 'Player withdrawn'], CHECK_IN: ['Asistencia actualizada', 'Check-in updated'],
  ROSTER: ['Lista entregada', 'Roster submitted'], CORRECT_ROSTER: ['Lista corregida', 'Roster corrected'], APPROVE: ['Revisión de lista', 'Roster reviewed'],
  JUDGE: ['Árbitro asignado', 'Judge assigned'], START: ['Torneo iniciado', 'Tournament started'], GENERATE: ['Emparejamientos generados', 'Pairings generated'],
  PUBLISH_ROUND: ['Emparejamientos publicados', 'Pairings published'], START_ROUND: ['Ronda iniciada', 'Round started'], CLOSE_ROUND: ['Ronda cerrada', 'Round closed'],
  RESULT: ['Resultado registrado', 'Result recorded'], DISPUTE: ['Discrepancia comunicada', 'Discrepancy reported'], RESOLVE: ['Resultado corregido', 'Result corrected'],
  PENALTY: ['Sanción registrada', 'Penalty recorded'], APPROVE_DQ: ['Descalificación aprobada', 'Disqualification approved'],
  COMPLETE: ['Torneo finalizado', 'Tournament completed'], AUTO_COMPLETE: ['Torneo finalizado automáticamente', 'Tournament completed automatically'], CANCEL: ['Torneo cancelado', 'Tournament cancelled'], REOPEN: ['Torneo reabierto', 'Tournament reopened'],
};
const fields: Record<string, [string, string]> = {
  name: ['Nombre', 'Name'], description: ['Descripción', 'Description'], location: ['Lugar', 'Venue'], timezone: ['Zona horaria', 'Time zone'],
  startsAt: ['Comienzo', 'Start'], endsAt: ['Fin', 'End'], rosterDeadlineAt: ['Plazo de listas', 'Roster deadline'], rostersPublicAt: ['Publicación de listas', 'Roster publication'],
  capacity: ['Plazas', 'Capacity'], rounds: ['Rondas', 'Rounds'], roundMinutes: ['Duración de ronda', 'Round duration'],
  kind: ['Categoría', 'Category'], scale: ['Escala', 'Scale'], registrationMode: ['Inscripción', 'Registration'], listFormat: ['Formato de listas', 'Roster format'],
  rules: ['Condiciones del evento', 'Event rules'], maps: ['Mapas y terreno', 'Maps and terrain'], conductContact: ['Contacto de conducta', 'Conduct contact'],
};
function record(value: unknown): Record<string, unknown> {
  if (typeof value === 'string') { try { return record(JSON.parse(value)); } catch { return {}; } }
  return value && typeof value === 'object' && !Array.isArray(value) ? value as Record<string, unknown> : {};
}
const string = (value: unknown) => typeof value === 'string' ? value : '';

export function TournamentHistory({ entries, event, text, locale }: { entries: unknown[]; event: Tournament; text: TournamentText; locale: string }) {
  const date = (value: unknown) => {
    const raw = string(value); const parsed = new Date(raw);
    return Number.isNaN(+parsed) ? text('Fecha no disponible', 'Date unavailable') : parsed.toLocaleString(locale, { dateStyle: 'medium', timeStyle: 'short', timeZone: event.config.timezone });
  };
  return <section className="t-history" aria-label={text('Historial de cambios', 'Change history')}>
    <h3>{text('Historial de cambios', 'Change history')}</h3>
    <p className="t-muted">{text('Los cambios más recientes aparecen primero.', 'Most recent changes appear first.')}</p>
    {!entries.length && <p>{text('Todavía no hay cambios registrados.', 'No changes recorded yet.')}</p>}
    <ol>{entries.map((value, index) => {
      const entry = record(value); const detail = record(entry.detail); const command = record(detail.command); const previous = record(detail.previous);
      const action = string(entry.action); const label = labels[action];
      const playerName = (id: unknown) => event.players.find((p) => p.id === id)?.name
        ?? (Array.isArray(previous.players) ? previous.players.map(record).find((p) => p.id === id)?.name as string | undefined : undefined);
      const actor = action === 'AUTO_COMPLETE' ? text('Sistema', 'System') : string(entry.actor_name) || (entry.actor_id === event.ownerId ? event.ownerName : playerName(entry.actor_id))
        || event.judges.find((j) => j.id === entry.actor_id)?.name || text('Usuario', 'User');
      const notes: string[] = [];
      if (action === 'ADD_GUEST' && typeof command.name === 'string') notes.push(`${text('Participante', 'Player')}: ${command.name}`);
      if (command.playerId) notes.push(`${text('Participante', 'Player')}: ${playerName(command.playerId) || text('Participante no disponible', 'Player unavailable')}`);
      if (action === 'CHECK_IN') notes.push(command.checkedIn ? text('Asistencia confirmada', 'Checked in') : text('Confirmación de asistencia retirada', 'Check-in removed'));
      if (action === 'APPROVE') notes.push(command.approved ? text('Lista aprobada', 'Roster approved') : text('Aprobación retirada', 'Approval revoked'));
      if (action === 'INVITATION') notes.push(command.revoke ? text('Enlace revocado', 'Link revoked') : text('Nuevo enlace privado generado', 'New private link generated'));
      if (typeof command.slot === 'number') notes.push(`${text('Lista', 'Roster')} ${command.slot}`);
      if (action === 'DEADLINE') notes.push(`${text('Nuevo plazo', 'New deadline')}: ${date(command.deadline)}`);
      if (typeof command.rounds === 'number') notes.push(`${text('Rondas', 'Rounds')}: ${command.rounds}`);
      if (Array.isArray(command.vp) && command.vp.length === 2 && command.vp.every((v) => typeof v === 'number')) notes.push(`${text('Puntos de victoria', 'Victory points')}: ${command.vp.join(' – ')}`);
      const round = event.rounds.find((r) => r.matches.some((m) => m.id === command.matchId));
      const match = round?.matches.find((m) => m.id === command.matchId);
      if (round && match) notes.push(`${text('Ronda', 'Round')} ${round.number} · ${text('Mesa', 'Table')} ${match.table}`);
      if (action === 'CONFIGURE') {
        const before = record(previous.config); const after = record(command.config);
        const changed = Object.keys(fields).filter((key) => key in after && after[key] !== before[key]);
        if (changed.length) notes.push(`${text('Campos modificados', 'Changed fields')}: ${changed.map((key) => text(...fields[key]!)).join(', ')}`);
      }
      const reason = string(command.reason);
      return <li key={typeof entry.revision === 'number' ? entry.revision : index}>
        <TournamentIcon name="clock" />
        <div><div className="t-history-heading"><strong>{label ? text(...label) : text('Cambio registrado', 'Change recorded')}</strong><time>{date(entry.created_at)}</time></div>
          <p className="t-history-author">{text('Realizado por', 'By')} {actor}</p>
          {notes.map((note, i) => <p key={i}>{note}</p>)}
          {reason && <p className="t-history-reason">{text('Motivo', 'Reason')}: {reason}</p>}
        </div>
      </li>;
    })}</ol>
  </section>;
}
