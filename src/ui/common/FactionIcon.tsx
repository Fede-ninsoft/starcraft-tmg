import type { Race } from '@/engine/types';
import './FactionIcon.css';

/** Shared dimensions and CSS-only framing for every faction emblem. */
export function FactionIcon({ race, alt = '' }: { race: Race; alt?: string }) {
  return <span className={`faction-icon faction-icon--${race.toLowerCase()}`}>
    <img className="faction-icon__image" src={`/factions/${race.toLowerCase()}-transparent.png`} width={256} height={256} alt={alt} />
  </span>;
}
