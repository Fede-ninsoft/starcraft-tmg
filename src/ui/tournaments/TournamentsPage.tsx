import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '@/store/authStore';
import { loadRemoteLists, type RemoteList } from '@/auth/listService';
import { createTournament, getTournament, getTournamentAudit, listTournaments, tournamentCommand, type TournamentResponse, type TournamentSummary } from '@/auth/tournamentService';
import { localizedPath, routeLocale } from '@/i18n/routing';
import { MatchSummary } from './MatchSummary';
import type { Tournament, TournamentConfig, TournamentMatch, TournamentRoster } from '@/engine/tournaments';
import type { TournamentCommand } from '../../../server/src/modules/tournaments/tournament.schema';
import { EventSummary, ParticipantTable, StandingsTable, TournamentIcon, RaceEmblem, PlayerActions, type TournamentIconName } from './TournamentDisplay';
import './tournaments.css';
import { TournamentHistory } from './TournamentHistory';
import { RosterSheet } from './RosterSheet';
import { AddGuestForm, GuestRosterForm } from './GuestForms';
import { PairingsEditor } from './PairingsEditor';
import { TournamentRegistration } from './TournamentRegistration';
import { ShareTournamentButton } from './ShareTournamentButton';

type Text = (es: string, en: string) => string;
const statuses: Record<string, [string, string]> = { DRAFT: ['Borrador', 'Draft'], PUBLISHED: ['Publicado', 'Published'], IN_PROGRESS: ['En curso', 'In progress'], COMPLETED: ['Finalizado', 'Completed'], CANCELLED: ['Cancelado', 'Cancelled'], ACTIVE: ['Activo', 'Active'], CLOSED: ['Cerrada', 'Closed'], WITHDRAWN: ['Retirado', 'Withdrawn'], DISQUALIFIED: ['Descalificado', 'Disqualified'] };
function initialConfig(): TournamentConfig {
  const start = new Date(Date.now() + 14 * 86400000);
  return { name: '', description: '', location: '', timezone: Intl.DateTimeFormat().resolvedOptions().timeZone, startsAt: start.toISOString(), endsAt: new Date(+start + 8 * 3600000).toISOString(), rosterDeadlineAt: new Date(+start - 7 * 86400000).toISOString(), rostersPublicAt: start.toISOString(), rulesCutoffAt: new Date().toISOString(), capacity: 16, rounds: 3, roundMinutes: 150, kind: 'COMMUNITY', scale: 'standard', registrationMode: 'OPEN', listFormat: 'DUAL', rules: '', maps: '', conductContact: '' };
}
const inputDate = (date: string) => { const d = new Date(date); return new Date(+d - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16); };

function ConfigForm({ initial, save, busy, text }: { initial: TournamentConfig; save: (config: TournamentConfig) => void; busy: boolean; text: Text }) {
  const [value, set] = useState({ ...initial, endsAt: initial.endsAt ?? new Date(Date.parse(initial.startsAt) + initial.rounds * initial.roundMinutes * 60000).toISOString() });
  function field(key: keyof TournamentConfig, label: string, type = 'text') {
    return <label>{label}<input required type={type} value={String(value[key])} min={key === 'capacity' ? 2 : 1} max={key === 'capacity' ? 128 : key === 'rounds' ? 7 : key === 'roundMinutes' ? 180 : undefined} onChange={(e) => set({ ...value, [key]: type === 'number' ? Number(e.target.value) : e.target.value })} /></label>;
  }
  function select(key: keyof TournamentConfig, label: string, options: [string, string][]) { return <label>{label}<select value={String(value[key])} onChange={(e) => set({ ...value, [key]: e.target.value })}>{options.map(([id, name]) => <option key={id} value={id}>{name}</option>)}</select></label>; }
  return <form className="tournament-form t-config-form" onSubmit={(e) => { e.preventDefault(); save(value); }}>
    <fieldset><legend><TournamentIcon name="info" />{text('Datos del torneo', 'Event details')}</legend><div className="t-field-grid">{field('name', text('Nombre', 'Name'))}{field('location', text('Lugar', 'Venue'))}
    </div></fieldset><fieldset><legend><TournamentIcon name="trophy" />{text('Formato e inscripción', 'Format and registration')}</legend><div className="t-field-grid">{select('kind', text('Categoría', 'Category'), [['COMMUNITY', text('Comunitario', 'Community')], ['COMPETITIVE', text('Competitivo', 'Competitive')]])}
    {select('scale', text('Escala', 'Scale'), [['standard', 'Standard'], ['skirmish', 'Skirmish']])}
    {select('registrationMode', text('Inscripción', 'Registration'), [['OPEN', text('Pública', 'Open')], ['INVITE_ONLY', text('Por enlace privado', 'Private invitation')]])}
    {select('listFormat', text('Listas', 'Rosters'), [['DUAL', text('Una o dos listas', 'One or two rosters')], ['SINGLE', text('Lista única', 'Single roster')]])}
    {field('capacity', text('Plazas', 'Capacity'), 'number')}{field('rounds', text('Rondas', 'Rounds'), 'number')}{field('roundMinutes', text('Minutos por ronda', 'Minutes per round'), 'number')}
    </div></fieldset><fieldset><legend><TournamentIcon name="calendar" />{text('Fechas y plazos', 'Dates and deadlines')}</legend><div className="t-field-grid">{field('timezone', text('Zona horaria del evento', 'Event time zone'))}
    {(['startsAt', 'endsAt', 'rosterDeadlineAt', 'rostersPublicAt'] as const).map((key, i) => <label key={key}>{[text('Comienzo', 'Start'), text('Fin del torneo', 'Event end'), text('Plazo de listas', 'Roster deadline'), text('Publicación de listas', 'Roster publication')][i]}<input required type="datetime-local" value={inputDate(value[key])} onChange={(e) => { if (e.target.value) set({ ...value, [key]: new Date(e.target.value).toISOString() }); }} /></label>)}
    <p className="tournament-wide">{text('Las fechas se introducen en la zona horaria de tu dispositivo. Competitivo: Standard, 150 minutos; 12–32 jugadores: 3 rondas; 33–128: 5.', 'Enter dates in your device time zone. Competitive: Standard, 150 minutes; 12–32 players: 3 rounds; 33–128: 5.')}</p>
    </div></fieldset><fieldset><legend><TournamentIcon name="list" />{text('Información adicional · opcional', 'Additional information · optional')}</legend><div className="t-field-grid">{(['description', 'maps'] as const).map((key, i) => <label className="tournament-wide" key={key}>{[text('Descripción', 'Description'), text('Mapas y terreno', 'Maps and terrain')][i]}<textarea value={value[key]} onChange={(e) => set({ ...value, [key]: e.target.value })} /></label>)}
    </div></fieldset><button disabled={busy} className="tournament-primary">{text('Guardar torneo', 'Save tournament')}</button>
  </form>;
}

function ResultForm({ match, event, correction, send, text, busy }: { match: TournamentMatch; event: Tournament; correction: boolean; send: (command: TournamentCommand) => void; text: Text; busy: boolean }) {
  const [missionId, setMissionId] = useState(match.result?.mission?.id ?? '');
  const [vp, setVP] = useState<[number, number]>(match.result?.vp ?? [0, 0]);
  const [end, setEnd] = useState<'NORMAL' | 'TIME' | 'CONCESSION' | 'NO_SHOW' | 'GAME_LOSS'>(match.result?.end === 'BYE' ? 'NORMAL' : match.result?.end ?? 'NORMAL');
  const [winner, setWinner] = useState<0 | 1>(match.result?.winner ?? 0);
  const [reason, setReason] = useState('');
  const [rosters, setRosters] = useState<[string | null, string | null]>(match.players.map((id, i) => match.rosterIds[i] ?? event.players.find((p) => p.id === id)?.rosters[0]?.id ?? null) as [string | null, string | null]);
  return <form className="tournament-result t-result-compact" onSubmit={(e) => { e.preventDefault(); send(correction ? { type: 'RESOLVE', matchId: match.id, vp, end, winner, reason, missionId: missionId || null } : { type: 'RESULT', matchId: match.id, vp, end, winner, reason, rosterIds: rosters, missionId: missionId || null }); }}>
    <header className="t-result-heading"><h4>{correction ? text('Corregir resultado', 'Correct result') : text('Registrar resultado', 'Record result')}</h4><span>{event.config.scale === 'standard' ? text('Estándar · 2000 minerales', 'Standard · 2000 minerals') : text('Escaramuza · 1000 minerales', 'Skirmish · 1000 minerals')}</span></header>
    <label className="t-result-mission">{text('Misión jugada', 'Mission played')}<select required={['NORMAL', 'TIME'].includes(end)} value={missionId} onChange={(e) => setMissionId(e.target.value)}><option value="">{text('Selecciona la misión', 'Choose the mission')}</option>{event.availableMissions?.map((mission) => <option key={mission.id} value={mission.id}>{mission.name}</option>)}</select></label>
    <div className="t-result-scores">
    {match.players.map((id, i) => { const p = event.players.find((v) => v.id === id); return <div className="t-result-player" key={id}>{p && <RaceEmblem race={p.race} />}
      <label><span className="t-result-player-name">{p?.name}<small>{text('Puntos de victoria', 'Victory points')}</small></span><input type="number" min="0" max="999" required value={vp[i]} onChange={(e) => setVP(i === 0 ? [Number(e.target.value), vp[1]] : [vp[0], Number(e.target.value)])} /></label>
      {!correction && <label>{event.config.kind === 'COMMUNITY' ? text('Lista utilizada (opcional)', 'Roster used (optional)') : text('Lista utilizada', 'Roster used')}<select required={event.config.kind === 'COMPETITIVE'} value={rosters[i] ?? ''} onChange={(e) => setRosters(i === 0 ? [e.target.value || null, rosters[1]] : [rosters[0], e.target.value || null])}><option value="">{event.config.kind === 'COMMUNITY' ? text('Sin lista', 'No roster') : text('Selecciona una lista', 'Choose a roster')}</option>{p?.rosters.map((r) => <option key={r.id} value={r.id}>{r.list.name}</option>)}</select></label>}
    </div>; })}
    </div>
    <label>{text('Final', 'Finish')}<select value={end} onChange={(e) => setEnd(e.target.value as typeof end)}>{(['NORMAL', 'TIME', 'CONCESSION', 'NO_SHOW', 'GAME_LOSS'] as const).map((v, i) => <option key={v} value={v}>{[text('Normal', 'Normal'), text('Tiempo', 'Time'), text('Concesión', 'Concession'), text('Incomparecencia', 'No-show'), text('Derrota por sanción', 'Game loss')][i]}</option>)}</select></label>
    {!['NORMAL', 'TIME'].includes(end) && <label>{text('Ganador', 'Winner')}<select value={winner} onChange={(e) => setWinner(Number(e.target.value) as 0 | 1)}>{match.players.map((id, i) => <option key={id} value={i}>{event.players.find((p) => p.id === id)?.name}</option>)}</select></label>}
    <label className="t-result-notes">{text('Motivo / observaciones', 'Reason / notes')}<textarea rows={1} placeholder={correction ? text('Explica qué se ha corregido…', 'Explain the correction…') : text('Añade un comentario si lo necesitas…', 'Add an optional comment…')} required={correction} minLength={correction ? 3 : 0} maxLength={1000} value={reason} onChange={(e) => setReason(e.target.value)} /></label>
    <footer className="t-result-footer"><span>{text('PV = puntos de victoria', 'VP = victory points')}</span><button className="tournament-primary" disabled={busy}>{busy ? text('Guardando…', 'Saving…') : correction ? text('Guardar corrección', 'Save correction') : text('Registrar resultado', 'Record result')}</button></footer>
  </form>;
}

export function TournamentsPage() {
  const registration = useRef<HTMLDivElement>(null);
  const { i18n } = useTranslation(); const text: Text = (es, en) => i18n.language.startsWith('en') ? en : es;
  const location = useLocation(); const navigate = useNavigate(); const user = useAuthStore((s) => s.user);
  const locale = routeLocale(location.pathname); const base = localizedPath('tournaments', locale);
  const id = location.pathname.split('/')[3] || null;
  const [entries, setEntries] = useState<TournamentSummary[]>([]); const [next, setNext] = useState<number | null>(null);
  const [data, setData] = useState<TournamentResponse | null>(null); const [error, setError] = useState(''); const [busy, setBusy] = useState(false);
  const [savedNotice, setSavedNotice] = useState<{ destination?: string } | null>(null);
  const [creating, setCreating] = useState(false); const [editing, setEditing] = useState(false); const [tab, setTab] = useState('info');
  const [lists, setLists] = useState<RemoteList[]>([]); const [selectedList, setSelectedList] = useState(''); const [slot, setSlot] = useState(1);
  const [race, setRace] = useState<'ZERG' | 'TERRAN' | 'PROTOSS'>('ZERG');
  const [invitation, setInvitation] = useState(() => new URLSearchParams(location.hash.slice(1)).get('invite') ?? '');
  const [shareLink, setShareLink] = useState(''); const [viewer, setViewer] = useState<TournamentRoster | null>(null);
  const [roundNumber, setRoundNumber] = useState<number | null>(null); const [resultId, setResultId] = useState<string | null>(null);
  const [deadline, setDeadline] = useState('');
  const [audit, setAudit] = useState<unknown[] | null>(null); const [now, setNow] = useState(Date.now());
  const [revisedRounds, setRevisedRounds] = useState(3);
  const [reason, setReason] = useState(''); const [penaltyPlayer, setPenaltyPlayer] = useState(''); const [penalty, setPenalty] = useState<'CAUTION' | 'WARNING' | 'GAME_LOSS' | 'DISQUALIFICATION'>('WARNING');
  const [period, setPeriod] = useState<'all' | 'current' | 'past' | 'future'>('all');
  const [query, setQuery] = useState(''); const [mine, setMine] = useState(false);
  useEffect(() => {
    const token = new URLSearchParams(location.hash.slice(1)).get('invite');
    if (token) { setInvitation(token); navigate(location.pathname, { replace: true }); }
  }, [location.hash, location.pathname, navigate]);
  useEffect(() => {
    let cancelled = false; setData(null); setError(''); setShareLink(''); setResultId(null); setRoundNumber(null); setAudit(null); setEditing(false);
    const load = async () => { try { if (id) { const value = await getTournament(id); if (!cancelled) setData(value); } else { const page = await listTournaments(0, period); if (!cancelled) { setEntries(page.tournaments); setNext(page.nextOffset); } } } catch (e) { if (!cancelled) setError(String(e)); } };
    void load(); return () => { cancelled = true; };
  }, [id, user?.id, period]);
  useEffect(() => {
    if (!id || busy || resultId || editing) return;
    let cancelled = false;
    const refresh = () => { void getTournament(id).then((v) => { if (!cancelled) setData(v); }).catch(() => { /* Explicit refresh reports failures; preserve the last view. */ }); };
    const interval = window.setInterval(refresh, 20000); window.addEventListener('focus', refresh);
    return () => { cancelled = true; clearInterval(interval); window.removeEventListener('focus', refresh); };
  }, [id, busy, resultId, editing]);
  useEffect(() => { const timer = window.setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(timer); }, []);
  useEffect(() => {
    if (!user?.emailVerified) { setLists([]); return; }
    let cancelled = false;
    const load = async () => { const all: RemoteList[] = []; let cursor: string | null = null; do { const page = await loadRemoteLists({ limit: 100, cursor }); all.push(...page.lists); cursor = page.nextCursor; } while (cursor); if (!cancelled) setLists(all); };
    void load().catch((e) => { if (!cancelled) setError(String(e)); }); return () => { cancelled = true; };
  }, [user?.id, user?.emailVerified]);
  async function run(operation: () => Promise<void>) { setBusy(true); setError(''); try { await operation(); } catch (e) { setError(e instanceof Error ? e.message : String(e)); } finally { setBusy(false); } }
  async function send(command: TournamentCommand) { if (!data) return; await run(async () => { const response = await tournamentCommand(data.tournament, command); setData(response); setResultId(null); if (command.type === 'CONFIGURE') { setEditing(false); setSavedNotice({}); } if (command.type === 'INVITATION' && !response.token) setShareLink(''); if (response.token) setShareLink(`${window.location.origin}${base}/${response.tournament.id}#invite=${response.token}`); }); }
  const t = data?.tournament; const owner = !!t && t.ownerId === user?.id; const staff = owner; const self = t?.players.find((p) => p.id === user?.id);
  const beforeStart = !!t && ['DRAFT', 'PUBLISHED'].includes(t.status); const latest = t?.rounds.at(-1); const displayed = t?.rounds.find((r) => r.number === roundNumber) ?? latest;
  const date = (v: string) => new Date(v).toLocaleString(locale, { timeZone: t?.config.timezone, dateStyle: 'medium', timeStyle: 'short' });
  const status = (v: string) => statuses[v] ? text(...statuses[v]) : v;
  const action = (label: string, command: TournamentCommand, icon?: TournamentIconName) => <button className={['WITHDRAW', 'CANCEL'].includes(command.type) ? 't-danger' : 'tournament-primary'} data-command={command.type} disabled={busy} onClick={() => void send(command)}>{icon && <TournamentIcon name={icon} />}{label}</button>;
  return <section className="tournaments">
    <header className="tournament-heading"><div><p className="tournament-eyebrow">STARCRAFT · ORGANISED PLAY</p><h1>{t?.config.name ?? (id ? text('Torneo', 'Tournament') : creating ? text('Crear torneo', 'Create tournament') : text('Torneos', 'Tournaments'))}</h1><p>{text('Compite, organiza y sigue cada ronda.', 'Compete, organise and follow every round.')}</p></div>{!id && <div className="tournament-actions">
      {user?.emailVerified && <button disabled={busy} className={creating ? undefined : 'tournament-primary'} onClick={() => setCreating(!creating)}>{creating ? text('Volver al listado', 'Back to tournaments') : text('Crear torneo', 'Create tournament')}</button>}
      <a href={localizedPath('organised-play', locale)}>{text('Juego organizado', 'Organised play')}</a>
    </div>}</header>
    {error && <TournamentErrorDialog message={error} text={text} />}
    {savedNotice && <TournamentSavedDialog text={text} close={() => { const destination = savedNotice.destination; setSavedNotice(null); if (destination) navigate(destination); }} />}
    {id && !t && error && <p>{text('No se ha podido cargar el torneo.', 'The tournament could not be loaded.')} <button disabled={busy} onClick={() => void run(async () => setData(await getTournament(id)))}>{text('Reintentar', 'Retry')}</button></p>}
    {busy && <p role="status">{text('Guardando…', 'Saving…')}</p>}
    {!user?.emailVerified && <p>{text('Puedes consultar todos los torneos. Inicia sesión con una cuenta verificada para crear uno o inscribirte.', 'You can view every tournament. Sign in with a verified account to create or join one.')} <a href={localizedPath('home', locale)}>{text('Iniciar sesión', 'Sign in')}</a></p>}
    {!id && <>
      {creating && <ConfigForm initial={initialConfig()} text={text} busy={busy} save={(config) => void run(async () => { const response = await createTournament(config); setCreating(false); setSavedNotice({ destination: `${base}/${response.tournament.id}` }); })} />}
      {!creating && <>
      <section className="t-directory-filters" aria-label={text('Filtrar torneos', 'Filter tournaments')}>
        <h2>{text('Explorar torneos', 'Explore tournaments')}</h2>
        <div className="t-period-filters" role="group" aria-label={text('Periodo del torneo', 'Tournament period')}>{(['all', 'current', 'future', 'past'] as const).map((v, i) => <button key={v} data-period={v} aria-pressed={period === v} onClick={() => setPeriod(v)}><span className="t-filter-icon"><TournamentIcon name={v === 'all' ? 'list' : v === 'current' ? 'swords' : v === 'past' ? 'flag' : 'calendar'} /></span>{[text('Todos', 'All'), text('En curso', 'Current'), text('Futuros', 'Upcoming'), text('Pasados', 'Past')][i]}</button>)}</div>
        <div className="t-directory-search-row">
          <label className="t-directory-search">{text('Buscar torneos', 'Search tournaments')}<span className="t-directory-search-input"><TournamentIcon name="search" /><input type="search" placeholder={text('Nombre del torneo o ciudad…', 'Tournament name or city…')} aria-describedby="t-directory-search-hint" value={query} onChange={(e) => setQuery(e.target.value)} /></span><small id="t-directory-search-hint">{text('Busca entre los torneos cargados.', 'Search among loaded tournaments.')}</small></label>
          {user && <label className="t-directory-mine"><input type="checkbox" checked={mine} onChange={(e) => setMine(e.target.checked)} /><TournamentIcon name="users" /><span>{text('Organizados por mí', 'Hosted by me')}</span></label>}
        </div>
        <p className="t-directory-note"><TournamentIcon name="info" /><span>{text('En curso: listas cerradas y hasta dos días después del fin del torneo.', 'Current: rosters closed and up to two days after the event ends.')}</span></p>
      </section>
      <div className="tournament-grid">{entries.filter((e) => (!mine || e.ownerId === user?.id) && `${e.config.name} ${e.config.location}`.toLowerCase().includes(query.toLowerCase())).map((e) => <article key={e.id}><EventSummary config={e.config} ownerName={e.ownerName} count={e.playerCount} isRegistered={e.isRegistered} status={e.status} statusLabel={status(e.status)} text={text} date={(v) => new Date(v).toLocaleString(locale, { timeZone: e.config.timezone, dateStyle: 'medium', timeStyle: 'short' })} title={<a href={`${base}/${e.id}`} onClick={(ev) => { ev.preventDefault(); navigate(`${base}/${e.id}`); }}>{e.config.name}</a>} /></article>)}</div>
      {!entries.length && <p>{text('No hay torneos en este filtro.', 'No tournaments match this filter.')}</p>}
      {next !== null && <button disabled={busy} onClick={() => void run(async () => { const page = await listTournaments(next, period); setEntries([...entries, ...page.tournaments]); setNext(page.nextOffset); })}>{text('Cargar más', 'Load more')}</button>}
      </>}
    </>}
    {id && !t && !error && <p role="status">{text('Cargando torneo…', 'Loading tournament…')}</p>}
    {t && <>
      <EventSummary config={t.config} ownerName={t.ownerName} count={t.players.filter((p) => p.status === 'ACTIVE').length} status={t.status} statusLabel={status(t.status)} date={date} text={text} primaryAction={<>
        {t.status !== 'DRAFT' && <ShareTournamentButton key={`${t.id}-${locale}`} url={`${window.location.origin}${base}/${encodeURIComponent(t.id)}`} text={text} />}
        {owner && <>
        {t.status === 'PUBLISHED' && action(text('Iniciar torneo', 'Start event'), { type: 'START' }, 'flag')}
        {t.status === 'IN_PROGRESS' && (!latest || latest.status === 'CLOSED') && t.rounds.filter((r) => r.status !== 'DRAFT').length < t.config.rounds && action(text('Generar emparejamientos', 'Generate pairings'), { type: 'GENERATE' }, 'users')}
        {t.status === 'IN_PROGRESS' && latest?.status === 'DRAFT' && action(text('Publicar emparejamientos', 'Publish pairings'), { type: 'PUBLISH_ROUND', acceptWarning: !!latest.warning }, 'check')}
        {t.status === 'IN_PROGRESS' && latest?.status === 'PUBLISHED' && action(text('Lanzar ronda', 'Start round'), { type: 'START_ROUND' }, 'swords')}
        {t.status === 'IN_PROGRESS' && latest?.status === 'ACTIVE' && action(text('Terminar ronda', 'Finish round'), { type: 'CLOSE_ROUND' }, 'flag')}
        </>}
      </>} />
      {!self && user?.emailVerified && t.status === 'PUBLISHED' && now < Date.parse(t.config.startsAt) && <TournamentRegistration event={t} race={race} onRaceChange={setRace} invitation={invitation} busy={busy} text={text} onJoin={() => void send({ type: 'JOIN', race, token: invitation || undefined })} />}
      {owner && t.status === 'IN_PROGRESS' && latest?.status === 'DRAFT' && latest.warning && <p role="alert" className="t-format-note">{text('La propuesta requiere repeticiones o alcanzó el límite de búsqueda. Revísala en Rondas antes de publicarla. Al publicar aceptas esta excepción.', 'The proposal needs rematches or reached the search limit. Review it in Rounds before publishing. Publishing accepts this exception.')}</p>}
      <nav className="tournament-tabs" aria-label={text('Secciones del torneo', 'Tournament sections')}>{['info', 'players', 'rounds', 'standings', ...(staff ? ['manage'] : [])].map((v, i) => <button key={v} aria-current={tab === v ? 'page' : undefined} onClick={() => setTab(v)}><TournamentIcon name={(['info', 'users', 'swords', 'trophy', 'settings'] as TournamentIconName[])[i]!} />{[text('Información', 'Information'), text('Participantes y listas', 'Players and rosters'), text('Rondas', 'Rounds'), text('Clasificación', 'Standings'), text('Organización', 'Organisation')][i]}</button>)}</nav>
      {tab === 'info' && <div className="tournament-card"><p className="tournament-prose">{t.config.description}</p><dl className="t-info-grid">{([['rosterDeadlineAt', text('Plazo de listas', 'Roster deadline')], ['rostersPublicAt', text('Publicación de listas', 'Roster publication')]] as const).map(([key, label]) => <div key={key}><dt><TournamentIcon name="calendar" />{label}</dt><dd>{date(t.config[key])}</dd></div>)}</dl><p className="t-format-note"><TournamentIcon name="list" />{t.config.listFormat === 'DUAL' ? text('Una o dos listas de la misma raza; pueden tener cartas de facción distintas.', 'One or two rosters of the same race; faction cards may differ.') : text('Lista única', 'Single roster')}</p>
        {t.config.maps && <><h3>{text('Mapas y terreno', 'Maps and terrain')}</h3><p className="tournament-prose">{t.config.maps}</p></>}
        {self && <p>{text('Tu inscripción', 'Your registration')}: {self.race} · {status(self.status)} · {self.checkedIn ? text('Asistencia confirmada', 'Checked in') : text('Pendiente de asistencia', 'Check-in pending')}</p>}
      </div>}
      {tab === 'players' && <>
        <p className="t-format-note"><TournamentIcon name="list" />{t.config.kind === 'COMMUNITY' ? text('Las listas son opcionales en este torneo comunitario. Solo es necesario confirmar asistencia para participar.', 'Rosters are optional in this community tournament. Players only need to check in to participate.') : text('En este torneo competitivo es obligatorio entregar listas y obtener su aprobación.', 'This competitive tournament requires submitted and approved rosters.')}</p>
        {owner && beforeStart && now < Date.parse(t.config.startsAt) && <AddGuestForm key={t.players.length} send={send} text={text} busy={busy} />}
        {self && beforeStart && <div className="tournament-card"><h2>{text('Mi inscripción', 'My registration')}</h2><div className="tournament-actions">{action(self.checkedIn ? text('Desmarcar asistencia', 'Undo check-in') : text('Confirmar asistencia', 'Check in'), { type: 'CHECK_IN', playerId: self.id, checkedIn: !self.checkedIn })}{action(text('Retirarme', 'Withdraw'), { type: 'WITHDRAW', playerId: self.id })}</div><form className="tournament-actions" onSubmit={(e) => { e.preventDefault(); void send({ type: 'ROSTER', slot, listId: selectedList }); }}><label>{text('Lista guardada', 'Saved roster')}<select required value={selectedList} onChange={(e) => setSelectedList(e.target.value)}><option value="">—</option>{lists.filter((l) => l.race === self.race && l.scaleId === t.config.scale).map((l) => <option key={l.id} value={l.id}>{l.name}</option>)}</select></label><label>{text('Entrega', 'Slot')}<select value={slot} onChange={(e) => setSlot(Number(e.target.value))}><option value="1">1</option>{t.config.listFormat === 'DUAL' && <option value="2">2</option>}</select></label><button disabled={busy || now > Date.parse(t.config.rosterDeadlineAt)}>{text('Entregar lista', 'Submit roster')}</button></form><p>{text('Se guarda una copia. Editar la lista original no cambia esta entrega.', 'A copy is saved. Editing the original does not change this submission.')}</p></div>}
        <ParticipantTable players={t.players} me={user?.id} text={text} status={status} view={setViewer} actions={(p) => {
          const mine = p.id === self?.id;
          if (!staff && !mine) return null;
          const canCheckIn = beforeStart && (owner || mine);
          const canWithdraw = (owner || mine) && p.status === 'ACTIVE' && (beforeStart || t.status === 'IN_PROGRESS');
          const hasRosters = p.rosters.length > 0 || !!p.rosterHistory?.length;
          if (!canCheckIn && !canWithdraw && !hasRosters) return null;
          return <PlayerActions name={p.name} text={text}>
            <div>
              {owner && p.guest && beforeStart && <GuestRosterForm player={p} event={t} lists={lists} send={send} text={text} busy={busy} now={now} />}
              {canCheckIn && action(p.checkedIn ? text('Desmarcar asistencia', 'Undo check-in') : text('Confirmar asistencia', 'Check in'), { type: 'CHECK_IN', playerId: p.id, checkedIn: !p.checkedIn })}
              {mine && beforeStart && <button onClick={() => registration.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })}>{text('Entregar o cambiar mis listas', 'Submit or change my rosters')}</button>}
              {p.rosters.map((r) => <div key={r.id}>
                <button onClick={() => setViewer(r)}>{r.slot}. {r.list.name}</button>
                <span>{r.approved ? text('Aprobada', 'Approved') : text('Pendiente de revisión', 'Awaiting review')}</span>
                {staff && beforeStart && action(r.approved ? text('Revocar aprobación', 'Revoke approval') : text('Aprobar', 'Approve'), { type: 'APPROVE', playerId: p.id, rosterId: r.id, approved: !r.approved })}
              </div>)}
              {p.rosterHistory?.map((r) => <button key={r.id} onClick={() => setViewer(r)}>{text('Versión anterior', 'Previous version')}: {r.list.name}</button>)}
              {staff && t.status === 'IN_PROGRESS' && p.rosters.map((r) => <button key={r.id} disabled={busy} onClick={() => {
                const note = window.prompt(text('El jugador debe corregir su lista original guardada. Motivo de la corrección:', 'The player must first correct their original saved roster. Reason for the organiser correction:'));
                if (note) void send({ type: 'CORRECT_ROSTER', playerId: p.id, slot: r.slot, listId: r.list.id, reason: note });
              }}>{text('Actualizar lista corregida', 'Update corrected roster')}: {r.list.name}</button>)}
              {canWithdraw && action(mine ? text('Retirarme', 'Withdraw') : text('Retirar del torneo', 'Drop from event'), { type: 'WITHDRAW', playerId: p.id })}
            </div>
          </PlayerActions>;
        }} />
      </>}
      {tab === 'rounds' && <>
        {owner && t.status === 'IN_PROGRESS' && displayed && displayed.number === latest?.number && displayed.status !== 'CLOSED' && <PairingsEditor key={`${t.revision}-${displayed.number}`} event={t} round={displayed} busy={busy} text={text} send={send} />}
        <label>{text('Ronda', 'Round')}<select value={displayed?.number ?? ''} onChange={(e) => { setRoundNumber(Number(e.target.value)); setResultId(null); }}>{t.rounds.map((r) => <option key={r.number} value={r.number}>{r.number} · {status(r.status)}</option>)}</select></label>
        {displayed?.status === 'ACTIVE' && displayed.startedAt && <p className="tournament-clock" role="timer">{Math.max(0, Math.ceil((Date.parse(displayed.startedAt) + t.config.roundMinutes * 60000 - now) / 60000))} {text('minutos restantes', 'minutes remaining')} {Date.parse(displayed.startedAt) + (t.config.roundMinutes - 15) * 60000 <= now && text('· No iniciéis otra ronda de batalla.', '· Do not start a new battle round.')}</p>}
        {!displayed && <p>{text('Los emparejamientos aparecerán aquí.', 'Pairings will appear here.')}</p>}
        {displayed?.matches.map((m) => <article className={`tournament-card t-match-card ${m.players.includes(user?.id ?? '') ? 'tournament-my-match' : ''}`} key={m.id}><MatchSummary match={m} event={t} text={text} />
          {m.players[1] && (staff || m.players.includes(user?.id ?? '')) && t.status === 'IN_PROGRESS' && ['ACTIVE', 'CLOSED'].includes(displayed.status) && <div className="tournament-actions">
            {(!m.result || staff) && <button onClick={() => setResultId(resultId === m.id ? null : m.id)}>{m.result ? text('Corregir resultado', 'Correct result') : text('Añadir resultado', 'Add result')}</button>}
            {m.result && !m.disputed && <button onClick={() => { const note = window.prompt(text('Motivo de la discrepancia', 'Reason for dispute')); if (note) void send({ type: 'DISPUTE', matchId: m.id, reason: note }); }}>{text('Comunicar discrepancia', 'Report discrepancy')}</button>}
          </div>}
          {m.result?.mission && <p className="t-format-note"><TournamentIcon name="list" />{text('Misión', 'Mission')}: <strong>{m.result.mission.name}</strong></p>}
          {resultId === m.id && <ResultForm key={`${m.id}-${m.result?.at}`} match={m} event={t} correction={!!m.result} text={text} busy={busy} send={(c) => void send(c)} />}
        </article>)}
      </>}
      {tab === 'standings' && <div className="t-standings"><h2>{t.status === 'COMPLETED' ? text('Clasificación final', 'Final standings') : text('Clasificación provisional', 'Provisional standings')}</h2><p className="t-muted">MP → TP → SoS → oTP · {text('Los empates completos comparten posición.', 'Complete ties share a position.')}</p><StandingsTable standings={data.standings} players={t.players} me={user?.id} text={text} view={setViewer} /></div>}
      {tab === 'manage' && staff && <>
        <div className="tournament-card"><h2>{text('Control del torneo', 'Event control')}</h2><div className="tournament-actions">
          {owner && beforeStart && <button onClick={() => setEditing(!editing)}>{text('Editar configuración', 'Edit settings')}</button>}
          {owner && t.status === 'DRAFT' && action(text('Publicar torneo', 'Publish event'), { type: 'PUBLISH' })}
          {owner && t.status === 'IN_PROGRESS' && latest?.status === 'DRAFT' && t.rounds.filter((r) => r.status !== 'DRAFT').length < t.config.rounds && action(text('Regenerar emparejamientos', 'Regenerate pairings'), { type: 'GENERATE' }, 'users')}
          {owner && t.status === 'IN_PROGRESS' && latest?.status === 'CLOSED' && t.rounds.length === t.config.rounds && action(text('Finalizar torneo', 'Complete event'), { type: 'COMPLETE' })}
          {owner && <button onClick={() => { const note = window.prompt(text('Motivo', 'Reason')); if (note) void send(t.status === 'COMPLETED' ? { type: 'REOPEN', reason: note } : { type: 'CANCEL', reason: note }); }}>{t.status === 'COMPLETED' ? text('Reabrir para corregir', 'Reopen for correction') : text('Cancelar torneo', 'Cancel event')}</button>}
        </div>{editing && <ConfigForm key={t.revision} initial={t.config} text={text} busy={busy} save={(config) => void send({ type: 'CONFIGURE', config })} />}</div>
        {owner && beforeStart && <div className="tournament-card"><h3>{text('Plazo de listas', 'Roster deadline')}</h3><form className="tournament-actions" onSubmit={(e) => { e.preventDefault(); void send({ type: 'DEADLINE', deadline: new Date(deadline).toISOString() }); }}><label>{text('Nuevo plazo (hora de tu dispositivo)', 'New deadline (device time)')}<input type="datetime-local" required value={deadline} onChange={(e) => setDeadline(e.target.value)} /></label><button disabled={busy}>{text('Cambiar o reabrir plazo', 'Change or reopen deadline')}</button></form></div>}
        {owner && beforeStart && t.config.registrationMode === 'INVITE_ONLY' && <div className="tournament-card"><h3>{text('Invitaciones', 'Invitations')}</h3>{t.config.registrationMode === 'INVITE_ONLY' && <><div className="tournament-actions">{action(text('Crear / renovar enlace privado', 'Create / rotate private link'), { type: 'INVITATION', revoke: false })}{action(text('Revocar enlace', 'Revoke link'), { type: 'INVITATION', revoke: true })}</div>{shareLink && <label>{text('Copia este enlace para invitar', 'Copy this invitation link')}<input readOnly value={shareLink} onFocus={(e) => e.target.select()} /></label>}</>}
        </div>}
        {owner && t.status === 'IN_PROGRESS' && !t.rounds.some((r) => r.number >= 2 && ['ACTIVE', 'CLOSED'].includes(r.status)) && <form className="tournament-card tournament-form" onSubmit={(e) => { e.preventDefault(); void send({ type: 'ROUND_COUNT', rounds: revisedRounds, reason }); }}><label>{text('Nuevo número de rondas', 'Revised round count')}<input type="number" min="1" max="7" value={revisedRounds} onChange={(e) => setRevisedRounds(Number(e.target.value))} /></label><label>{text('Motivo que se publicará', 'Reason to publish')}<input required minLength={3} value={reason} onChange={(e) => setReason(e.target.value)} /></label><button disabled={busy}>{text('Anunciar cambio de rondas', 'Announce round-count change')}</button></form>}
        {t.status === 'IN_PROGRESS' && <form className="tournament-card tournament-form" onSubmit={(e) => { e.preventDefault(); void send({ type: 'PENALTY', playerId: penaltyPlayer, penalty, reason }); }}><h3 className="tournament-wide">{text('Registrar sanción', 'Record penalty')}</h3><label>{text('Jugador', 'Player')}<select required value={penaltyPlayer} onChange={(e) => setPenaltyPlayer(e.target.value)}><option value="">—</option>{t.players.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}</select></label><label>{text('Sanción', 'Penalty')}<select value={penalty} onChange={(e) => setPenalty(e.target.value as typeof penalty)}>{['CAUTION', 'WARNING', 'GAME_LOSS', 'DISQUALIFICATION'].map((v) => <option key={v}>{v}</option>)}</select></label><label>{text('Motivo', 'Reason')}<input required minLength={3} value={reason} onChange={(e) => setReason(e.target.value)} /></label><button disabled={busy}>{text('Registrar', 'Record')}</button></form>}
        {owner && t.penalties.map((p, index) => p.pending && <div key={index} className="tournament-card"><p>{text('Descalificación pendiente de acuerdo', 'Disqualification awaiting agreement')}: {t.players.find((v) => v.id === p.playerId)?.name} · {p.reason}</p>{action(text('Aprobar descalificación', 'Approve disqualification'), { type: 'APPROVE_DQ', index })}</div>)}
        <button disabled={busy} onClick={() => void run(async () => setAudit((await getTournamentAudit(t.id)).audit))}>{text('Consultar historial de cambios', 'View change history')}</button>{audit && <TournamentHistory entries={audit} event={t} text={text} locale={locale} />}
      </>}
    </>}
    {viewer && <RosterDialog roster={viewer} text={text} close={() => setViewer(null)} />}

  </section>;
}

function TournamentSavedDialog({ text, close }: { text: Text; close: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => { dialog.current?.showModal(); }, []);
  return <dialog ref={dialog} className="tournament-modal t-saved-dialog" onCancel={(e) => { e.preventDefault(); close(); }} aria-labelledby="t-saved-title" aria-describedby="t-saved-message">
    <div><h2 id="t-saved-title"><TournamentIcon name="check" /> {text('Torneo guardado', 'Tournament saved')}</h2>
      <p id="t-saved-message">{text('Los datos del torneo se han guardado correctamente.', 'The tournament details have been saved successfully.')}</p>
      <button autoFocus className="tournament-primary" onClick={close}>{text('Entendido', 'OK')}</button>
    </div>
  </dialog>;
}

function TournamentErrorDialog({ message, text }: { message: string; text: Text }) {
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    dialog.current?.showModal();
    return () => { if (previous?.isConnected) previous.focus(); };
  }, [message]);
  return <dialog ref={dialog} className="tournament-modal t-error-dialog" role="alertdialog" aria-labelledby="t-error-title" aria-describedby="t-error-message">
    <div><h2 id="t-error-title"><TournamentIcon name="info" /> {text('No se ha podido completar la acción', 'The action could not be completed')}</h2>
      <p id="t-error-message">{message.replace(/^Error:\s*/, '')}</p>
      <button autoFocus className="tournament-primary" onClick={() => dialog.current?.close()}>{text('Entendido', 'OK')}</button>
    </div>
  </dialog>;
}

function RosterDialog({ roster, text, close }: { roster: TournamentRoster; text: Text; close: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => { const previous = document.activeElement as HTMLElement | null; dialog.current?.showModal(); return () => previous?.focus(); }, []);
  return <dialog ref={dialog} className="tournament-modal t-roster-dialog" onCancel={close} aria-label={roster.list.name}><div><header className="t-roster-dialog-heading"><div><p>{text('Lista de torneo', 'Tournament roster')}</p><h2>{roster.list.name}</h2></div><div className="t-roster-tools"><button onClick={() => window.print()}>{text('Imprimir', 'Print')}</button><button onClick={close}>{text('Cerrar', 'Close')}</button></div></header><RosterSheet roster={roster} text={text} /></div></dialog>;
}
