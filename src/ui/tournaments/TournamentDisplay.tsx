import { useRef, type ReactNode } from 'react';
import { FactionIcon } from '@/ui/common/FactionIcon';
import type { Standing, TournamentConfig, TournamentPlayer, TournamentRoster, TournamentStatus } from '@/engine/tournaments';

export type TournamentText = (es: string, en: string) => string;
export function PlayerActions({ name, text, children }: { name: string; text: TournamentText; children: ReactNode }) {
  const dialog = useRef<HTMLDialogElement>(null);
  return <>
    <button className="t-manage-trigger" onClick={() => dialog.current?.showModal()} aria-haspopup="dialog">{text('Gestionar', 'Manage')}</button>
    <dialog ref={dialog} className="tournament-modal t-actions-dialog" aria-label={`${text('Gestionar', 'Manage')} · ${name}`}>
      <div>
        <header className="t-actions-dialog-heading"><h2>{name}</h2><button onClick={() => dialog.current?.close()}>{text('Cerrar', 'Close')}</button></header>
        <div className="t-player-actions" onClick={(event) => { if (event.target instanceof Element && event.target.closest('button') && !event.target.closest('form')) dialog.current?.close(); }}>{children}</div>
      </div>
    </dialog>
  </>;
}
export type TournamentIconName = 'pin' | 'calendar' | 'users' | 'trophy' | 'flag' | 'list' | 'clock' | 'lock' | 'check' | 'settings' | 'info' | 'swords' | 'search' | 'share';
const paths: Record<TournamentIconName, string> = {
  share: 'M16 5a3 3 0 1 0 6 0 3 3 0 0 0-6 0ZM2 12a3 3 0 1 0 6 0 3 3 0 0 0-6 0Zm14 7a3 3 0 1 0 6 0 3 3 0 0 0-6 0ZM8 10.5l8-4M8 13.5l8 4',
  search: 'M20 20l-5-5M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z',
  pin: 'M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0ZM12 7a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z',
  calendar: 'M5 5h14v16H5ZM8 2v6m8-6v6M5 10h14M8 14h2m4 0h2m-8 4h2m4 0h2',
  users: 'M9 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM2 21v-3c0-4 14-4 14 0v3M17 4a4 4 0 0 1 0 8m2 3c3 0 3 4 3 6',
  trophy: 'M7 3h10v6a5 5 0 0 1-10 0ZM7 5H3v3a5 5 0 0 0 5 5m9-8h4v3a5 5 0 0 1-5 5m-4 1v6m-5 1h10',
  flag: 'M5 22V3m0 0c5-5 9 5 15 0v11c-6 5-10-5-15 0',
  list: 'M5 3h14v18H5Zm4 5h6m-6 4h6m-6 4h6',
  clock: 'M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-6v6l4 2',
  lock: 'M5 11h14v10H5Zm3 0V7a4 4 0 0 1 8 0v4m-4 4v3',
  check: 'm5 12 4 4L20 5',
  settings: 'M4 7h16M4 17h16M8 3v8m8 2v8',
  info: 'M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-1v6m0-10v1',
  swords: 'm4 3 14 14m-1-14L3 17m-1-4 7 7m6-7 7 7M4 3l1 5m12-5-1 5',
};
export function TournamentIcon({ name }: { name: TournamentIconName }) {
  return <svg className="t-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={paths[name]} /></svg>;
}
export function RaceEmblem({ race }: { race: TournamentPlayer['race'] }) {
  const label = race[0] + race.slice(1).toLowerCase();
  return <span className={`t-race t-race--${race.toLowerCase()}`} title={label}><FactionIcon race={race} alt={label} /><span className="t-race-label">{label}</span></span>;
}
export function StatusBadge({ value, label }: { value: string; label: string }) {
  return <span className={`tournament-badge t-status--${value.toLowerCase()}`}><span className="t-status-dot" />{label}</span>;
}
export function EventSummary({ config, ownerName, count, status, statusLabel, date, text, title, primaryAction, isRegistered = false }: { config: TournamentConfig; ownerName: string; count: number; status: TournamentStatus; statusLabel: string; date: (v: string) => string; text: TournamentText; title?: ReactNode; primaryAction?: ReactNode; isRegistered?: boolean }) {
  return <div className={`t-event-summary${isRegistered ? ' t-event-summary--registered' : ''}`}>
    {title && <div className="t-event-title"><span className="t-event-name">{title}</span>{isRegistered && <span className="t-registration-badge"><TournamentIcon name="check" />{text('Inscrito', 'Registered')}</span>}</div>}
    <div className="t-event-details">
      <span><TournamentIcon name="pin" />{config.location}</span>
      <span><TournamentIcon name="calendar" /><time dateTime={config.startsAt}>{date(config.startsAt)}</time>{config.endsAt && <><span>→</span><time dateTime={config.endsAt}>{date(config.endsAt)}</time></>}</span>
      <span><TournamentIcon name="users" /><strong>{ownerName}</strong></span>
      <div className="t-event-controls">
        {primaryAction}
        <small>{count}/{config.capacity} {text('jugadores', 'players')}</small>
      </div>
    </div>
    <div className="t-event-footer"><span><TournamentIcon name="trophy" />{config.kind === 'COMPETITIVE' ? text('Competitivo', 'Competitive') : text('Comunitario', 'Community')}</span><span><TournamentIcon name="swords" />{config.scale === 'standard' ? 'Standard' : 'Skirmish'} · {config.rounds} {text('rondas', 'rounds')}</span><span><TournamentIcon name={config.registrationMode === 'OPEN' ? 'users' : 'lock'} />{config.registrationMode === 'OPEN' ? text('Público', 'Open') : text('Enlace privado', 'Private link')}</span><StatusBadge value={status} label={statusLabel} /></div>
  </div>;
}
export function ParticipantTable({ players, me, text, status, view, actions }: { players: TournamentPlayer[]; me?: string; text: TournamentText; status: (v: string) => string; view: (r: TournamentRoster) => void; actions: (p: TournamentPlayer) => ReactNode }) {
  return <div className="tournament-table-wrap"><table className="t-player-table"><thead><tr><th>#</th><th>{text('Jugador', 'Player')}</th><th>{text('Facción', 'Faction')}</th><th>{text('Listas', 'Rosters')}</th><th>{text('Asistencia', 'Check-in')}</th><th>{text('Estado', 'Status')}</th><th><span className="sr-only">{text('Acciones', 'Actions')}</span></th></tr></thead><tbody>
    {players.map((p, i) => <tr key={p.id} className={p.id === me ? 't-row--self' : ''}><td className="t-position">{i + 1}</td><td><strong className="t-player-name">{p.name}</strong>{p.id === me && <small className="t-you">{text('Tú', 'You')}</small>}{p.guest && <small className="t-guest-label">{text('Invitado', 'Guest')}</small>}{p.spare && <small className="t-cell-note">{text('Suplente · sin clasificación', 'Spare · unranked')}</small>}</td><td><RaceEmblem race={p.race} /></td><td><div className="t-roster-links">{p.rosters.map((r) => <button key={r.id} className={`t-roster-link ${r.approved ? 'is-approved' : 'is-pending'}`} title={`${r.list.name} · ${r.approved ? text('Aprobada', 'Approved') : text('Pendiente de revisión', 'Awaiting review')}`} onClick={() => view(r)}><TournamentIcon name="list" /><span>{r.slot}</span><span className="sr-only">{r.list.name}</span></button>)}{!p.rosters.length && <small className="t-muted">{text('Sin lista visible', 'No visible roster')}</small>}</div></td><td><span className={p.checkedIn ? 't-check is-checked' : 't-check'}><TournamentIcon name={p.checkedIn ? 'check' : 'clock'} />{p.checkedIn ? text('Confirmada', 'Confirmed') : text('Pendiente', 'Pending')}</span></td><td><StatusBadge value={p.status} label={status(p.status)} /></td><td>{actions(p)}</td></tr>)}
    {!players.length && <tr><td colSpan={7} className="t-empty">{text('Todavía no hay participantes inscritos.', 'No players have registered yet.')}</td></tr>}
  </tbody></table></div>;
}
export function StandingsTable({ standings, players, me, text, view }: { standings: Standing[]; players: TournamentPlayer[]; me?: string; text: TournamentText; view: (r: TournamentRoster) => void }) {
  return <div className="tournament-table-wrap"><table className="t-player-table t-standings-table"><thead><tr><th>#</th><th>{text('Jugador', 'Player')}</th><th>{text('Facción / listas', 'Faction / rosters')}</th><th>MP</th><th>TP</th><th>{text('V / E / D', 'W / D / L')}</th><th>{text('Desempates', 'Tie breakers')}</th></tr></thead><tbody>{standings.map((s) => <tr key={s.id} className={s.id === me ? 't-row--self' : ''}><td className={`t-position ${s.position === 1 ? 't-position--first' : ''}`}>{s.position === 1 && <TournamentIcon name="trophy" />}{s.position}</td><td><strong className="t-player-name">{s.name}</strong>{s.id === me && <small className="t-you">{text('Tú', 'You')}</small>}</td><td><div className="t-roster-links"><RaceEmblem race={s.race} />{players.find((p) => p.id === s.id)?.rosters.map((r) => <button className="t-roster-link" title={r.list.name} key={r.id} onClick={() => view(r)}><TournamentIcon name="list" /><span className="sr-only">{r.list.name}</span>{r.slot}</button>)}</div></td><td><span className="t-score t-score--mp">{s.mp}</span></td><td><span className="t-score">{s.tp}</span></td><td><div className="t-record"><span className="t-win">{s.wins}</span><span>/</span><span className="t-draw">{s.draws}</span><span>/</span><span className="t-loss">{s.losses}</span></div></td><td><dl className="t-tiebreak"><div><dt>SoS</dt><dd>{s.sos.toFixed(4)}</dd></div><div><dt>oTP</dt><dd>{s.otp.toFixed(4)}</dd></div></dl></td></tr>)}{!standings.length && <tr><td colSpan={7} className="t-empty">{text('La clasificación aparecerá cuando haya participantes.', 'Standings will appear once players register.')}</td></tr>}</tbody></table></div>;
}
