import { useEffect, useRef, useState } from 'react';
import type { Tournament, TournamentRound } from '@/engine/tournaments';
import type { TournamentCommand } from '../../../server/src/modules/tournaments/tournament.schema';

export function PairingsEditor({ event, round, busy, text, send }: { event: Tournament; round: TournamentRound; busy: boolean; text: (es: string, en: string) => string; send: (command: TournamentCommand) => Promise<void> }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);
  const [matches, setMatches] = useState(() => round.matches.map(({ id, table, players }) => ({ id, table, players: [...players] as [string, string | null] })));
  const [reason, setReason] = useState('');
  const [resetResults, setResetResults] = useState(false);
  useEffect(() => { if (open) dialog.current?.showModal(); }, [open]);
  const entrants = event.players.filter((p) => round.matches.some((m) => m.players.includes(p.id)));
  const hasBye = round.matches.some((m) => m.players[1] === null);
  function swap(index: number, side: number, selected: string | null) {
    setMatches((current) => {
      const next = current.map((m) => ({ ...m, players: [...m.players] as [string, string | null] }));
      const previous = next[index]!.players[side]!;
      for (const m of next) for (let i = 0; i < 2; i++) if (m.players[i] === selected) m.players[i] = previous;
      next[index]!.players[side] = selected;
      // Keep the actual player first in a bye pairing.
      for (const m of next) if (m.players[0] === null) m.players = [m.players[1]!, null];
      return next;
    });
  }
  const erasesResults = matches.some((m) => { const old = round.matches.find((v) => v.id === m.id)!; return old.result && old.result.end !== 'BYE' && old.players.some((id, i) => id !== m.players[i]); });
  return <>
    <button disabled={busy} onClick={() => setOpen(true)}>{text('Editar partidas', 'Edit matches')}</button>
    {open && <dialog ref={dialog} className="t-pairings-dialog" onCancel={() => setOpen(false)}>
      <form className="tournament-form" onSubmit={(e) => { e.preventDefault(); void send({ type: 'EDIT_PAIRINGS', round: round.number, matches, reason, resetResults }); }}>
        <h2>{text('Editar partidas · Ronda', 'Edit matches · Round')} {round.number}</h2>
        <p>{text('Selecciona un jugador para intercambiarlo con su posición actual. También puedes cambiar el número de mesa.', 'Select a player to swap them with their current position. You can also change table numbers.')}</p>
        {matches.map((m, index) => <fieldset key={m.id}><legend>{text('Partida', 'Match')} {index + 1}</legend><div className="t-field-grid">
          <label>{text('Mesa', 'Table')}<input type="number" required min={1} max={128} value={m.table} onChange={(e) => setMatches(matches.map((v, i) => i === index ? { ...v, table: Number(e.target.value) } : v))} /></label>
          {[0, 1].map((side) => <label key={side}>{text('Jugador', 'Player')} {side + 1}<select value={m.players[side] ?? ''} onChange={(e) => swap(index, side, e.target.value || null)}>{entrants.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}{hasBye && <option value="">{text('Descanso (BYE)', 'Bye')}</option>}</select></label>)}
        </div></fieldset>)}
        <label>{text('Motivo del cambio', 'Reason for change')}<input required minLength={3} maxLength={1000} value={reason} onChange={(e) => setReason(e.target.value)} /></label>
        {erasesResults && <label><input type="checkbox" required checked={resetResults} onChange={(e) => setResetResults(e.target.checked)} />{text('Confirmo que se borren los resultados y las listas seleccionadas de las partidas cuyos jugadores cambien.', 'Clear results and selected rosters in matches whose players change.')}</label>}
        <div className="tournament-actions"><button disabled={busy}>{text('Guardar partidas', 'Save matches')}</button><button type="button" disabled={busy} onClick={() => setOpen(false)}>{text('Cancelar', 'Cancel')}</button></div>
      </form>
    </dialog>}
  </>;
}
