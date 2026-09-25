import { describe, expect, it } from 'vitest';
import { BASIC_RULE_SECTIONS } from '@/content/basicRules';
import { GAME_TERMS } from '@/content/gameTerms';
import { normalizeTermSearch, searchGameTerms } from '@/ui/rules/searchGameTerms';

describe('contenido de reglas', () => {
  it('mantiene secciones, términos y referencias cruzadas válidos', () => {
    expect(BASIC_RULE_SECTIONS.map((section) => section.id)).toEqual([
      'before-play', 'core-concepts', 'movement', 'assault', 'combat', 'scoring-cleanup',
    ]);

    const phaseIds = new Set(BASIC_RULE_SECTIONS.map((section) => section.id));
    const termIds = new Set(GAME_TERMS.map((term) => term.id));
    expect(termIds.size).toBe(GAME_TERMS.length);
    expect(GAME_TERMS.length).toBeGreaterThanOrEqual(70);

    for (const section of BASIC_RULE_SECTIONS) {
      expect(section.title.es && section.title.en && section.intro.es && section.intro.en).toBeTruthy();
      expect(section.steps.length).toBeGreaterThan(0);
      expect(new Set(section.steps.map((step) => step.id)).size).toBe(section.steps.length);
      for (const step of section.steps) {
        expect(step.title.es && step.title.en && step.text.es && step.text.en).toBeTruthy();
        expect(step.source.section).not.toBe('');
        expect(step.source.printedPage).toBeGreaterThan(0);
        for (const id of step.termIds ?? []) expect(termIds.has(id)).toBe(true);
      }
    }

    for (const term of GAME_TERMS) {
      expect(term.name.es && term.name.en && term.summary.es && term.summary.en).toBeTruthy();
      expect(term.source.section).not.toBe('');
      expect(term.source.printedPage).toBeGreaterThan(0);
      for (const id of term.phaseIds ?? []) expect(phaseIds.has(id)).toBe(true);
      for (const id of term.relatedIds ?? []) expect(termIds.has(id)).toBe(true);
    }
  });
});

describe('búsqueda de términos', () => {
  it('encuentra nombres sin acentos y palabras en cualquier idioma', () => {
    expect(normalizeTermSearch('  Acción Táctica ')).toBe('accion tactica');
    const sample = GAME_TERMS.slice(0, 3);
    expect(sample.length).toBe(3);
    for (const term of sample) {
      expect(searchGameTerms(GAME_TERMS, term.name.en, 'es').map((result) => result.id)).toContain(term.id);
      expect(searchGameTerms(GAME_TERMS, term.name.es, 'en').map((result) => result.id)).toContain(term.id);
    }
  });

  it('exige todas las palabras y devuelve la lista completa para una búsqueda vacía', () => {
    expect(searchGameTerms(GAME_TERMS, '', 'es')).toHaveLength(GAME_TERMS.length);
    expect(searchGameTerms(GAME_TERMS, 'palabra inexistente zzzzz', 'es')).toEqual([]);
    const first = GAME_TERMS[0]!;
    expect(searchGameTerms(GAME_TERMS, first.name.en, 'en')[0]?.id).toBe(first.id);
  });
});
