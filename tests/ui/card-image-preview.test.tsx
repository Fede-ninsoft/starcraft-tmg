import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import '@/i18n/config';
import { CardImageModal, CardPreviewButton } from '@/ui/common/CardImagePreview';
import { StepMusterUnits } from '@/ui/builder/StepMusterUnits';
import { useListStore } from '@/store/listStore';

vi.mock('@/store/listStore', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/store/listStore')>();
  const useStore = actual.useListStore;
  return { ...actual, useListStore: Object.assign(
    (selector?: (state: ReturnType<typeof useStore.getState>) => unknown) => selector ? selector(useStore.getState()) : useStore.getState(),
    useStore,
  ) };
});

describe('visor de carta original', () => {
  it('ofrece la lupa de Watchers aunque solo exista el anverso', () => {
    useListStore.getState().resetForRace('PROTOSS');
    useListStore.getState().selectFactionCard('protoss.faction.nerazim');
    const html = renderToStaticMarkup(<StepMusterUnits />);
    expect(html).toContain('aria-label="Ver carta original de Nerazim Watchers (Adept)"');
    useListStore.getState().resetForRace('ZERG');
  });

  it('renderiza una lupa accesible como botón independiente', () => {
    const html = renderToStaticMarkup(
      <CardPreviewButton cardName="Zergling" onOpen={() => undefined} />,
    );
    expect(html).toContain('type="button"');
    expect(html).toContain('aria-haspopup="dialog"');
    expect(html).toContain('aria-label="Ver carta original de Zergling"');
    expect(html).toContain('<svg');
  });

  it('conserva el orden anverso → reverso y deja el contenido localizado debajo', () => {
    const html = renderToStaticMarkup(
      <CardImageModal
        title="Zergling"
        images={[
          { src: 'cards/zerg/unit-zergling-front.webp', alt: 'Anverso de Zergling' },
          { src: 'cards/zerg/unit-zergling-back.webp', alt: 'Reverso de Zergling' },
        ]}
        onClose={() => undefined}
      >
        <p>Descripción localizada</p>
      </CardImageModal>,
    );
    expect(html).toContain('role="dialog"');
    expect(html).toContain('aria-modal="true"');
    expect(html).toContain(`/cards/zerg/unit-zergling-front.webp?build=${__APP_BUILD_ID__}`);
    expect(html).toContain(`/cards/zerg/unit-zergling-back.webp?build=${__APP_BUILD_ID__}`);
    expect(html.indexOf('unit-zergling-front.webp')).toBeLessThan(
      html.indexOf('unit-zergling-back.webp'),
    );
    expect(html.indexOf('unit-zergling-back.webp')).toBeLessThan(
      html.indexOf('Descripción localizada'),
    );
  });
});
