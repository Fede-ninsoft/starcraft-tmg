import type { Response } from 'express';
import jwt from 'jsonwebtoken';
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { ServerEnvironment } from '../../server/src/config/env';
import { issueSession, readSession, SESSION_COOKIE } from '../../server/src/modules/auth/session';

const env: ServerEnvironment = {
  PORT: 3001,
  APP_ORIGIN: 'https://example.test',
  APP_BASE_URL: 'https://example.test',
  DATABASE_URL: 'mysql://unused',
  SESSION_SECRET: 'test-session-secret-with-at-least-32-characters',
  NODE_ENV: 'production',
};

afterEach(() => vi.useRealTimers());

describe('sesión persistente de catorce días', () => {
  it('mantiene la cookie y el token válidos durante dos semanas y expira en ese límite', () => {
    vi.useFakeTimers();
    const start = new Date('2026-09-21T12:00:00Z');
    vi.setSystemTime(start);
    const cookie = vi.fn();
    issueSession({ cookie } as unknown as Response, 'user-123', 7, env);
    const [name, token, options] = cookie.mock.calls[0]!;

    expect(name).toBe(SESSION_COOKIE);
    expect(options).toEqual({
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: 1_209_600_000,
      path: '/api',
    });
    const payload = jwt.decode(token) as jwt.JwtPayload;
    expect(payload.exp! - payload.iat!).toBe(1_209_600);

    // El navegador vuelve a enviar la cookie persistente al abrirse al día siguiente.
    vi.setSystemTime(start.getTime() + 24 * 60 * 60 * 1000);
    expect(readSession(token, env)).toEqual({ sub: 'user-123', sv: 7 });
    vi.setSystemTime(start.getTime() + 1_209_600_000 - 1000);
    expect(readSession(token, env)).toEqual({ sub: 'user-123', sv: 7 });
    vi.setSystemTime(start.getTime() + 1_209_600_000);
    expect(readSession(token, env)).toBeNull();
  });
});
