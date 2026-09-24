import type { Race } from '@/engine/types';

const ICON_THEME: Record<Race, string> = { ZERG: 'organico', TERRAN: 'industrial', PROTOSS: 'cristal' };
const ICON_SOURCES = import.meta.glob('../../assets/navigation/**/*.svg', { eager: true, query: '?raw', import: 'default' }) as Record<string, string>;

export function NavigationIcon({ race, icon }: { race: Race; icon: string }) {
  const sourcePath = `../../assets/navigation/${ICON_THEME[race]}/${icon}.svg`;
  const dataUri = `data:image/svg+xml,${encodeURIComponent(ICON_SOURCES[sourcePath] ?? '')}`;
  return <span className="primary-nav__icon" style={{ backgroundImage: `url("${dataUri}")` }} aria-hidden="true" />;
}
