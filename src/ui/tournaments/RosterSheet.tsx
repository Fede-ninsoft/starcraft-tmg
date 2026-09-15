import type { TournamentRoster } from '@/engine/tournaments';
import { RaceEmblem, TournamentIcon, type TournamentText } from './TournamentDisplay';

// Read the saved tournament snapshot, not today's catalog: names and costs must stay historical.
export function rosterSheetData(roster: TournamentRoster) {
  const lines = roster.text.replace(/\r\n/g, '\n').split('\n');
  let cursor = 3;
  const units = roster.list.entries.map((entry) => {
    const raw = lines[cursor++] ?? '';
    const match = raw.match(/^(.*) × (\d+) \| ([\d.]+) minerals \| ([\d.]+) supply$/);
    const upgrades = lines.slice(cursor, cursor + entry.upgrades.length).map((line) => line.trim());
    cursor += entry.upgrades.length;
    return { name: match?.[1] ?? raw, models: match?.[2], minerals: match?.[3], supply: match?.[4], upgrades };
  });
  const take = (count: number) => { const result = lines.slice(cursor, cursor + count); cursor += count; return result; };
  const tactics = take(roster.list.tacticalCardIds.length);
  const missions = take(roster.list.missionCardIds.length);
  const deployments = take(roster.list.deploymentCardIds.length);
  const creep = take(roster.list.creepCardId ? 1 : 0);
  const totals = (lines[cursor] ?? '').match(/^([\d.]+) minerals · ([\d.]+) gas · ([\d.]+) supply$/);
  return { faction: lines[2] ?? '', units, tactics, missions, deployments, creep, totals: totals ? totals.slice(1) : null };
}

export function RosterSheet({ roster, text }: { roster: TournamentRoster; text: TournamentText }) {
  const data = rosterSheetData(roster);
  const groups = [
    { title: text('Cartas tácticas', 'Tactical cards'), cards: data.tactics, kind: 'tactics' },
    { title: text('Misiones', 'Missions'), cards: data.missions, kind: 'missions' },
    { title: text('Despliegues', 'Deployments'), cards: data.deployments, kind: 'deployments' },
    { title: text('Biomateria', 'Creep'), cards: data.creep, kind: 'creep' },
  ];
  return <div className={`t-roster-sheet t-roster-sheet--${roster.list.race.toLowerCase()}`}>
    <div className="t-roster-identity"><RaceEmblem race={roster.list.race} /><strong>{data.faction}</strong><span>{roster.list.scaleId === 'standard' ? 'Standard' : 'Skirmish'} · {text('Lista', 'Roster')} {roster.slot}</span></div>
    {data.totals && <dl className="t-roster-totals">{[text('Minerales', 'Minerals'), text('Gas vespeno', 'Vespene gas'), text('Suministro', 'Supply')].map((label, i) => <div key={label}><dt>{label}</dt><dd>{data.totals![i]}{i === 0 && <small> / {roster.list.mineralLimit}</small>}</dd></div>)}</dl>}
    <section className="t-roster-section"><h3><TournamentIcon name="swords" /> {text('Unidades', 'Units')} <small>{data.units.length}</small></h3>
      <div className="t-roster-unit-scroll"><table className="t-roster-unit-table"><thead><tr><th>{text('Unidad y mejoras', 'Unit and upgrades')}</th><th>{text('Miniaturas', 'Models')}</th><th>{text('Minerales', 'Minerals')}</th><th>{text('Suministro', 'Supply')}</th></tr></thead>
        <tbody>{data.units.map((unit, i) => <tr key={roster.list.entries[i]!.instanceId}><td><strong>{unit.name}</strong>{unit.upgrades.length > 0 && <ul className="t-roster-upgrades">{unit.upgrades.map((upgrade, j) => <li key={j}>{upgrade}</li>)}</ul>}</td><td>{unit.models ?? '—'}</td><td>{unit.minerals ?? '—'}</td><td>{unit.supply ?? '—'}</td></tr>)}</tbody>
      </table></div>
    </section>
    <div className="t-roster-card-grid">{groups.filter((group) => group.cards.length).map((group) => <section className={`t-roster-section t-roster-section--${group.kind}`} key={group.kind}><h3><TournamentIcon name="list" /> {group.title}</h3><ul className="t-roster-cards">{group.cards.map((card, i) => { const gas = card.match(/^(.*) · ([\d.]+) gas$/); return <li key={i}><span>{gas?.[1] ?? card}</span>{gas && <small>{gas[2]} {text('gas', 'gas')}</small>}</li>; })}</ul></section>)}</div>
  </div>;
}
