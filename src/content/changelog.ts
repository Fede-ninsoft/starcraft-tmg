import type { SupportedLocale } from '@/i18n/types';

type LocalizedText = Record<SupportedLocale, string>;

export interface ChangelogEntry {
  version: string;
  date: string;
  title: LocalizedText;
  changes: LocalizedText[];
}

/**
 * Historial visible para quienes usan la aplicación.
 *
 * La primera entrada debe coincidir siempre con la versión de package.json.
 * El contenido evita detalles internos y explica únicamente cambios que una
 * persona puede ver o utilizar.
 */
export const CHANGELOG_ENTRIES: readonly ChangelogEntry[] = [
  {
    version: '2.11',
    date: '2026-09-25',
    title: { es: 'Reglas básicas y términos del juego', en: 'Basic rules and game terms' },
    changes: [
      { es: 'Nueva guía de reglas organizada por preparación, conceptos de la ronda y las cuatro fases del juego, con enlaces al reglamento y aclaraciones de la FAQ.', en: 'A new rules guide covers setup, round essentials and all four game phases, with rulebook links and FAQ clarifications.' },
      { es: 'Glosario bilingüe de términos del juego con buscador y enlaces entre conceptos y fases.', en: 'A bilingual game glossary adds search and links between terms and game phases.' },
    ],
  },
  {
    version: '2.10',
    date: '2026-09-25',
    title: { es: 'Cartas ampliables', en: 'Enlargeable cards' },
    changes: [
      { es: 'Pulsa una imagen en la previsualización para ampliarla y leer la carta con más comodidad. Vuelve a pulsarla o usa Escape para regresar.', en: 'Select an image in the preview to enlarge it and read the card more easily. Select it again or press Escape to return.' },
    ],
  },
  {
    version: '2.09',
    date: '2026-09-25',
    title: { es: 'Previsualizaciones de cartas actualizadas', en: 'Updated card previews' },
    changes: [
      { es: 'Las previsualizaciones muestran las imágenes actualizadas de las cartas W2 aunque el navegador hubiera guardado una copia anterior.', en: 'Card previews show the updated W2 images even if the browser had saved an older copy.' },
    ],
  },
  {
    version: '2.08',
    date: '2026-09-25',
    title: { es: 'Cartas W2 y restricciones de facción revisadas', en: 'W2 cards and faction restrictions reviewed' },
    changes: [
      { es: 'Revisadas las cartas de la segunda oleada de Protoss, Terran y Zerg: corregidas habilidades de Zeratul, Nerazim Watchers, Siege Tank y Ravager, y actualizadas sus imágenes originales.', en: 'Reviewed the second wave of Protoss, Terran and Zerg cards: corrected abilities for Zeratul, Nerazim Watchers, Siege Tank and Ravager, and updated their original card images.' },
      { es: 'Confirmados el coste de 45 de gas de Twilight Council y las restricciones de facción de las cartas y unidades del aviso del 22 de septiembre.', en: 'Confirmed Twilight Council’s 45 gas cost and the faction restrictions for the cards and units in the September 22 notice.' },
      { es: 'Al cambiar de facción, una Creep Card exclusiva se retira si deja de ser válida. Las listas importadas con una Creep Card de otra facción muestran ahora un error.', en: 'When changing faction, an exclusive Creep Card is removed if it is no longer valid. Imported rosters with a Creep Card from another faction now show an error.' },
    ],
  },
  {
    version: '2.07',
    date: '2026-09-24',
    title: { es: 'Torneos y listas más claros', en: 'Clearer tournaments and lists' },
    changes: [
      { es: 'Los torneos se muestran como activos o pasados. Los que siguen publicados o en curso se finalizan automáticamente 48 horas después de su fecha de fin.', en: 'Tournaments are grouped as active or past. Published and in-progress events finish automatically 48 hours after their end date.' },
      { es: 'La portada muestra los ocho torneos públicos activos con las fechas más próximas y permite verlos todos.', en: 'The home page shows the eight nearest active public tournaments and links to the full list.' },
      { es: 'Las tarjetas de torneos mantienen tres columnas en ordenador, aunque haya pocos eventos.', en: 'Tournament cards keep three columns on desktop, even when only a few events are available.' },
      { es: 'Las listas públicas acortan los nombres de usuario largos; las listas propias dejan de mostrar la columna de creador.', en: 'Public lists shorten long user names, while your own lists no longer show a creator column.' },
      { es: 'Los botones para crear una lista por facción son más compactos.', en: 'The faction buttons for creating a list are more compact.' },
    ],
  },
  {
    version: '2.06',
    date: '2026-09-21',
    title: { es: 'Nuevas cartas y mejoras de navegación', en: 'New cards and navigation improvements' },
    changes: [
      { es: 'Añadidos Ravager, Siege Tank, Immortal y Nerazim Watchers, con sus perfiles, costes e imágenes originales disponibles.', en: 'Added Ravager, Siege Tank, Immortal and Nerazim Watchers with profiles, costs and available original card images.' },
      { es: 'Nuevas cartas Nerazim, Cocoon, Robotics Facility, Void Seeker y Factory (Tech Lab).', en: 'New Nerazim, Cocoon, Robotics Facility, Void Seeker and Factory (Tech Lab) cards.' },
      { es: 'Añadida la misión Artefact Hunt para Estándar y Escaramuza, junto con los nuevos despliegues Meeting Engagement y Green Valleys.', en: 'Added the Artefact Hunt mission for Standard and Skirmish, along with the new Meeting Engagement and Green Valleys deployments.' },
      { es: 'La sesión dura dos días y se conserva al cerrar y volver a abrir el navegador.', en: 'Sessions last two days and persist when closing and reopening the browser.' },
      { es: 'Menú móvil con desplegables sin resaltados incorrectos, una sola flecha y submenús en mayúsculas.', en: 'Mobile dropdowns no longer show incorrect highlights and use a single arrow with uppercase submenu labels.' },
      { es: 'Menú móvil con iconos para todas las secciones y sus submenús, adaptados a Zerg, Terran y Protoss.', en: 'The mobile menu now has icons for every section and submenu, styled for Zerg, Terran and Protoss.' },
      { es: 'Las páginas de acceso comparten el mismo menú de navegación que el resto de la aplicación.', en: 'Sign-in pages now share the same navigation menu as the rest of the app.' },
      { es: 'Ver, clonar y dar me gusta a las listas públicas desde una sola fila de iconos.', en: 'View, clone and like public lists from a single row of icons.' },
    ],
  },
  {
    version: '2.05',
    date: '2026-09-15',
    title: { es: 'Torneos más accesibles e iconos uniformes', en: 'More accessible tournaments and consistent icons' },
    changes: [
      { es: 'Acciones de torneo más visibles, con iconos y colores según su función, y formularios mejor espaciados.', en: 'More visible tournament actions with meaningful icons and colours, and better-spaced forms.' },
      { es: 'Los torneos en los que estás inscrito aparecen primero y se destacan con un borde dorado.', en: 'Tournaments you have joined appear first and are highlighted with a golden border.' },
      { es: 'Inscripción en una ventana compacta y botón para compartir el enlace del torneo.', en: 'Registration in a compact dialog and a button to share the tournament link.' },
      { es: 'Iconos de facción transparentes y de tamaño uniforme en toda la aplicación.', en: 'Transparent, consistently sized faction icons throughout the app.' },
      { es: 'Corregidas las imágenes de las cartas tácticas Hydralisk Den, Nexus y Warp Prism.', en: 'Corrected the images for the Hydralisk Den, Nexus and Warp Prism tactical cards.' },
    ],
  },
  {
    version: '2.04',
    date: '2026-09-13',
    title: { es: 'Mejoras del gestor de torneos', en: 'Tournament manager improvements' },
    changes: [
      { es: 'El visor de listas muestra recursos destacados, unidades y mejoras en tabla y cartas agrupadas por tipo.', en: 'The roster viewer highlights resources, shows units and upgrades in a table and groups cards by type.' },
      { es: 'Al guardar un torneo aparece una confirmación. Los errores se muestran en una ventana visible.', en: 'Saving a tournament shows a confirmation. Errors appear in a visible dialog.' },
      { es: 'Formulario simplificado y gestión de participantes en una ventana que no modifica el tamaño de las tablas.', en: 'Simplified forms and player management in a dialog that does not resize tables.' },
      { es: 'Las listas válidas se admiten aunque tengan guardada una versión de catálogo diferente.', en: 'Valid rosters are accepted even when saved with a different catalog version.' },
    ],
  },
  {
    version: '2.03',
    date: '2026-09-13',
    title: { es: 'Gestión de torneos', en: 'Tournament management' },
    changes: [
      { es: 'Crea torneos públicos o por invitación y consulta eventos futuros, en curso y pasados.', en: 'Create public or invitation-only tournaments and browse upcoming, current and past events.' },
      { es: 'Gestiona inscripciones, invitados sin cuenta, listas, emparejamientos y resultados desde el torneo.', en: 'Manage registrations, guests without accounts, rosters, pairings and results within the tournament.' },
      { es: 'Los comunitarios admiten jugar sin entregar listas. El organizador administra el evento sin tener que asignar árbitros.', en: 'Community tournaments allow play without submitted rosters. Organisers manage events without assigning judges.' },
      { es: 'Tablas compactas con iconos de facción, historial de cambios legible y avisos de error en ventanas visibles.', en: 'Compact tables with faction icons, readable change history and visible error dialogs.' },
    ],
  },
  {
    version: '2.02',
    date: '2026-09-12',
    title: { es: 'Reglas de torneo', en: 'Tournament rules' },
    changes: [
      {
        es: 'Nueva sección de juego organizado en español e inglés, con índice por temas y acceso al PDF oficial.',
        en: 'New organised play section in Spanish and English, with a topic index and access to the official PDF.',
      },
      {
        es: 'Una flecha fija permite volver al inicio desde cualquier punto de las reglas de torneo.',
        en: 'A fixed arrow lets you return to the top from anywhere in the tournament rules.',
      },
    ],
  },
  {
    version: '2.01',
    date: '2026-09-01',
    title: {
      es: 'FAQ oficial y consulta de cartas',
      en: 'Official FAQ and card previews',
    },
    changes: [
      {
        es: 'La nueva sección FAQ reúne en español las 68 aclaraciones oficiales e incluye acceso al PDF original en inglés.',
        en: 'The new FAQ section includes all 68 official clarifications and provides access to the original English PDF.',
      },
      {
        es: 'Las pantallas de selección incluyen una lupa para consultar la carta original en inglés.',
        en: 'Selection screens now include a magnifier to view the original English card.',
      },
      {
        es: 'Las unidades muestran el anverso y el reverso en el orden correcto, y las tácticas conservan debajo su detalle localizado.',
        en: 'Units show their front and back in the correct order, while tactical cards keep their localized detail below.',
      },
    ],
  },
  {
    version: '1.06',
    date: '2026-08-25',
    title: {
      es: 'Partidas y navegación más claras',
      en: 'Clearer games and navigation',
    },
    changes: [
      {
        es: 'Las partidas guardadas muestran de un vistazo los jugadores, las razas, el marcador, la misión y la ronda actual.',
        en: 'Saved games now show players, races, score, mission, and current round at a glance.',
      },
      {
        es: 'Las listas asociadas a una partida se pueden abrir directamente desde su tarjeta.',
        en: 'Lists linked to a game can now be opened directly from its card.',
      },
      {
        es: 'La navegación se ha renovado para que sea más clara en ordenador, portátil y móvil, también dentro de Mis partidas al iniciar sesión.',
        en: 'Navigation has been refreshed to be clearer on desktop, laptop, and mobile, including My games after signing in.',
      },
      {
        es: 'La sección de ayuda ahora se llama Contacto y el pie incluye este resumen de novedades.',
        en: 'The help section is now called Contact, and the footer includes this summary of what is new.',
      },
      {
        es: 'La configuración de una nueva partida presenta ahora la misión y los jugadores de forma más clara y cómoda en móvil.',
        en: 'New game setup now presents the mission and players more clearly, with a layout designed for mobile too.',
      },
      {
        es: 'Al crear una partida puedes consultar mapas de ejemplo adaptados al formato Estándar o Escaramuza y ampliarlos para preparar la mesa.',
        en: 'When creating a game, you can browse example maps for Standard or Skirmish and enlarge them while setting up the table.',
      },
    ],
  },
  {
    version: '1.04',
    date: '2026-08-23',
    title: {
      es: 'Creación de listas más flexible',
      en: 'More flexible list building',
    },
    changes: [
      {
        es: 'Puedes reclutar unidades aunque todavía te falten espacios y completar después las cartas tácticas necesarias.',
        en: 'You can recruit units before all required slots are available and add the needed tactical cards afterwards.',
      },
      {
        es: 'Al revisar una lista, un resumen reúne los problemas pendientes y explica cómo resolverlos.',
        en: 'When reviewing a list, a summary gathers outstanding issues and explains how to resolve them.',
      },
    ],
  },
  {
    version: '1.03',
    date: '2026-08-23',
    title: {
      es: 'Listas listas para compartir',
      en: 'Lists ready to share',
    },
    changes: [
      {
        es: 'El texto copiado de una lista tiene un formato más claro para compartirlo por WhatsApp u otras aplicaciones.',
        en: 'Copied list text now has a clearer format for sharing through WhatsApp or other apps.',
      },
    ],
  },
];
