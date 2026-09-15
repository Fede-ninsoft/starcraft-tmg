import { renderToStaticMarkup } from 'react-dom/server';
import sharp from 'sharp';
import { describe, expect, it } from 'vitest';
import { FactionIcon } from '@/ui/common/FactionIcon';

describe('iconos de facción uniformes', () => {
  it.each(['ZERG', 'TERRAN', 'PROTOSS'] as const)('%s usa un archivo transparente cuadrado y el marco compartido', async (race) => {
    const filename = `${race.toLowerCase()}-transparent.png`;
    const html = renderToStaticMarkup(<FactionIcon race={race} alt={race} />);
    expect(html).toContain(`faction-icon faction-icon--${race.toLowerCase()}`);
    expect(html).toContain(`/factions/${filename}`);
    expect(html).toContain(`alt="${race}"`);
    const asset = sharp(`public/factions/${filename}`);
    const metadata = await asset.metadata();
    expect(metadata.width).toBe(256);
    expect(metadata.height).toBe(256);
    expect(metadata.hasAlpha).toBe(true);
    const stats = await asset.stats();
    expect(stats.isOpaque).toBe(false);
    expect(stats.channels[3]?.min).toBe(0);
    expect(stats.channels[3]?.max).toBe(255);
  });
});
