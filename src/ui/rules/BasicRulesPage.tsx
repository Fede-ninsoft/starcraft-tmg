import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';
import { BASIC_RULE_SECTIONS } from '@/content/basicRules';
import { GAME_TERMS } from '@/content/gameTerms';
import { localizedPath, routeLocale } from '@/i18n/routing';
import './rules.css';

const CORE_RULES_PDF = 'https://archon-studio.com/files/manuals/sc/StarCraft-TMG_EN.pdf';
const FAQ_PDF = '/documents/StarCraft-TMG-FAQ_EN.pdf';
const termById = new Map(GAME_TERMS.map((term) => [term.id, term]));

export function BasicRulesPage() {
  const { t } = useTranslation('rules');
  const location = useLocation();
  const locale = routeLocale(location.pathname);

  useEffect(() => {
    if (!location.hash.startsWith('#rule-')) return;
    const id = decodeURIComponent(location.hash.slice(1));
    requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView({ block: 'start' }));
  }, [location.hash]);

  return <main className="content page-content faq-page basic-rules-page no-print" id="basic-rules-top">
    <section className="page-heading faq-page__heading">
      <div>
        <p className="eyebrow">{t('eyebrowBasic')}</p>
        <h1>{t('titleBasic')}</h1>
        <p className="muted">{t('descriptionBasic')}</p>
      </div>
      <a className="faq-page__pdf-button" href={CORE_RULES_PDF} target="_blank" rel="noreferrer">
        {t('originalPdf')} <span aria-hidden="true">↗</span>
      </a>
    </section>

    <nav className="faq-page__index rules-index" aria-label={t('phaseIndex')}>
      {BASIC_RULE_SECTIONS.map((section) =>
        <a key={section.id} href={`#rule-${section.id}`}>{section.title[locale]}</a>,
      )}
    </nav>

    <div className="faq-page__sections">
      {BASIC_RULE_SECTIONS.map((section, index) => <section
        className="faq-section basic-rules-section"
        id={`rule-${section.id}`}
        key={section.id}
        aria-labelledby={`rule-heading-${section.id}`}
      >
        {index >= 2 && <p className="basic-rules-section__number">{t('phaseNumber', { number: index - 1 })}</p>}
        <h2 id={`rule-heading-${section.id}`}>{section.title[locale]}</h2>
        <p className="basic-rules-section__intro">{section.intro[locale]}</p>
        <ol className="basic-rules-section__steps">
          {section.steps.map((step) => {
            const related = step.termIds?.map((id) => termById.get(id)).filter((term) => term !== undefined) ?? [];
            const sourcePdf = step.source.document === 'faq'
              ? `${FAQ_PDF}#page=${step.source.printedPage}`
              : `${CORE_RULES_PDF}#page=${step.source.printedPage + 2}`;
            return <li id={`rule-${section.id}-${step.id}`} key={step.id}>
              <h3>{step.title[locale]}</h3>
              <p>{step.text[locale]}</p>
              {related.length > 0 && <div className="rules-related">
                <span>{t('relatedTerms')}</span>
                {related.map((term) => <Link key={term.id} to={`${localizedPath('glossary', locale)}#term-${term.id}`}>
                  {term.name[locale]}
                </Link>)}
              </div>}
              <a className="rules-source" href={sourcePdf} target="_blank" rel="noreferrer">
                {t('sourceLabel')}: {step.source.section} · p. {step.source.printedPage}
              </a>
            </li>;
          })}
        </ol>
      </section>)}
    </div>
    <a className="rules-back" href="#basic-rules-top">↑ {t('backToTop')}</a>
  </main>;
}
