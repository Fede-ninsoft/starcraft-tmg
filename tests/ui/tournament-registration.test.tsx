import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { TournamentRegistration } from '@/ui/tournaments/TournamentRegistration';
import { tournamentConfig } from '../tournament-fixture';

function render(overrides: Partial<Parameters<typeof TournamentRegistration>[0]> = {}) {
  return renderToStaticMarkup(<TournamentRegistration event={{ config: tournamentConfig, players: [] }} race="ZERG" onRaceChange={() => {}} onJoin={() => {}} invitation="" busy={false} text={(es) => es} {...overrides} />);
}

describe('inscripción destacada al torneo', () => {
  it('deja el botón visible y mantiene el formulario dentro de un modal cerrado', () => {
    const html = render();
    const [trigger, modal] = html.split('<dialog');
    expect(trigger).toContain('Inscribirme al torneo');
    expect(trigger).toContain('aria-haspopup="dialog"');
    expect(trigger).not.toContain('<form');
    expect(modal).toContain('<form');
    expect(modal).toContain('Cerrar inscripción');
    expect(modal?.split('>')[0]).not.toMatch(/\bopen(?:=|\s|$)/);
  });
  it('muestra las tres razas con una selección accesible y permite confirmar', () => {
    const html = render({ race: 'PROTOSS' });
    expect(html).toContain('Reserva tu plaza');
    expect(html.match(/type="radio"/g)).toHaveLength(3);
    expect(html).toMatch(/checked="" value="PROTOSS"/);
    expect(html).toContain('Inscribirme al torneo');
    expect(html).not.toMatch(/<button[^>]*disabled/);
  });
  it('requiere el enlace privado antes de permitir la inscripción', () => {
    const event = { config: { ...tournamentConfig, registrationMode: 'INVITE_ONLY' as const }, players: [] };
    expect(render({ event })).toMatch(/<button[^>]*disabled/);
    expect(render({ event })).toContain('Abre el enlace de invitación');
    expect(render({ event, invitation: 'invitation-token' })).not.toMatch(/<button[^>]*disabled/);
  });
  it('impide confirmar si no quedan plazas o hay una operación en curso', () => {
    const html = render({ event: { config: { ...tournamentConfig, capacity: 0 }, players: [] } });
    expect(html).toContain('Plazas agotadas');
    expect(html).toMatch(/<button[^>]*disabled/);
    expect(render({ busy: true })).toMatch(/<button[^>]*disabled/);
  });
});
