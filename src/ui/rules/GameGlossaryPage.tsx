import { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { BASIC_RULE_SECTIONS } from '@/content/basicRules';
import { FAQ_SECTIONS } from '@/content/faqs';
import { GAME_TERM_FAQ_LINKS } from '@/content/gameTermFaqLinks';
import { GAME_TERMS } from '@/content/gameTerms';
import { localizedPath, routeLocale } from '@/i18n/routing';
import { searchGameTerms } from './searchGameTerms';
import './rules.css';

const CORE_RULES_PDF = 'https://archon-studio.com/files/manuals/sc/StarCraft-TMG_EN.pdf';
const FAQ_PDF = '/documents/StarCraft-TMG-FAQ_EN.pdf';
const sectionsById = new Map(BASIC_RULE_SECTIONS.map((section) => [section.id, section]));
const termsById = new Map(GAME_TERMS.map((term) => [term.id, term]));
const faqSectionsById = new Map(FAQ_SECTIONS.map((section) => [section.id, section]));
const categoryLabels: Record<string, { es: string; en: string }> = {
  core: { es: 'Concepto', en: 'Core rule' },
  army: { es: 'Ejército', en: 'Army' },
  terrain: { es: 'Terreno', en: 'Terrain' },
  weapons: { es: 'Armas', en: 'Weapons' },
  status: { es: 'Estado', en: 'Status' },
  abilities: { es: 'Habilidad', en: 'Ability' },
  combat: { es: 'Combate', en: 'Combat' },
  movement: { es: 'Movimiento', en: 'Movement' },
  objectives: { es: 'Objetivos', en: 'Objectives' },
};

export function GameGlossaryPage() {
  const { t } = useTranslation('rules');
  const location = useLocation();
  const navigate = useNavigate();
  const locale = routeLocale(location.pathname);
  const query = new URLSearchParams(location.search).get('q') ?? '';
  const matches = useMemo(() => searchGameTerms(GAME_TERMS, query, locale), [query, locale]);

  useEffect(() => {
    if (!location.hash.startsWith('#term-')) return;
    const id = decodeURIComponent(location.hash.slice(1));
    if (query && !matches.some((term) => `term-${term.id}` === id)) {
      navigate(`${location.pathname}${location.hash}`, { replace: true, preventScrollReset: true });
      return;
    }
    requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView({ block: 'start' }));
  }, [location.hash, location.pathname, matches, navigate, query]);

  function changeQuery(value: string) {
    const search = value ? `?q=${encodeURIComponent(value)}` : '';
    navigate(`${location.pathname}${search}`, { replace: true, preventScrollReset: true });
  }

  return <main className="content page-content faq-page game-glossary-page no-print" id="game-glossary-top">
    <section className="page-heading faq-page__heading">
      <div>
        <p className="eyebrow">{t('eyebrowGlossary')}</p>
        <h1>{t('titleGlossary')}</h1>
        <p className="muted">{t('descriptionGlossary')}</p>
      </div>
      <a className="faq-page__pdf-button" href={CORE_RULES_PDF} target="_blank" rel="noreferrer">
        {t('originalPdf')} <span aria-hidden="true">↗</span>
      </a>
    </section>

    <div className="glossary-search">
      <label htmlFor="game-term-search">{t('searchLabel')}</label>
      <div className="glossary-search__field">
        <input
          id="game-term-search"
          type="search"
          value={query}
          onChange={(event) => changeQuery(event.target.value)}
          placeholder={t('searchPlaceholder')}
          autoComplete="off"
        />
        {query && <button type="button" onClick={() => changeQuery('')}>{t('clearSearch')}</button>}
      </div>
      <div className="glossary-search__meta">
        <p className="glossary-search__count" aria-live="polite">{t('resultsCount', { count: matches.length })}</p>
        <p className="glossary-search__hint">{t('searchHint')}</p>
      </div>
    </div>

    {matches.length === 0
      ? <p className="glossary-empty" role="status">{t('noResults')}</p>
      : <div className="game-terms-list">
        {matches.map((term) => {
          const phases = term.phaseIds?.map((id) => sectionsById.get(id)).filter((section) => section !== undefined) ?? [];
          const related = term.relatedIds?.map((id) => termsById.get(id)).filter((item) => item !== undefined) ?? [];
          const faqs = (GAME_TERM_FAQ_LINKS[term.id] ?? []).flatMap((link) => {
            const item = faqSectionsById.get(link.sectionId)?.items[link.itemIndex];
            return item ? [{ ...link, item }] : [];
          });
          return <article className={`game-term${location.hash === `#term-${term.id}` ? ' game-term--selected' : ''}`} id={`term-${term.id}`} key={term.id} aria-labelledby={`term-heading-${term.id}`}>
            <div className="game-term__eyebrow">
              <span className="game-term__category">{categoryLabels[term.category]?.[locale] ?? term.category}</span>
              {faqs.length > 0 && <span className="game-term__faq-count">FAQ · {faqs.length}</span>}
            </div>
            <div className="game-term__heading">
              <h2 id={`term-heading-${term.id}`}>{term.name[locale]}</h2>
              {locale === 'es' && term.name.es !== term.name.en && <span className="game-term__english" lang="en">{term.name.en}</span>}
            </div>
            <div className="game-term__rule">
              <h3>{t('fullRule')}</h3>
              <ul>{term.details[locale].map((point, index) => <li key={index}>{point}</li>)}</ul>
            </div>
            {faqs.length > 0 && <div className="game-term__faqs">
              <h3>{t('faqClarifications')}</h3>
              {faqs.map((faq) => <details key={`${faq.sectionId}-${faq.itemIndex}`}>
                <summary>{faq.item.question[locale]}</summary>
                <p>{faq.item.answer[locale]}</p>
                <div className="game-term__faq-links">
                  <Link to={`${localizedPath('faqs', locale)}#faq-${faq.sectionId}-${faq.itemIndex}`}>{t('viewInFaq')}</Link>
                  <a href={`${FAQ_PDF}#page=${faq.pdfPage}`} target="_blank" rel="noreferrer">FAQ PDF · p. {faq.pdfPage} ↗</a>
                </div>
              </details>)}
            </div>}
            {(phases.length > 0 || related.length > 0) && <div className="game-term__relations">
              {phases.length > 0 && <div className="rules-related">
                <span>{t('relatedPhases')}</span>
                {phases.map((phase) => <Link key={phase.id} to={`${localizedPath('basic-rules', locale)}#rule-${phase.id}`}>
                  {phase.title[locale]}
                </Link>)}
              </div>}
              {related.length > 0 && <div className="rules-related">
                <span>{t('relatedTerms')}</span>
                {related.map((item) => <Link key={item.id} to={`#term-${item.id}`}>
                  {item.name[locale]}
                </Link>)}
              </div>}
            </div>}
            <div className="game-term__sources">
              <a className="rules-source" href={`${CORE_RULES_PDF}#page=${term.source.printedPage + 2}`} target="_blank" rel="noreferrer">
                {t('sourceLabel')}: {term.source.section} · {term.source.printedEndPage ? 'pp.' : 'p.'} {term.source.printedPage}{term.source.printedEndPage ? `–${term.source.printedEndPage}` : ''}
              </a>
              {term.source.faqPage && faqs.length === 0 && <a className="rules-source" href={`${FAQ_PDF}#page=${term.source.faqPage}`} target="_blank" rel="noreferrer">
                FAQ · p. {term.source.faqPage}
              </a>}
            </div>
          </article>;
        })}
      </div>}
    <a className="rules-back" href="#game-glossary-top">↑ {t('backToTop')}</a>
  </main>;
}
