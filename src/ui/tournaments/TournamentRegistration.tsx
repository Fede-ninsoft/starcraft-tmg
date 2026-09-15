import { useId, useRef } from 'react';
import { FactionIcon } from '@/ui/common/FactionIcon';
import type { Tournament } from '@/engine/tournaments';
import { TournamentIcon, type TournamentText } from './TournamentDisplay';

type Race = Tournament['players'][number]['race'];

export function TournamentRegistration({ event, race, onRaceChange, onJoin, invitation, busy, text }: {
  event: Pick<Tournament, 'config' | 'players'>;
  race: Race;
  onRaceChange: (race: Race) => void;
  onJoin: () => void;
  invitation: string;
  busy: boolean;
  text: TournamentText;
}) {
  const id = useId();
  const dialog = useRef<HTMLDialogElement>(null);
  const remaining = Math.max(0, event.config.capacity - event.players.filter((p) => p.status === 'ACTIVE').length);
  const needsInvitation = event.config.registrationMode === 'INVITE_ONLY' && !invitation;
  return <>
    <div className="t-join-trigger"><button type="button" className="t-join-submit" aria-haspopup="dialog" aria-controls={`${id}-dialog`} disabled={busy} onClick={() => dialog.current?.showModal()}><TournamentIcon name="users" />{text('Inscribirme al torneo', 'Join tournament')}</button></div>
    <dialog ref={dialog} id={`${id}-dialog`} className="tournament-modal t-join-dialog" aria-labelledby={`${id}-title`}>
    <section className="t-join-panel" aria-labelledby={`${id}-title`}>
    <div className="t-join-dialog-tools"><button type="button" onClick={() => dialog.current?.close()} aria-label={text('Cerrar inscripción', 'Close registration')}>{text('Cerrar', 'Close')} <span aria-hidden="true">×</span></button></div>
    <header className="t-join-heading">
      <span className="t-join-symbol"><TournamentIcon name="users" /></span>
      <div><span className="t-join-eyebrow">{text('Participa en el torneo', 'Join the tournament')}</span><h2 id={`${id}-title`}>{text('Reserva tu plaza', 'Reserve your place')}</h2><p>{text('Elige tu raza y confirma tu inscripción para participar.', 'Choose your race and confirm your registration to take part.')}</p></div>
      <span className={`t-join-capacity${remaining === 0 ? ' is-full' : ''}`}><TournamentIcon name={remaining > 0 ? 'check' : 'lock'} />{remaining > 0 ? `${remaining} ${text('plazas disponibles', 'places available')}` : text('Plazas agotadas', 'Event full')}</span>
    </header>
    <form onSubmit={(e) => { e.preventDefault(); if (!busy && remaining > 0 && !needsInvitation) onJoin(); }}>
      <fieldset disabled={busy}><legend>{text('¿Con qué raza vas a jugar?', 'Which race will you play?')}</legend>
        <div className="t-join-races">{(['ZERG', 'TERRAN', 'PROTOSS'] as const).map((option) => <label className={`t-join-race t-join-race--${option.toLowerCase()}`} key={option}>
          <input type="radio" name={`${id}-race`} value={option} checked={race === option} onChange={() => onRaceChange(option)} />
          <span className="t-join-race-face"><FactionIcon race={option} /><strong>{option[0] + option.slice(1).toLowerCase()}</strong><span className="t-join-selected"><TournamentIcon name="check" /></span></span>
        </label>)}</div>
      </fieldset>
      <footer className="t-join-footer">
        <p id={`${id}-note`}><TournamentIcon name={needsInvitation ? 'lock' : 'info'} /><span>{needsInvitation ? text('Abre el enlace de invitación que te facilite el organizador.', 'Open the invitation link supplied by the organiser.') : event.config.kind === 'COMMUNITY' ? text('Las listas son opcionales. Después de inscribirte podrás confirmar tu asistencia en Participantes y listas.', 'Rosters are optional. After registering, confirm your attendance in Players and rosters.') : text('Después de inscribirte, entrega tus listas para su aprobación en Participantes y listas.', 'After registering, submit your rosters for approval in Players and rosters.')}</span></p>
        <button className="t-join-submit" disabled={busy || remaining === 0 || needsInvitation} aria-describedby={`${id}-note`}><TournamentIcon name="check" />{busy ? text('Inscribiendo…', 'Registering…') : text('Inscribirme al torneo', 'Join tournament')}</button>
      </footer>
    </form>
    </section>
    </dialog>
  </>;
}
