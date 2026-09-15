import type { Localized as LocalizedText } from '@/engine/types';

export type OrganisedPlayBlock =
  | { kind: 'paragraph'; text: LocalizedText }
  | { kind: 'subheading'; text: LocalizedText }
  | { kind: 'callout'; text: LocalizedText }
  | { kind: 'list'; items: readonly LocalizedText[]; ordered?: boolean }
  | { kind: 'table'; caption?: LocalizedText; headers: readonly LocalizedText[]; rows: readonly (readonly LocalizedText[])[] };

export interface OrganisedPlaySection {
  id: string;
  title: LocalizedText;
  blocks: readonly OrganisedPlayBlock[];
}

const text = (en: string, es: string): LocalizedText => ({ en, es });
const p = (en: string, es: string): OrganisedPlayBlock => ({ kind: 'paragraph', text: text(en, es) });
const h = (en: string, es: string): OrganisedPlayBlock => ({ kind: 'subheading', text: text(en, es) });
const callout = (en: string, es: string): OrganisedPlayBlock => ({ kind: 'callout', text: text(en, es) });
const list = (items: readonly [string, string][], ordered = false): OrganisedPlayBlock => ({
  kind: 'list',
  items: items.map(([en, es]) => text(en, es)),
  ordered,
});
const table = (
  caption: [string, string] | null,
  headers: readonly [string, string][],
  rows: readonly (readonly [string, string][])[],
): OrganisedPlayBlock => ({
  kind: 'table',
  caption: caption ? text(...caption) : undefined,
  headers: headers.map(([en, es]) => text(en, es)),
  rows: rows.map((row) => row.map(([en, es]) => text(en, es))),
});

export const ORGANISED_PLAY_SECTIONS: readonly OrganisedPlaySection[] = [
  {
    id: 'about',
    title: text('About this pack', 'Acerca de esta guía'),
    blocks: [
      p('This guide explains how to run a StarCraft: TMG event, from eight friends in a game shop to a hundred-player weekend. It covers the decisions to make before announcing the event, how to run the day, and how to score it afterwards.', 'Esta guía explica cómo organizar un evento de StarCraft: TMG, desde ocho amigos en una tienda hasta un fin de semana con cien participantes. Cubre las decisiones previas al anuncio, el desarrollo del evento y su puntuación final.'),
      p('Community and Competitive events have different needs. The guide marks where their requirements differ. Organisers may adapt it to their event, but every change must be published before registration closes.', 'Los eventos comunitarios y competitivos tienen necesidades distintas. La guía indica dónde cambian sus requisitos. Los organizadores pueden adaptarla, pero deben publicar cualquier modificación antes de que cierre la inscripción.'),
      callout('Official Archon Studio tournaments use this document as written.', 'Los torneos oficiales de Archon Studio aplican este documento tal como está escrito.'),
    ],
  },
  {
    id: 'roles-requirements',
    title: text('Roles and requirements', 'Roles y requisitos'),
    blocks: [
      h('The Tournament Organiser', 'El organizador del torneo'),
      p('The Tournament Organiser (TO) makes the event happen and decides every matter the rules leave open. Those decisions must be published before registration closes.', 'El organizador del torneo (TO) hace posible el evento y decide sobre toda cuestión que las reglas dejen abierta. Esas decisiones deben publicarse antes de que cierre la inscripción.'),
      list([
        ['Provide the venue, tables and terrain.', 'Proporcionar el local, las mesas y el terreno.'],
        ['Publish the format, round count, rules cut-off, roster deadline, layouts, software platform and conduct contact.', 'Publicar el formato, número de rondas, fecha límite de reglas, plazo de listas, mapas, plataforma y contacto para conducta.'],
        ['Collect, check and publish rosters.', 'Recoger, comprobar y publicar las listas.'],
        ['Manage pairings, results and final standings.', 'Gestionar emparejamientos, resultados y clasificación final.'],
        ['Run the round clock and milestone calls.', 'Controlar el reloj de ronda y los avisos de tiempo.'],
        ['Manage prizes and support the Head Judge.', 'Gestionar los premios y respaldar al árbitro principal.'],
      ]),
      table(['Can the Tournament Organiser play?', '¿Puede jugar el organizador?'], [
        ['Requirement', 'Requisito'], ['Community Event', 'Evento comunitario'], ['Competitive Event', 'Evento competitivo'],
      ], [
        [['TO competes?', '¿Compite el TO?'], ['Yes', 'Sí'], ['No', 'No']],
        [['Best practice', 'Práctica recomendada'], ['Give the Head Judge final authority over penalties', 'Ceder al árbitro principal la decisión final sobre sanciones'], ['Remain non-playing for the whole event', 'No jugar durante todo el evento']],
      ]),
      p('At a Community event the TO may play, but authority over event-long penalties passes to the Head Judge for the entire event.', 'En un evento comunitario el TO puede jugar, pero la autoridad sobre sanciones que afecten al evento completo pasa al árbitro principal durante todo el evento.'),
      h('The Head Judge', 'El árbitro principal'),
      p('The Head Judge answers questions and settles disputes once play begins. Their table rulings are final for the event; only penalties that last for the rest of the event are settled together with the TO.', 'El árbitro principal responde preguntas y resuelve disputas una vez iniciado el juego. Sus decisiones de mesa son definitivas durante el evento; únicamente las sanciones que duren el resto del evento se acuerdan con el TO.'),
      list([
        ['Resolve major rules disagreements.', 'Resolver desacuerdos importantes sobre reglas.'],
        ['Handle slow play, clock disputes and other timing issues.', 'Gestionar juego lento, disputas de reloj y otros problemas de tiempo.'],
        ['Complete a draft that has overrun.', 'Completar un draft que haya excedido el tiempo.'],
        ['Apply penalties for illegal rosters and conduct breaches.', 'Aplicar sanciones por listas ilegales e infracciones de conducta.'],
      ]),
      table(['Can the Head Judge play?', '¿Puede jugar el árbitro principal?'], [
        ['Requirement', 'Requisito'], ['Community Event', 'Evento comunitario'], ['Competitive Event', 'Evento competitivo'],
      ], [
        [['Head Judge competes?', '¿Compite el árbitro principal?'], ['Yes', 'Sí'], ['No', 'No']],
        [['Best practice', 'Práctica recomendada'], ['Join pairings when attendance is odd', 'Entrar en los emparejamientos cuando haya un número impar'], ['Remain non-playing for the whole event', 'No jugar durante todo el evento']],
      ]),
      p('A playing Head Judge is a spare player: they are not classified, cannot win placings or prizes, and neither their results nor the results against them enter Strength of Schedule or opponents\' Tournament Points.', 'Un árbitro principal que juegue actúa como suplente: no entra en la clasificación ni puede obtener puestos o premios, y sus resultados no cuentan para la Fuerza del Calendario ni para los Puntos de Torneo de los Oponentes.'),
      h('Floor Judges', 'Árbitros de mesa'),
      p('Floor Judges resolve ordinary rules, terrain, Mission Marker, range and Line of Sight questions, and help submit results. Their ruling applies immediately. A player may appeal to the Head Judge before play continues.', 'Los árbitros de mesa resuelven cuestiones ordinarias de reglas, terreno, Marcadores de Misión, alcance y Línea de Visión, y ayudan a enviar resultados. Su decisión se aplica de inmediato. Un jugador puede apelar al árbitro principal antes de continuar.'),
      h('What players need to bring', 'Qué deben llevar los jugadores'),
      list([
        ['Their army and official StarCraft: TMG models.', 'Su ejército y miniaturas oficiales de StarCraft: TMG.'],
        ['Dice and a measuring tool.', 'Dados y una herramienta de medición.'],
        ['Their latest cards, including the draft cards for every submitted roster.', 'Sus cartas más recientes, incluidas las cartas de draft de cada lista presentada.'],
        ['A copy of each roster to show opponents; a printed copy is recommended.', 'Una copia de cada lista para mostrar al oponente; se recomienda llevarla impresa.'],
      ]),
      h('Models and WYSIWYG', 'Miniaturas y WYSIWYG'),
      p('Only official models are permitted. Third-party sculpts, recasts and substitutes are not. Bases may be modelled but must retain the correct size and shape. Painting is not required.', 'Solo se permiten miniaturas oficiales. No se admiten esculturas de terceros, recasts ni sustitutos. Las peanas pueden decorarse, pero deben conservar su tamaño y forma correctos. No es obligatorio pintar.'),
      table(null, [
        ['Requirement', 'Requisito'], ['Community Event', 'Evento comunitario'], ['Competitive Event', 'Evento competitivo'],
      ], [
        [['WYSIWYG', 'WYSIWYG'], ['TO decision', 'Decisión del TO'], ['Required for Specialist models', 'Obligatorio para miniaturas Especialistas']],
        [['Everything else', 'Todo lo demás'], ['TO decision', 'Decisión del TO'], ['Clearly identified before the game', 'Identificado claramente antes de la partida']],
      ]),
    ],
  },
  {
    id: 'event-size-format',
    title: text('Event size and format', 'Tamaño y formato del evento'),
    blocks: [
      table(null, [
        ['Feature', 'Característica'], ['Community Event', 'Evento comunitario'], ['Competitive Event', 'Evento competitivo'],
      ], [
        [['Purpose', 'Objetivo'], ['Bring players together and welcome newcomers', 'Reunir jugadores y recibir a principiantes'], ['Play competitively against similarly focused opponents', 'Competir al máximo nivel contra rivales con el mismo objetivo']],
        [['Engagement Scale', 'Escala de enfrentamiento'], ['Skirmish or Standard', 'Skirmish o Standard'], ['Standard', 'Standard']],
        [['Length', 'Duración'], ['One day', 'Un día'], ['One or two days', 'Uno o dos días']],
        [['These rules', 'Estas reglas'], ['Adapt freely', 'Pueden adaptarse'], ['Follow as written', 'Aplicarlas tal como están escritas']],
      ]),
      h('Community events', 'Eventos comunitarios'),
      p('Skirmish produces shorter games and is more welcoming to new players. Standard is the full game and prepares players for the Competitive format.', 'Skirmish ofrece partidas más cortas y resulta más accesible para principiantes. Standard es el juego completo y prepara para el formato competitivo.'),
      table(['Recommended Community rounds', 'Rondas comunitarias recomendadas'], [
        ['Players', 'Jugadores'], ['Skirmish', 'Skirmish'], ['Standard', 'Standard'],
      ], [
        [['4-8', '4-8'], ['2-3 rounds', '2-3 rondas'], ['2-3 rounds', '2-3 rondas']],
        [['9-16', '9-16'], ['3 rounds', '3 rondas'], ['3 rounds', '3 rondas']],
        [['17-32', '17-32'], ['4 rounds', '4 rondas'], ['3 rounds', '3 rondas']],
      ]),
      h('Competitive events', 'Eventos competitivos'),
      p('Competitive events use Standard engagement scale and this guide as written so results from different events remain comparable.', 'Los eventos competitivos usan la escala Standard y aplican esta guía tal como está escrita para que los resultados de distintos eventos sean comparables.'),
      table(null, [
        ['Players', 'Jugadores'], ['Days', 'Días'], ['Swiss rounds', 'Rondas suizas'],
      ], [
        [['12-32', '12-32'], ['1', '1'], ['3', '3']],
        [['33-128', '33-128'], ['2', '2'], ['5', '5']],
      ]),
      callout('A championship format for fields above 128 players will be announced.', 'Se anunciará un formato de campeonato para eventos de más de 128 jugadores.'),
      h('Adjusting the round count', 'Ajuste del número de rondas'),
      p('The TO may change the round count if it is clearly announced before round one. If attendance falls into a lower band, announce a reduction as early as possible and no later than the start of round two.', 'El TO puede modificar el número de rondas si lo anuncia claramente antes de la primera. Si la asistencia cae a una franja inferior, la reducción debe anunciarse cuanto antes y nunca después del inicio de la segunda ronda.'),
    ],
  },
  {
    id: 'game-format',
    title: text('Game format', 'Formato de partida'),
    blocks: [
      table(['Army cost', 'Coste del ejército'], [
        ['Engagement Scale', 'Escala'], ['Minerals', 'Minerales'], ['Vespene Gas', 'Gas vespeno'],
      ], [
        [['Standard', 'Standard'], ['2000', '2000'], ['200', '200']],
        [['Skirmish', 'Skirmish'], ['1000', '1000'], ['100', '100']],
      ]),
      p('Use the latest official rules, errata and FAQ published by the event\'s rules cut-off date. The recommended cut-off is two weeks before the event. Material released after that date does not apply.', 'Se usan las reglas, erratas y FAQ oficiales más recientes publicadas hasta la fecha límite del evento. Se recomienda fijarla dos semanas antes. El material publicado después no se aplica.'),
    ],
  },
  {
    id: 'army-rosters',
    title: text('Army rosters', 'Listas de ejército'),
    blocks: [
      h('What a roster is', 'Qué es una lista'),
      p('An Army Roster is the complete written record of the force a player brings. It is submitted, checked, published and shown to the opponent.', 'Una Lista de Ejército es el registro escrito completo de la fuerza que lleva un jugador. Se presenta, comprueba, publica y muestra al oponente.'),
      list([
        ['Player name and faction.', 'Nombre del jugador y facción.'],
        ['Every unit, loadout and upgrade.', 'Cada unidad, equipo y mejora.'],
        ['Supply value for every unit and the total.', 'Suministro de cada unidad y total.'],
        ['Mineral cost for every unit and the total.', 'Coste en minerales de cada unidad y total.'],
        ['Vespene Gas spent on Tactical Cards and the total.', 'Gas vespeno gastado en Cartas Tácticas y total.'],
        ['Two Mission Cards and two Deployment Cards.', 'Dos Cartas de Misión y dos Cartas de Despliegue.'],
      ]),
      callout('Anything that affects how the army plays belongs on the roster.', 'Todo lo que afecte a cómo juega el ejército debe figurar en la lista.'),
      h('Dual List format', 'Formato de lista doble'),
      list([
        ['A player may submit up to two rosters.', 'Cada jugador puede presentar hasta dos listas.'],
        ['Both rosters must use the same faction.', 'Ambas listas deben ser de la misma facción.'],
        ['Each roster has its own set of draft cards.', 'Cada lista tiene su propio conjunto de cartas de draft.'],
        ['A player submitting one roster uses it every round.', 'Quien presente una sola lista la usa en todas las rondas.'],
      ]),
      p('Single List format is also permitted if announced in the event rules.', 'También se permite el formato de lista única si se anuncia en las reglas del evento.'),
      h('Submission, publication and open lists', 'Presentación, publicación y listas abiertas'),
      p('Rosters are submitted one week before the event, giving players one week after the recommended rules cut-off to react. The TO decides and announces when rosters become public and may announce a late-submission penalty.', 'Las listas se presentan una semana antes del evento, dejando una semana desde la fecha límite recomendada de reglas. El TO decide y anuncia cuándo se hacen públicas y puede establecer una sanción por retraso.'),
      p('Every submitted roster is revealed to the opponent before the game. The TO and Head Judge check legality, while every participant should report discrepancies.', 'Cada lista presentada se revela al oponente antes de la partida. El TO y el árbitro principal comprueban su legalidad, y todos los participantes deben comunicar discrepancias.'),
      h('Illegal rosters', 'Listas ilegales'),
      list([
        ['Completed games stand if the error is small or both players agree to continue.', 'Las partidas terminadas se mantienen si el error es pequeño o ambos jugadores acuerdan continuar.'],
        ['The Head Judge may adjust the game state before play resumes.', 'El árbitro principal puede ajustar el estado de la partida antes de reanudarla.'],
        ['Correct the roster under judge supervision using the smallest legal change.', 'Corregir la lista bajo supervisión arbitral con el cambio legal más pequeño.'],
        ['The Head Judge and TO may apply a penalty proportionate to the advantage gained.', 'El árbitro principal y el TO pueden imponer una sanción proporcional a la ventaja obtenida.'],
      ]),
    ],
  },
  {
    id: 'tables-terrain',
    title: text('Tables and terrain', 'Mesas y terreno'),
    blocks: [
      h('Table size', 'Tamaño de mesa'),
      callout('Playing area: 36 x 54 inches (approximately 91 x 137 cm).', 'Área de juego: 36 x 54 pulgadas (aproximadamente 91 x 137 cm).'),
      p('Additionally, provide each player at least 30 cm (12 inches) of clear surface for cards, dice, tokens and clocks. In practice this means a table around 60 x 54 inches, or a side table for each player.', 'Además, proporciona a cada jugador al menos 30 cm (12 pulgadas) de superficie libre para cartas, dados, fichas y relojes. En la práctica supone una mesa de unas 60 x 54 pulgadas o una mesa auxiliar por jugador.'),
      h('Layouts', 'Configuraciones'),
      p('Staff set up every table before the event. Official Map Layouts or pre-announced community layouts may be used. Identify the layout at every table and leave terrain in the same configuration throughout the event where possible.', 'El personal prepara todas las mesas antes del evento. Pueden usarse Mapas oficiales o configuraciones comunitarias anunciadas previamente. Identifica la configuración de cada mesa y, si es posible, mantenla durante todo el evento.'),
      p('Players must see the terrain before drafting and agree on each terrain piece\'s Size and rules before the draft begins.', 'Los jugadores deben ver el terreno antes del draft y acordar el Tamaño y las reglas de cada elemento antes de empezar.'),
      h('Mission Markers and impassable terrain', 'Marcadores de Misión y terreno infranqueable'),
      list([
        ['Mission Markers cannot be placed on impassable terrain. Move the terrain, never the marker, to the nearest legal position.', 'Los Marcadores de Misión no pueden colocarse sobre terreno infranqueable. Mueve el terreno, nunca el marcador, a la posición legal más próxima.'],
        ['The player whose colour is not associated with the marker chooses how it moves and breaks equal-distance ties.', 'El jugador cuyo color no esté asociado al marcador decide cómo se mueve y resuelve empates de distancia.'],
        ['For Neutral Mission Marker 5, players Roll-Off.', 'Para el Marcador de Misión neutral 5, los jugadores realizan un Roll-Off.'],
        ['If players disagree, a judge places the terrain.', 'Si no hay acuerdo, un árbitro coloca el terreno.'],
      ]),
      h('Custom terrain and layouts', 'Terreno y configuraciones personalizadas'),
      p('Publish custom layouts and photographs in advance. Assign every piece a Size category and approximate the footprint of the official piece being replaced.', 'Publica con antelación las configuraciones personalizadas y sus fotografías. Asigna una categoría de Tamaño a cada elemento y aproxima la huella del elemento oficial sustituido.'),
      table(['Suggested terrain composition', 'Composición de terreno sugerida'], [
        ['Size', 'Tamaño'], ['Pieces', 'Elementos'], ['Examples', 'Ejemplos'], ['Effect', 'Efecto'],
      ], [
        [['0', '0'], ['0-2', '0-2'], ['Scatter terrain', 'Terreno disperso'], ['Incidental', 'Incidental']],
        [['1', '1'], ['2-4', '2-4'], ['Barricades, low walls, crates', 'Barricadas, muros bajos, cajas'], ['Infantry cover; does not block Line of Sight for models larger than Size 1', 'Cobertura para infantería; no bloquea Línea de Visión a miniaturas mayores que Tamaño 1']],
        [['2', '2'], ['6-8', '6-8'], ['Ruins, bunkers, wrecked vehicles', 'Ruinas, búnkeres, vehículos destruidos'], ['Blocks Line of Sight for most Units; creates lanes and chokepoints', 'Bloquea Línea de Visión a la mayoría de unidades; crea líneas de tiro y cuellos de botella']],
        [['3+', '3+'], ['1-2', '1-2'], ['Large structures, elevated platforms', 'Grandes estructuras, plataformas elevadas'], ['Creates High Ground and blocks Line of Sight for almost everything', 'Crea Terreno Elevado y bloquea Línea de Visión a casi todo']],
        [['Grass (Size 2 special)', 'Hierba (Tamaño 2 especial)'], ['4-6', '4-6'], ['Woods, tall growth', 'Bosques, vegetación alta'], ['Does not block movement; grants Line of Sight cover', 'No bloquea movimiento; concede cobertura de Línea de Visión']],
      ]),
    ],
  },
  {
    id: 'pairings',
    title: text('Pairings', 'Emparejamientos'),
    blocks: [
      p('Use the Swiss system. Pair round one randomly or by a pre-announced seeding method. Later rounds pair equal or nearest records and avoid repeats wherever the bracket allows.', 'Usa el sistema suizo. Empareja la primera ronda al azar o mediante un sistema de cabezas de serie anunciado. En rondas posteriores, enfrenta historiales iguales o próximos y evita repeticiones cuando sea posible.'),
      h('Byes', 'Descansos (byes)'),
      list([
        ['Give the bye to a player without a previous bye from the lowest-scoring bracket.', 'Asigna el bye a un jugador sin byes previos de la franja con menor puntuación.'],
        ['A bye scores 3 MP and 4 TP.', 'Un bye otorga 3 MP y 4 TP.'],
        ['Nobody receives a second bye while another eligible player has none.', 'Nadie recibe un segundo bye mientras quede un jugador elegible sin ninguno.'],
        ['Allocate byes in early rounds where possible.', 'Asigna los byes en rondas tempranas cuando sea posible.'],
      ]),
      p('At Community events, a Head Judge joining as a spare player is preferable to a bye.', 'En eventos comunitarios es preferible que el árbitro principal entre como suplente antes que asignar un bye.'),
      h('Drops', 'Abandonos'),
      list([
        ['A withdrawing player must notify the TO before the next pairing is generated.', 'Quien abandone debe avisar al TO antes de generar el siguiente emparejamiento.'],
        ['Completed results remain valid.', 'Los resultados completados siguen siendo válidos.'],
        ['A player who drops cannot re-enter.', 'Quien abandona no puede reincorporarse.'],
        ['An absent player who gave no notice is dropped; the opponent receives a walkover result.', 'Un jugador ausente sin aviso queda retirado; su oponente recibe el resultado de walkover.'],
      ]),
      h('Conceding a game', 'Conceder una partida'),
      p('A player may concede at any time. The opponent receives an Annihilation and the game counts toward both opponent metrics. A judge should attend the table. Repeated concessions intended to manipulate standings are a conduct matter.', 'Un jugador puede conceder en cualquier momento. El rival recibe una Aniquilación y la partida cuenta para ambas métricas de oponentes. Debe acudir un árbitro. Las concesiones repetidas para manipular la clasificación son una cuestión de conducta.'),
    ],
  },
  {
    id: 'round-length',
    title: text('Round length', 'Duración de la ronda'),
    blocks: [
      callout('A round lasts 2 hours 30 minutes, including the draft.', 'Una ronda dura 2 horas y 30 minutos, incluido el draft.'),
      p('Allow about 15 minutes for the draft. For an event aimed mostly at new players, the TO may add 15 minutes to round one if announced in advance.', 'Reserva unos 15 minutos para el draft. En un evento dirigido principalmente a principiantes, el TO puede añadir 15 minutos a la primera ronda si lo anuncia previamente.'),
      h('The last fifteen minutes', 'Los últimos quince minutos'),
      callout('Do not start a new Battle Round during the last 15 minutes. Finish the current one and score the game state.', 'No se inicia una nueva Ronda de Batalla durante los últimos 15 minutos. Termina la actual y puntúa el estado de la partida.'),
      h('When time is called', 'Cuando termina el tiempo'),
      list([
        ['Stop immediately: no final roll, activation or unfinished sequence.', 'Detente de inmediato: no hay tirada final, activación ni secuencia pendiente.'],
        ['Roll back an interrupted activation to the state before it began.', 'Revierte una activación interrumpida al estado anterior a su inicio.'],
        ['If hit rolls were already made, finish the attack through Armour or Evade Rolls and damage.', 'Si ya se hicieron tiradas de impacto, termina el ataque con las tiradas de Armadura o Evasión y el daño.'],
        ['End-of-Battle-Round scoring counts only for completed Battle Rounds.', 'La puntuación de fin de Ronda de Batalla solo cuenta para rondas completadas.'],
      ]),
      p('If fewer than two full Battle Rounds were completed, a judge reviews the game before scoring and may investigate slow play.', 'Si no se completaron dos Rondas de Batalla, un árbitro revisa la partida antes de puntuarla y puede investigar juego lento.'),
    ],
  },
  {
    id: 'milestones',
    title: text('Milestone announcements', 'Avisos de tiempo'),
    blocks: [
      p('Call every milestone aloud. Times are measured from the start of the round.', 'Anuncia en voz alta cada hito. Los tiempos se miden desde el inicio de la ronda.'),
      table(null, [
        ['Elapsed', 'Transcurrido'], ['Remaining', 'Restante'], ['Call', 'Aviso'],
      ], [
        [['0:00', '0:00'], ['2:30', '2:30'], ['Round begins, draft now', 'Comienza la ronda, iniciad el draft']],
        [['0:15', '0:15'], ['2:15', '2:15'], ['Drafts should be complete', 'Los drafts deberían haber terminado']],
        [['0:45', '0:45'], ['1:45', '1:45'], ['45 minutes gone', 'Han transcurrido 45 minutos']],
        [['1:15', '1:15'], ['1:15', '1:15'], ['Halfway', 'Mitad de la ronda']],
        [['2:00', '2:00'], ['0:30', '0:30'], ['30 minutes remaining', 'Quedan 30 minutos']],
        [['2:15', '2:15'], ['0:15', '0:15'], ['15 minutes; do not begin a new Battle Round', '15 minutos; no iniciéis una nueva Ronda de Batalla']],
        [['2:25', '2:25'], ['0:05', '0:05'], ['5 minutes', '5 minutos']],
      ]),
    ],
  },
  {
    id: 'end-of-round',
    title: text('End of round', 'Final de ronda'),
    blocks: [
      p('With five minutes remaining, judges should circulate and help games close. If a game cannot finish naturally, players submit the scores as they stand. Extensions are not recommended because time granted to one table delays every other table.', 'Cuando queden cinco minutos, los árbitros deben circular y ayudar a cerrar las partidas. Si una partida no puede terminar de forma natural, se presentan los resultados tal como estén. No se recomiendan extensiones porque retrasan al resto de mesas.'),
    ],
  },
  {
    id: 'scoring-standings',
    title: text('Scoring and standings', 'Puntuación y clasificación'),
    blocks: [
      p('Match Points (MP) record whether a player won. Tournament Points (TP) record how convincingly. The system is identical at both engagement scales except for the Victory Point difference bands.', 'Los Puntos de Partida (MP) indican si un jugador ganó. Los Puntos de Torneo (TP) indican con qué margen. El sistema es igual en ambas escalas salvo por las franjas de diferencia de Puntos de Victoria.'),
      table(['Scoring a game', 'Puntuación de una partida'], [
        ['Result', 'Resultado'], ['Standard VP difference', 'Diferencia de PV Standard'], ['Skirmish VP difference', 'Diferencia de PV Skirmish'], ['Winner', 'Ganador'], ['Loser', 'Perdedor'],
      ], [
        [['Annihilation', 'Aniquilación'], ['10+', '10+'], ['8+', '8+'], ['3 MP / 5 TP', '3 MP / 5 TP'], ['0 MP / 0 TP', '0 MP / 0 TP']],
        [['Decisive Victory', 'Victoria decisiva'], ['7-9', '7-9'], ['6-7', '6-7'], ['3 MP / 4 TP', '3 MP / 4 TP'], ['0 MP / 1 TP', '0 MP / 1 TP']],
        [['Breakthrough', 'Avance'], ['3-6', '3-6'], ['3-5', '3-5'], ['3 MP / 3 TP', '3 MP / 3 TP'], ['0 MP / 2 TP', '0 MP / 2 TP']],
        [['Stalemate', 'Estancamiento'], ['0-2', '0-2'], ['0-2', '0-2'], ['1 MP / 2 TP', '1 MP / 2 TP'], ['1 MP / 2 TP', '1 MP / 2 TP']],
      ]),
      table(['Games that do not end normally', 'Partidas que no terminan normalmente'], [
        ['Situation', 'Situación'], ['Player', 'Jugador'], ['Opponent', 'Oponente'], ['Counts for SoS/oTP?', '¿Cuenta para SoS/oTP?'],
      ], [
        [['Concedes', 'Concede'], ['0 MP / 0 TP', '0 MP / 0 TP'], ['3 MP / 5 TP', '3 MP / 5 TP'], ['Yes', 'Sí']],
        [['Receives a bye', 'Recibe un bye'], ['3 MP / 4 TP', '3 MP / 4 TP'], ['-', '-'], ['No', 'No']],
        [['No-show or walkover', 'Incomparecencia o walkover'], ['0 MP / 0 TP', '0 MP / 0 TP'], ['3 MP / 4 TP', '3 MP / 4 TP'], ['No', 'No']],
        [['Runs out of round time', 'Se agota el tiempo de ronda'], ['Normal VP-difference score', 'Puntuación normal por diferencia de PV'], ['Normal VP-difference score', 'Puntuación normal por diferencia de PV'], ['Yes', 'Sí']],
      ]),
      h('Standings order', 'Orden de clasificación'),
      list([
        ['Match Points.', 'Puntos de Partida.'],
        ['Tournament Points.', 'Puntos de Torneo.'],
        ['Strength of Schedule (SoS).', 'Fuerza del Calendario (SoS).'],
        ["Opponents' Tournament Points (oTP).", 'Puntos de Torneo de los Oponentes (oTP).'],
      ], true),
      p('If all four metrics are identical, the placement is shared. The guide recommends sharing first place when the tie is at the top.', 'Si las cuatro métricas son idénticas, se comparte la posición. La guía recomienda compartir el primer puesto cuando el empate esté en cabeza.'),
      h('Opponent metrics', 'Métricas de oponentes'),
      p('SoS is the sum of the final Match Points of opponents actually faced divided by their number. oTP is the equivalent average of final Tournament Points.', 'SoS es la suma de los Puntos de Partida finales de los rivales realmente enfrentados dividida entre su número. oTP es la media equivalente de sus Puntos de Torneo finales.'),
      list([
        ['Byes, walkovers and no-shows are excluded from both numerator and denominator.', 'Byes, walkovers e incomparecencias se excluyen del numerador y del divisor.'],
        ['Conceded games remain in both pools at full Annihilation value.', 'Las partidas concedidas permanecen en ambas métricas con valor completo de Aniquilación.'],
        ['A withdrawn player still contributes their final totals to earlier opponents.', 'Un jugador retirado sigue aportando sus totales finales a los rivales anteriores.'],
        ['Calculate after the final round, report four decimal places, and compare unrounded values.', 'Calcula tras la última ronda, muestra cuatro decimales y compara valores sin redondear.'],
        ['If the pool is empty, record SoS and oTP as 0.', 'Si la muestra queda vacía, registra SoS y oTP como 0.'],
      ]),
    ],
  },
  {
    id: 'pre-game-sequence',
    title: text('The pre-game sequence', 'Secuencia previa a la partida'),
    blocks: [
      p('Before each game, players choose their roster, establish sides and draft the Mission and Deployment in order. Physical cards or the Tabletop Battles app may be used by agreement.', 'Antes de cada partida, los jugadores eligen lista, establecen lados y realizan en orden el draft de Misión y Despliegue. Pueden usar cartas físicas o la aplicación Tabletop Battles si están de acuerdo.'),
      h('Step 1 - Roster selection', 'Paso 1 - Selección de lista'),
      p('In Dual List format, both players reveal their chosen roster simultaneously. If they cannot agree on a method, each tells a judge privately and the judge announces both. Skip this step in Single List format.', 'En formato de lista doble, ambos jugadores revelan simultáneamente su lista elegida. Si no acuerdan un método, se la comunican en privado a un árbitro, que anuncia ambas. Este paso se omite con lista única.'),
      h('Step 2 - Setup', 'Paso 2 - Preparación'),
      list([
        ['Row 1: four Mission Cards.', 'Fila 1: cuatro Cartas de Misión.'],
        ['Row 2: four Deployment Cards.', 'Fila 2: cuatro Cartas de Despliegue.'],
      ]),
      h('Step 3 - Establishing priority', 'Paso 3 - Establecer la prioridad'),
      list([
        ['The player who spent less Vespene Gas takes priority.', 'Obtiene la prioridad quien haya gastado menos Gas vespeno.'],
        ['If tied, the player who spent fewer Minerals takes priority.', 'En caso de empate, quien haya gastado menos Minerales.'],
        ['If still tied, Roll-Off.', 'Si persiste el empate, se realiza un Roll-Off.'],
      ], true),
      p('The player without priority chooses the perspective from which the Deployment is oriented. The player with priority first chooses Red or Blue, then takes control of either the Mission Draft or Deployment Draft; the opponent controls the other.', 'El jugador sin prioridad elige la perspectiva desde la que se orienta el Despliegue. El jugador con prioridad elige primero Rojo o Azul y después controla el Draft de Misión o el de Despliegue; el rival controla el otro.'),
      h('Step 4 - Mission Draft', 'Paso 4 - Draft de Misión'),
      list([
        ['The player without control removes any two Mission Cards.', 'El jugador sin control retira dos Cartas de Misión cualesquiera.'],
        ['The controlling player chooses one of the two remaining cards.', 'El jugador con control elige una de las dos restantes.'],
        ['Discard the last card.', 'Descarta la última carta.'],
      ], true),
      h('Step 5 - Deployment Draft', 'Paso 5 - Draft de Despliegue'),
      list([
        ['The player without control removes any two Deployment Cards.', 'El jugador sin control retira dos Cartas de Despliegue cualesquiera.'],
        ['The controlling player chooses one of the two remaining cards.', 'El jugador con control elige una de las dos restantes.'],
        ['Discard the last card.', 'Descarta la última carta.'],
      ], true),
      callout('If the sequence is unfinished after 15 minutes, a judge completes the remaining choices randomly. Playing time is not extended.', 'Si la secuencia no ha terminado tras 15 minutos, un árbitro completa al azar las elecciones restantes. El tiempo de juego no se amplía.'),
    ],
  },
  {
    id: 'judging-conduct',
    title: text('Judging and conduct', 'Arbitraje y conducta'),
    blocks: [
      h('Rules disputes', 'Disputas de reglas'),
      p('Players should resolve simple disagreements themselves. The round clock does not stop. If they cannot agree, call a judge immediately rather than playing under protest.', 'Los jugadores deben resolver por sí mismos los desacuerdos sencillos. El reloj de ronda no se detiene. Si no hay acuerdo, se llama inmediatamente a un árbitro en vez de continuar bajo protesta.'),
      h('Penalties', 'Sanciones'),
      table(null, [
        ['Penalty', 'Sanción'], ['Applied by', 'La aplica'], ['When', 'Cuándo'],
      ], [
        [['Caution', 'Caution'], ['Floor Judge', 'Árbitro de mesa'], ['First minor error with no real effect', 'Primer error menor sin efecto real']],
        [['Warning', 'Warning'], ['Floor Judge', 'Árbitro de mesa'], ['Repeated caution or an error that affected the game; recorded and cumulative', 'Repetición de un Caution o error que afectó a la partida; se registra y acumula']],
        [['Game Loss', 'Game Loss'], ['Head Judge', 'Árbitro principal'], ['Third Warning, advantageous illegal roster, or slow play already warned twice', 'Tercer Warning, lista ilegal ventajosa o juego lento advertido dos veces']],
        [['Disqualification', 'Descalificación'], ['Head Judge and TO', 'Árbitro principal y TO'], ['Cheating or a serious Code of Conduct breach', 'Trampas o infracción grave del Código de Conducta']],
      ]),
      p('Penalties accumulate across the whole event and must be recorded. A Game Loss is scored as an Annihilation against the penalised player. A disqualified player leaves the event and cannot place or win prizes, but completed games remain in the standings.', 'Las sanciones se acumulan durante todo el evento y deben registrarse. Un Game Loss se puntúa como Aniquilación contra el sancionado. Un jugador descalificado abandona y no puede clasificarse ni recibir premios, pero sus partidas terminadas se mantienen.'),
      h('Pace of play', 'Ritmo de juego'),
      p('Judges may intervene without being called when a table is visibly behind. Unreasonable delay first receives a logged Caution; the judge may then impose a per-activation time limit. Continued slow play receives a Warning and may result in a remedy up to Game Loss.', 'Los árbitros pueden intervenir sin ser llamados si una mesa va visiblemente retrasada. Una demora injustificada recibe primero un Caution registrado; después puede imponerse un límite por activación. Si continúa, recibe un Warning y una reparación que puede llegar a Game Loss.'),
      h('Code of Conduct', 'Código de Conducta'),
      p('Players, judges, spectators and staff must treat everyone with respect. The following may result in penalties up to immediate disqualification and removal from the venue:', 'Jugadores, árbitros, espectadores y personal deben tratar a todos con respeto. Las siguientes conductas pueden conllevar hasta descalificación inmediata y expulsión del local:'),
      list([
        ['Harassment, including sexual harassment.', 'Acoso, incluido el acoso sexual.'],
        ['Hate speech or slurs.', 'Discurso de odio o insultos discriminatorios.'],
        ['Intimidation, threats or physical aggression.', 'Intimidación, amenazas o agresión física.'],
        ['Cheating or misrepresenting rules, dice, measurements or roster contents.', 'Trampas o falsear reglas, dados, mediciones o contenido de la lista.'],
        ['Withholding relevant information about your army.', 'Ocultar información relevante sobre el propio ejército.'],
        ['Theft or damage to property.', 'Robo o daños a la propiedad.'],
        ['Persistent unsporting behaviour after being asked to stop.', 'Conducta antideportiva persistente tras pedir que cese.'],
      ]),
      p('Publish a discreet contact for conduct reports. Conduct disqualifications are recorded and reported to the publisher.', 'Publica un contacto discreto para denuncias de conducta. Las descalificaciones por conducta se registran y comunican al editor.'),
      h('Accessibility', 'Accesibilidad'),
      list([
        ['Publish whether step-free access and an accessible toilet are available.', 'Publica si existen acceso sin escalones y aseo accesible.'],
        ['State whether tables are seated or standing and whether seating is available on request.', 'Indica si las mesas se usan sentado o de pie y si puede solicitarse asiento.'],
        ['Provide an accommodations contact and deadline; one week is reasonable.', 'Facilita contacto y plazo para adaptaciones; una semana es razonable.'],
      ]),
    ],
  },
  {
    id: 'side-events',
    title: text('Side events', 'Actividades paralelas'),
    blocks: [
      p('StarCraft: TMG has no top cut: every player plays every round. Side events give players who are out of contention a reason to remain without replacing their main-tournament rounds.', 'StarCraft: TMG no tiene top cut: todos juegan todas las rondas. Las actividades paralelas animan a quedarse a quienes ya no optan a ganar sin sustituir sus rondas del torneo principal.'),
      h('Where they fit', 'Cuándo encajan'),
      list([
        ['The evening between days one and two.', 'La tarde o noche entre el primer y segundo día.'],
        ['Lunch breaks and long scheduled gaps.', 'Pausas para comer y huecos largos previstos.'],
        ['After the final round while standings and awards are prepared.', 'Tras la última ronda mientras se preparan clasificación y premios.'],
        ['For players who have already dropped.', 'Para jugadores que ya hayan abandonado.'],
      ]),
      h('What to run', 'Qué organizar'),
      list([
        ['A short Skirmish mini-tournament.', 'Un minitorneo breve de Skirmish.'],
        ['Open-play or learn-to-play tables.', 'Mesas de juego abierto o de iniciación.'],
        ['A painting or display competition.', 'Un concurso de pintura o exhibición.'],
      ]),
      callout('A side event must never be a reason to leave the main tournament early.', 'Una actividad paralela nunca debe ser motivo para abandonar antes el torneo principal.'),
      h('Hobby awards', 'Premios de hobby'),
      list([
        ['Best Painted: player vote at a display table.', 'Mejor Pintado: votación de jugadores en una mesa de exposición.'],
        ['Best in Faction: one award for Terran, Protoss and Zerg.', 'Mejor de Facción: un premio para Terran, Protoss y Zerg.'],
        ['Best Sportsman: one nomination per player with the last result.', 'Mejor Deportista: una nominación por jugador con el último resultado.'],
      ]),
      p('Announce activities with the event, assign an owner, keep entry free where possible, and keep every activity short enough for its time window.', 'Anuncia las actividades con el evento, asigna un responsable, mantén la entrada gratuita cuando sea posible y haz que terminen dentro de su franja.'),
    ],
  },
  {
    id: 'chess-clocks',
    title: text('Chess clocks', 'Relojes de ajedrez'),
    blocks: [
      h('General etiquette', 'Etiqueta general'),
      callout('If either player wants to use a clock, both players must use it.', 'Si cualquiera de los jugadores quiere usar reloj, ambos deben utilizarlo.'),
      p('Players intending to use a clock bring a physical clock or tested app. Deliberately burning time is unsporting conduct and may be penalised.', 'Quien quiera usar reloj lleva uno físico o una aplicación probada. Consumir tiempo deliberadamente es conducta antideportiva y puede sancionarse.'),
      h('Time allocation and setup', 'Asignación y preparación del tiempo'),
      p('The 150-minute round includes every pre-game step. At clock start, take the actual remaining round time, subtract five minutes for judge calls, and split the result evenly. If an opponent is absent or delaying preparation, notify a judge before starting their clock.', 'La ronda de 150 minutos incluye todos los pasos previos. Al iniciar el reloj, toma el tiempo real restante, resta cinco minutos para consultas arbitrales y divide el resultado por igual. Si el rival está ausente o retrasa la preparación, avisa antes a un árbitro.'),
      h('Pausing and switching', 'Pausas y cambios'),
      p('Pause only for a serious rules dispute requiring a judge. Ordinary questions use the asking player\'s time. Time runs for the player making the current decision; switch immediately when the opponent must decide. Routine Armour Rolls need not cause constant switching if they do not delay play.', 'Pausa únicamente por una disputa grave que requiera árbitro. Las preguntas ordinarias consumen el tiempo de quien pregunta. El reloj corre para quien toma la decisión actual y cambia en cuanto deba decidir el rival. Las tiradas rutinarias de Armadura no exigen cambios constantes si no retrasan.'),
      h('Running out of time', 'Agotar el tiempo'),
      list([
        ['Movement and Assault Phases: activate an unactivated Unit and automatically Hold.', 'Fases de Movimiento y Asalto: activa una unidad sin activar y realiza automáticamente Hold.'],
        ['Exception: a Unit in Reserves may Deploy instead of Holding, ending inside its own Zone of Influence.', 'Excepción: una unidad en Reservas puede Desplegar en vez de Hold y terminar dentro de su propia Zona de Influencia.'],
        ['Combat Phase: activate Units and make Close Combat Attack Rolls normally.', 'Fase de Combate: activa unidades y realiza normalmente tiradas de Ataque de Combate Cuerpo a Cuerpo.'],
        ['Still allowed: Armour Rolls, Evade Rolls, fighting in the Combat Phase and scoring Victory Points.', 'Sigue permitido: tiradas de Armadura y Evasión, combatir en la Fase de Combate y puntuar Puntos de Victoria.'],
      ]),
      p('The opponent may lend their own remaining minutes, but this is optional and may be withdrawn at any time. All permitted actions must still be completed promptly.', 'El oponente puede ceder sus minutos restantes, pero es opcional y puede retirarlo en cualquier momento. Todas las acciones permitidas deben realizarse con rapidez.'),
    ],
  },
  {
    id: 'software',
    title: text('Optional: software', 'Opcional: software'),
    blocks: [
      h('Pairings and standings', 'Emparejamientos y clasificación'),
      p('The guide recommends Best Coast Pairings. Announce the platform during registration and publish full pairings and final standings afterwards.', 'La guía recomienda Best Coast Pairings. Anuncia la plataforma durante la inscripción y publica después todos los emparejamientos y la clasificación final.'),
      list([
        ['SoS and oTP must be means, not sums.', 'SoS y oTP deben ser medias, no sumas.'],
        ["Both use every opponent's final tally.", 'Ambas usan el total final de cada rival.'],
        ['Byes, walkovers and no-shows are excluded rather than entered as zero; concessions remain included.', 'Byes, walkovers e incomparecencias se excluyen en vez de introducirse como cero; las concesiones siguen incluidas.'],
      ]),
      h('Draft and score tracking', 'Seguimiento de draft y puntuación'),
      p('The Tabletop Battles app is recommended but optional. Both players must be able to see the card pool and every draft choice, and both must be able to see the running score.', 'La aplicación Tabletop Battles se recomienda, pero es opcional. Ambos jugadores deben poder ver las cartas y cada elección del draft, además de la puntuación en todo momento.'),
    ],
  },
  {
    id: 'feedback',
    title: text('Feedback', 'Comentarios'),
    blocks: [
      p('The publisher invites feedback from real events, particularly about round timing, clock procedures and tiebreakers.', 'El editor invita a enviar comentarios de eventos reales, especialmente sobre duración de rondas, procedimientos de reloj y desempates.'),
    ],
  },
] as const;
