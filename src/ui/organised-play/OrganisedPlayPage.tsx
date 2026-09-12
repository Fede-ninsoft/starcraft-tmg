import { useTranslation } from 'react-i18next';
import { ORGANISED_PLAY_SECTIONS, type OrganisedPlayBlock } from '@/content/organisedPlay';
import { routeLocale } from '@/i18n/routing';
import type { SupportedLocale } from '@/i18n/types';

const ORIGINAL_PDF = '/documents/StarCraft-TMG-Organised-Play_EN.pdf';

function RulesBlock({ block, locale }: { block: OrganisedPlayBlock; locale: SupportedLocale }) {
  if (block.kind === 'paragraph') return <p>{block.text[locale]}</p>;
  if (block.kind === 'subheading') return <h3>{block.text[locale]}</h3>;
  if (block.kind === 'callout') return <p className="organised-play__callout">{block.text[locale]}</p>;
  if (block.kind === 'list') {
    const Tag = block.ordered ? 'ol' : 'ul';
    return <Tag>{block.items.map((item, index) => <li key={index}>{item[locale]}</li>)}</Tag>;
  }

  return <div className="organised-play__table-scroll" tabIndex={0}>
    <table>
      {block.caption && <caption>{block.caption[locale]}</caption>}
      <thead><tr>{block.headers.map((header, index) => <th key={index} scope="col">{header[locale]}</th>)}</tr></thead>
      <tbody>{block.rows.map((row, rowIndex) => <tr key={rowIndex}>{row.map((cell, cellIndex) => cellIndex === 0
        ? <th key={cellIndex} scope="row">{cell[locale]}</th>
        : <td key={cellIndex}>{cell[locale]}</td>)}</tr>)}</tbody>
    </table>
  </div>;
}

export function OrganisedPlayPage() {
  const { t } = useTranslation('organisedPlay');
  const locale = routeLocale(window.location.pathname);

  return <main className="content page-content faq-page organised-play no-print">
    <section className="page-heading faq-page__heading">
      <div><p className="eyebrow">{t('eyebrow')}</p><h1>{t('title')}</h1><p className="muted">{t('description')}</p></div>
      <a className="faq-page__pdf-button" href={ORIGINAL_PDF} target="_blank" rel="noreferrer">{t('originalPdf')} <span aria-hidden="true">↗</span></a>
    </section>
    <p className="faq-page__source">{t('source')}</p>
    <p className="organised-play__translation-note">{t('translationNote')}</p>
    <nav className="faq-page__index" id="organised-play-index" aria-label={t('indexLabel')}>
      {ORGANISED_PLAY_SECTIONS.map((section) => <a key={section.id} href={`#organised-play-${section.id}`}>{section.title[locale]}</a>)}
    </nav>
    <div className="faq-page__sections">
      {ORGANISED_PLAY_SECTIONS.map((section) => <section className="faq-section organised-play__section" id={`organised-play-${section.id}`} key={section.id}>
        <h2>{section.title[locale]}</h2>
        <div className="organised-play__blocks">
          {section.blocks.map((block, index) => <RulesBlock block={block} locale={locale} key={`${section.id}-${index}`} />)}
        </div>
      </section>)}
    </div>
    <button className="organised-play__back" type="button" aria-label={locale === 'es' ? 'Volver arriba' : 'Back to top'} title={locale === 'es' ? 'Volver arriba' : 'Back to top'} onClick={() => window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' })}><span aria-hidden="true">↑</span></button>
  </main>;
}
