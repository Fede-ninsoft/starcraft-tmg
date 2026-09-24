import { describe, expect, it, vi } from 'vitest';
import {
  ANALYTICS_CONSENT_STORAGE_KEY,
  analyticsAvailable,
  analyticsPageLocation,
  getAnalyticsMeasurementId,
  loadGoogleAnalytics,
  readAnalyticsConsent,
  storeAnalyticsConsent,
} from '@/analytics/analytics';

describe('Google Analytics', () => {
  it('usa un ID de medición GA4 válido y no se activa en tests/desarrollo', () => {
    expect(getAnalyticsMeasurementId()).toMatch(/^G-[A-Z0-9]+$/i);
    expect(analyticsAvailable()).toBe(false);
  });

  it('elimina query string y hash de la ubicación enviada', () => {
    expect(analyticsPageLocation({
      origin: 'https://www.starcraft-builder.com',
      pathname: '/es/verificar-correo',
    })).toBe('https://www.starcraft-builder.com/es/verificar-correo');
  });

  it('persiste sólo decisiones de consentimiento válidas', () => {
    const values = new Map<string, string>();
    const storage = {
      getItem: (key: string) => values.get(key) ?? null,
      setItem: (key: string, value: string) => { values.set(key, value); },
    };

    expect(readAnalyticsConsent(storage)).toBeNull();
    storeAnalyticsConsent(storage, 'granted');
    expect(values.get(ANALYTICS_CONSENT_STORAGE_KEY)).toBe('granted');
    expect(readAnalyticsConsent(storage)).toBe('granted');
    values.set(ANALYTICS_CONSENT_STORAGE_KEY, 'unexpected');
    expect(readAnalyticsConsent(storage)).toBeNull();
  });

  it('encola los comandos gtag en el formato Arguments que procesa Google', () => {
    vi.stubEnv('MODE', 'production');
    const dataLayer: unknown[] = [];
    const appendedScripts: Array<{ id: string; async: boolean; src: string }> = [];
    vi.stubGlobal('window', {
      location: { origin: 'https://www.starcraft-builder.com', pathname: '/es/inicio' },
      dataLayer,
    });
    vi.stubGlobal('document', {
      title: 'Inicio',
      getElementById: () => null,
      createElement: () => ({ id: '', async: false, src: '' }),
      head: { appendChild: (script: { id: string; async: boolean; src: string }) => { appendedScripts.push(script); } },
    });

    try {
      expect(loadGoogleAnalytics()).toBe(true);
      expect(dataLayer).toHaveLength(2);
      expect(Object.prototype.toString.call(dataLayer[0])).toBe('[object Arguments]');
      expect(Object.prototype.toString.call(dataLayer[1])).toBe('[object Arguments]');
      expect((dataLayer[0] as IArguments)[0]).toBe('js');
      expect((dataLayer[1] as IArguments)[0]).toBe('config');
      expect((dataLayer[1] as IArguments)[1]).toBe('G-F7DMMN328B');
      expect(appendedScripts[0]?.src).toBe('https://www.googletagmanager.com/gtag/js?id=G-F7DMMN328B');
    } finally {
      vi.unstubAllGlobals();
      vi.unstubAllEnvs();
    }
  });
});
