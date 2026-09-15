import { useState } from 'react';
import type { RemoteList } from '@/auth/listService';
import type { Tournament, TournamentPlayer } from '@/engine/tournaments';
import type { TournamentCommand } from '../../../server/src/modules/tournaments/tournament.schema';
import type { TournamentText } from './TournamentDisplay';

export function AddGuestForm({ send, text, busy }: { send: (c: TournamentCommand) => Promise<void>; text: TournamentText; busy: boolean }) {
  const [name, setName] = useState('');
  const [race, setRace] = useState<TournamentPlayer['race']>('TERRAN');
  return <div className="tournament-card"><h3>{text('Añadir participante invitado', 'Add guest player')}</h3>
    <p className="t-muted">{text('No necesita cuenta ni correo. Tú gestionas su asistencia, listas y resultados.', 'No account or email needed. You manage their check-in, rosters and results.')}</p>
    <form className="tournament-actions" onSubmit={(e) => { e.preventDefault(); void send({ type: 'ADD_GUEST', name: name.trim(), race }); }}>
      <label>{text('Nombre del participante', 'Player name')}<input required maxLength={100} value={name} onChange={(e) => setName(e.target.value)} /></label>
      <label>{text('Facción', 'Faction')}<select value={race} onChange={(e) => setRace(e.target.value as typeof race)}><option value="TERRAN">Terran</option><option value="ZERG">Zerg</option><option value="PROTOSS">Protoss</option></select></label>
      <button className="tournament-primary" disabled={busy || !name.trim()}>{text('Añadir participante', 'Add player')}</button>
    </form>
  </div>;
}

export function GuestRosterForm({ player, event, lists, send, text, busy, now }: { player: TournamentPlayer; event: Tournament; lists: RemoteList[]; send: (c: TournamentCommand) => Promise<void>; text: TournamentText; busy: boolean; now: number }) {
  const [listId, setListId] = useState(''); const [slot, setSlot] = useState(1);
  const available = lists.filter((l) => l.race === player.race && l.scaleId === event.config.scale);
  return <form className="t-guest-roster" onSubmit={(e) => { e.preventDefault(); void send({ type: 'GUEST_ROSTER', playerId: player.id, listId, slot }); }}>
    <h3>{text('Lista del invitado', 'Guest roster')}</h3>
    <p>{text('Selecciona una lista guardada en tu cuenta. Se copiará a la inscripción del invitado.', 'Select a roster saved in your account. A copy will be attached to the guest registration.')}</p>
    <label>{text('Lista guardada', 'Saved roster')}<select required value={listId} onChange={(e) => setListId(e.target.value)}><option value="">{text('Selecciona una lista', 'Choose a roster')}</option>{available.map((l) => <option key={l.id} value={l.id}>{l.name}</option>)}</select></label>
    <label>{text('Número de lista', 'Roster number')}<select value={slot} onChange={(e) => setSlot(Number(e.target.value))}><option value="1">{text('Lista 1', 'Roster 1')}</option>{event.config.listFormat === 'DUAL' && <option value="2">{text('Lista 2', 'Roster 2')}</option>}</select></label>
    {!available.length && <p>{text('Crea y guarda primero una lista de esta facción y formato en el constructor.', 'First create and save a roster of this faction and format in the builder.')}</p>}
    {now > Date.parse(event.config.rosterDeadlineAt) && <p>{text('El plazo de listas está cerrado. Puedes ampliarlo desde Organización.', 'The roster deadline has passed. Extend it in Organisation.')}</p>}
    <button className="tournament-primary" disabled={busy || !listId || now > Date.parse(event.config.rosterDeadlineAt)}>{text('Guardar lista del invitado', 'Save guest roster')}</button>
  </form>;
}
