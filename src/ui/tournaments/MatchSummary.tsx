import type { Tournament, TournamentMatch } from '@/engine/tournaments';
import { tournamentScore } from '@/engine/tournaments';
import { RaceEmblem } from './TournamentDisplay';

export function MatchSummary({ match, event, text }: { match: TournamentMatch; event: Tournament; text: (es: string, en: string) => string }) {
  const score = match.result ? tournamentScore(match.result, event.config.scale) : null;
  const finishes = { NORMAL: text('Finalizada', 'Finished'), TIME: text('Por tiempo', 'Time limit'), CONCESSION: text('Concesión', 'Concession'), NO_SHOW: text('Incomparecencia', 'No-show'), GAME_LOSS: text('Derrota por sanción', 'Game loss'), BYE: text('Descanso', 'Bye') };
  return <>
    <header className="t-match-heading"><h3>{text('Mesa', 'Table')} <b>{match.table}</b></h3><span className={`t-match-status ${match.disputed ? 'is-disputed' : ''}`}>{match.disputed ? text('En disputa', 'Disputed') : match.result ? finishes[match.result.end] : text('Pendiente de resultado', 'Awaiting result')}</span></header>
    <div className="t-match-arena">
      {match.players.map((id, i) => {
        const player = event.players.find((p) => p.id === id);
        const outcome = score ? score[i]![0] > score[1 - i]![0] ? 'win' : score[i]![0] < score[1 - i]![0] ? 'loss' : 'draw' : 'pending';
        return <div className={`t-match-contender t-contender--${outcome}`} key={id ?? 'bye'}>
          <div className="t-contender-identity">{player && <RaceEmblem race={player.race} />}<strong>{player?.name ?? text('Descanso', 'Bye')}</strong><small>{score ? outcome === 'win' ? text('Victoria', 'Win') : outcome === 'loss' ? text('Derrota', 'Loss') : text('Empate', 'Draw') : text('Sin resultado', 'No result')}</small></div>
          <div className="t-contender-score"><strong>{match.result && ['NORMAL', 'TIME'].includes(match.result.end) ? match.result.vp[i] : '—'}</strong><span>{text('PUNTOS DE VICTORIA', 'VICTORY POINTS')}</span></div>
        </div>;
      })}
      <span className="t-match-versus" aria-hidden="true">VS</span>
    </div>
  </>;
}
