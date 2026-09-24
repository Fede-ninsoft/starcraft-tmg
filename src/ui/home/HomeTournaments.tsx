import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { listTournaments, type TournamentSummary } from '@/auth/tournamentService';
import { localizedPath } from '@/i18n/routing';
import { selectHomeTournaments } from './homeTournamentSelection';
import './home-tournaments.css';

async function loadActivePublicTournaments(): Promise<TournamentSummary[]> {
  const entries: TournamentSummary[] = [];
  let next: number | null = 0;
  // The existing API orders its pages by creation/start date, so read every
  // page before choosing the eight dates nearest to today.
  while (next !== null) {
    const page = await listTournaments(next);
    entries.push(...page.tournaments);
    next = page.nextOffset;
  }
  return selectHomeTournaments(entries, Date.now());
}

function formatEventDate(value: string, language: string, timeZone: string, options: Intl.DateTimeFormatOptions): string {
  try { return new Intl.DateTimeFormat(language, { ...options, timeZone }).format(new Date(value)); }
  catch { return new Intl.DateTimeFormat(language, { ...options, timeZone: 'UTC' }).format(new Date(value)); }
}

export function HomeTournaments() {
  const { t, i18n } = useTranslation('home');
  const locale = i18n.language.startsWith('en') ? 'en' : 'es';
  const language = locale === 'en' ? 'en-GB' : 'es-ES';
  const [entries, setEntries] = useState<TournamentSummary[] | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let active = true;
    void loadActivePublicTournaments()
      .then((loaded) => { if (active) setEntries(loaded); })
      .catch(() => { if (active) setError(true); });
    return () => { active = false; };
  }, []);

  const datePart = (value: string, timeZone: string, part: 'day' | 'month') => formatEventDate(value, language, timeZone, part === 'day' ? { day: '2-digit' } : { month: 'short' });
  const dateLabel = (value: string, timeZone: string) => formatEventDate(value, language, timeZone, { dateStyle: 'medium', timeStyle: 'short' });

  return <section className="home-section home-tournaments" aria-labelledby="home-tournaments-title">
    <div className="home-section__heading home-tournaments__heading">
      <div><h2 id="home-tournaments-title">{t('tournamentsTitle')}</h2><span className="muted small">{t('tournamentsHint')}</span></div>
      <a className="home-tournaments__all" href={localizedPath('tournaments', locale)}>{t('tournamentsViewAll')} <span aria-hidden="true">↗</span></a>
    </div>
    {entries === null && !error && <div className="panel empty" role="status">{t('tournamentsLoading')}</div>}
    {error && <div className="panel empty">{t('tournamentsError')}</div>}
    {entries?.length === 0 && <div className="panel empty">{t('tournamentsEmpty')}</div>}
    {!!entries?.length && <div className="home-tournaments__grid">
      {entries.map((entry) => {
        const startsAt = entry.config.startsAt;
        const inProgress = entry.status === 'IN_PROGRESS';
        const upcoming = Date.parse(startsAt) > Date.now();
        return <a key={entry.id} className="home-tournament-card" href={localizedPath('tournaments', locale, entry.id)}>
          <span className="home-tournament-card__date" aria-hidden="true"><strong>{datePart(startsAt, entry.config.timezone, 'day')}</strong><span>{datePart(startsAt, entry.config.timezone, 'month')}</span></span>
          <span className="home-tournament-card__main">
            <span className={`home-tournament-card__state${inProgress ? ' home-tournament-card__state--live' : ''}`}>{inProgress ? t('tournamentsInProgress') : upcoming ? t('tournamentsUpcoming') : t('tournamentsPublished')}</span>
            <strong className="home-tournament-card__name">{entry.config.name}</strong>
            <span className="home-tournament-card__meta">{entry.config.location} · <time dateTime={startsAt}>{dateLabel(startsAt, entry.config.timezone)}</time></span>
          </span>
          <span className="home-tournament-card__aside"><span>{entry.playerCount}/{entry.config.capacity} {t('tournamentsPlayers')}</span><span className="home-tournament-card__arrow" aria-hidden="true">→</span></span>
        </a>;
      })}
    </div>}
  </section>;
}
