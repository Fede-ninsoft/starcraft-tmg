import { describe, expect, it } from 'vitest';
import { ORGANISED_PLAY_SECTIONS } from '@/content/organisedPlay';

describe('guía de juego organizado', () => {
  it('incluye todos los capítulos con identificadores únicos', () => {
    expect(ORGANISED_PLAY_SECTIONS).toHaveLength(17);
    expect(new Set(ORGANISED_PLAY_SECTIONS.map(({ id }) => id)).size).toBe(ORGANISED_PLAY_SECTIONS.length);
  });

  it('mantiene contenido bilingüe completo', () => {
    const localizedValues: Array<{ es: string; en: string }> = [];

    for (const section of ORGANISED_PLAY_SECTIONS) {
      localizedValues.push(section.title);
      for (const block of section.blocks) {
        if (block.kind === 'paragraph' || block.kind === 'subheading' || block.kind === 'callout') localizedValues.push(block.text);
        if (block.kind === 'list') localizedValues.push(...block.items);
        if (block.kind === 'table') {
          if (block.caption) localizedValues.push(block.caption);
          localizedValues.push(...block.headers, ...block.rows.flat());
          expect(block.rows.every((row) => row.length === block.headers.length)).toBe(true);
        }
      }
    }

    expect(localizedValues.length).toBeGreaterThan(150);
    for (const value of localizedValues) {
      expect(value.es.trim()).not.toBe('');
      expect(value.en.trim()).not.toBe('');
    }
  });
});
