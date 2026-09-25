/** Concise play guide. Page numbers refer to the printed pages, not PDF indices. */
export interface BasicRuleText {
  es: string;
  en: string;
}

export interface BasicRuleStep {
  id: string;
  title: BasicRuleText;
  text: BasicRuleText;
  source: {
    section: string;
    printedPage: number;
    /** Omitted for the core rulebook. */
    document?: 'core' | 'faq';
  };
  termIds?: readonly string[];
}

export interface BasicRuleSection {
  id: string;
  title: BasicRuleText;
  intro: BasicRuleText;
  steps: readonly BasicRuleStep[];
}

export const BASIC_RULE_SECTIONS: readonly BasicRuleSection[] = [
  {
    id: 'before-play',
    title: { es: 'Antes de jugar', en: 'Before play' },
    intro: {
      es: 'Preparad las listas, elegid la misión y montad el campo de batalla antes de la primera ronda.',
      en: 'Prepare your rosters, choose a mission and set up the battlefield before the first round.',
    },
    steps: [
      {
        id: 'choose-force',
        title: { es: 'Elegid escala y facción', en: 'Choose scale and faction' },
        text: {
          es: 'Acordad la escala de enfrentamiento. Cada jugador elige una raza y una carta de facción; todas las etiquetas de facción de cada unidad o carta táctica de su lista deben aparecer en esa carta de facción.',
          en: 'Agree on the engagement scale. Each player chooses a race and a Faction Card; every faction tag on a Unit or Tactical Card in their roster must appear on that Faction Card.',
        },
        source: { section: '9.1.1–9.1.2', printedPage: 73 },
        termIds: ['faction-tags'],
      },
      {
        id: 'spend-resources',
        title: { es: 'Asignad los recursos', en: 'Allocate resources' },
        text: {
          es: 'Gastad minerales en unidades y mejoras, y gas vespeno exclusivamente en cartas tácticas. Respetad el límite de cada recurso de la escala elegida; el gas sin gastar no se convierte en minerales.',
          en: 'Spend Minerals on Units and Upgrades, and Vespene Gas only on Tactical Cards. Stay within each resource limit for the chosen scale; unspent Gas cannot become Minerals.',
        },
        source: { section: '9.1.3–9.1.4', printedPage: 73 },
      },
      {
        id: 'fill-army-slots',
        title: { es: 'Completad los espacios de ejército', en: 'Fill Army Slots' },
        text: {
          es: 'Las cartas de facción y tácticas aportan espacios. Para cada unidad elegid una de sus composiciones válidas y pagad su coste; la unidad ocupa tantos espacios de su categoría como indique su valor inicial de suministro.',
          en: 'Faction and Tactical Cards provide Army Slots. Choose one legal composition for each Unit and pay its cost; the Unit uses slots of its category equal to its starting Supply Value.',
        },
        source: { section: '9.1.5–9.1.6', printedPage: 74 },
        termIds: ['army-slot', 'supply-value'],
      },
      {
        id: 'purchase-upgrades',
        title: { es: 'Añadid mejoras', en: 'Add Upgrades' },
        text: {
          es: 'Podéis comprar las mejoras mostradas en el reverso de cada carta de unidad. Cada mejora distinta se paga por separado; una mejora SPECIALIST se asigna a una sola miniatura de la unidad.',
          en: 'You may buy Upgrades shown on each Unit Card’s reverse. Pay separately for each distinct Upgrade; a SPECIALIST Upgrade belongs to just one model in that Unit.',
        },
        source: { section: '9.1.7', printedPage: 75 },
        termIds: ['specialist'],
      },
      {
        id: 'draft',
        title: { es: 'Elegid misión y despliegue', en: 'Choose mission and deployment' },
        text: {
          es: 'Cada jugador aporta dos cartas de misión y dos de despliegue. Una tirada enfrentada determina quién elige color y qué draft controla; el otro jugador controla el draft restante. En cada draft, quien no lo controla retira dos cartas y quien sí lo controla elige una de las dos restantes. La afinidad de color de un marcador no concede su control inicial.',
          en: 'Each player brings two Mission Cards and two Deployment Cards. A roll-off decides who chooses a colour and which draft to control; the other player controls the remaining draft. In each draft, the non-controlling player removes two cards and the controller chooses one of the two left. A marker’s colour affinity does not grant starting control.',
        },
        source: { section: '9.2', printedPage: 77 },
      },
      {
        id: 'set-battlefield',
        title: { es: 'Preparad la mesa', en: 'Set up the table' },
        text: {
          es: 'Seguid la carta de despliegue para el tamaño de mesa, bordes de entrada y zonas de influencia. Después colocad el terreno y los marcadores de misión en las coordenadas indicadas.',
          en: 'Use the Deployment Card for table size, Entry Edges and Zones of Influence. Then place terrain and Mission Markers at the indicated coordinates.',
        },
        source: { section: '9.3', printedPage: 78 },
        termIds: ['entry-edge', 'zone-of-influence', 'mission-markers'],
      },
      {
        id: 'initial-state',
        title: { es: 'Determinad la iniciativa inicial', en: 'Determine initial initiative' },
        text: {
          es: 'Haced una nueva tirada enfrentada: quien gane asigna el marcador de primer jugador a cualquiera de los dos. Todas las unidades de la lista empiezan en reservas y entrarán en juego durante la fase de movimiento.',
          en: 'Make another roll-off: the winner assigns the First Player Marker to either player. All rostered Units begin in Reserves and enter play during a Movement Phase.',
        },
        source: { section: '8.2.2–8.3', printedPage: 55 },
        termIds: ['first-player-marker', 'reserves'],
      },
    ],
  },
  {
    id: 'core-concepts',
    title: { es: 'Conceptos de la ronda', en: 'Round essentials' },
    intro: {
      es: 'Una ronda sigue siempre el mismo orden. La carta de misión fija su duración y sus condiciones de victoria.',
      en: 'A round always follows the same order. The Mission Card defines the game length and victory conditions.',
    },
    steps: [
      {
        id: 'phase-order',
        title: { es: 'Cuatro fases', en: 'Four phases' },
        text: {
          es: 'Resolved por orden Movimiento, Asalto, Combate y Puntuación y limpieza. Las tres primeras usan activaciones; la última resuelve el control de objetivos, los puntos y el cierre de ronda.',
          en: 'Resolve Movement, Assault, Combat, then Scoring & Cleanup in order. The first three use activations; the last resolves objective control, points and round-end tasks.',
        },
        source: { section: '8.1', printedPage: 54 },
      },
      {
        id: 'alternating-activations',
        title: { es: 'Activaciones alternas', en: 'Alternating activations' },
        text: {
          es: 'Quien tiene el marcador de primer jugador elige quién comienza cada fase. Después, los jugadores se alternan, activando una unidad cada vez. Una unidad activada realiza exactamente una acción de las permitidas en esa fase.',
          en: 'The First Player Marker holder chooses who starts each phase. Players then alternate, activating one Unit at a time. An activated Unit performs exactly one action allowed in that phase.',
        },
        source: { section: '8.2', printedPage: 54 },
        termIds: ['activation', 'active-player'],
      },
      {
        id: 'passing',
        title: { es: 'Pasar', en: 'Passing' },
        text: {
          es: 'Un jugador puede pasar en lugar de activar una unidad, y debe hacerlo si no le quedan unidades aptas. El primero en pasar recibe el marcador de primer jugador para la fase siguiente y ya no puede activar más unidades en la fase actual.',
          en: 'A player may Pass instead of activating a Unit, and must do so when no eligible Units remain. The first to Pass takes the First Player Marker for the next phase and cannot activate more Units in the current phase.',
        },
        source: { section: '8.2.1', printedPage: 55 },
        termIds: ['pass', 'first-player-marker'],
      },
      {
        id: 'available-supply',
        title: { es: 'Suministro disponible', en: 'Available Supply' },
        text: {
          es: 'El suministro disponible es la reserva de suministro de la ronda menos el suministro actual total de tus unidades en el campo. Solo puedes desplegar una unidad si cabe en ese margen. La reserva aumenta según la carta de misión y es ilimitada en la ronda final.',
          en: 'Available Supply is the round’s Supply Pool minus the total Current Supply of your Units on the battlefield. You may Deploy a Unit only if it fits. The pool increases as specified by the Mission Card and is unlimited in the final round.',
        },
        source: { section: '8.3.1–8.3.2', printedPage: 55 },
        termIds: ['available-supply', 'supply-pool', 'current-supply-value'],
      },
    ],
  },
  {
    id: 'movement',
    title: { es: 'Fase 1 · Movimiento', en: 'Phase 1 · Movement' },
    intro: {
      es: 'Entrad desde reservas, avanzad o salid de un combate para preparar el asalto.',
      en: 'Bring in reserves, advance or leave combat to prepare for the assault.',
    },
    steps: [
      {
        id: 'movement-start',
        title: { es: 'Inicio de ronda', en: 'Start of the round' },
        text: {
          es: 'Resolved las habilidades de «inicio de ronda» y comprobad el suministro disponible. Si ambos jugadores tienen efectos simultáneos, resuelve primero los suyos el primer jugador.',
          en: 'Resolve “Start of the Round” abilities and check Available Supply. If both players have effects, the first player resolves theirs first.',
        },
        source: { section: '8.4', printedPage: 56 },
      },
      {
        id: 'movement-actions',
        title: { es: 'Elegid una acción', en: 'Choose one action' },
        text: {
          es: 'Una unidad en el campo sin marcador de activación puede Mover, Mantener posición o Destrabarse; una unidad en reservas puede Desplegar. Tras la acción recibe un marcador de activación por la cara de Movimiento.',
          en: 'An on-table Unit without an Activation Marker may Move, Hold or Disengage; a Unit in Reserves may Deploy. After the action, give it a Movement-side Activation Marker.',
        },
        source: { section: '8.4.1', printedPage: 56 },
      },
      {
        id: 'move-and-coherency',
        title: { es: 'Desplazad las miniaturas y mantened coherencia', en: 'Move and maintain coherency' },
        text: {
          es: 'Para mover, escoged una miniatura líder y movedla hasta la Velocidad de la unidad por un recorrido legal. Después colocad las demás miniaturas en coherencia. Una unidad terrestre no trabada no puede terminar este movimiento dentro del alcance de trabado de una unidad terrestre enemiga.',
          en: 'Choose a Leading Model and move it up to the Unit’s Speed along a legal path. Then set the remaining models In Coherency. An Unengaged Ground Unit cannot end this move within an Enemy Ground Unit’s Engagement Range.',
        },
        source: { section: '8.5.2–8.5.3', printedPage: 56 },
        termIds: ['leading-model', 'unit-coherency', 'engagement-range'],
      },
      {
        id: 'move-zero-faq',
        title: { es: 'Mover exige cambiar de posición', en: 'A Move must change position' },
        text: {
          es: 'La FAQ aclara que Mover o Correr 0 pulgadas no cuenta como movimiento: si la unidad no se recoloca, ha realizado Mantener posición.',
          en: 'The FAQ clarifies that a 0-inch Move or Run is not a move: if the Unit does not reposition, it has performed Hold instead.',
        },
        source: { document: 'faq', section: 'Measuring & Movement', printedPage: 2 },
      },
      {
        id: 'disengage',
        title: { es: 'Destrabarse', en: 'Disengage' },
        text: {
          es: 'Una unidad trabada puede salir del combate mediante un movimiento. Si la miniatura líder no puede salir del alcance enemigo, falla la acción: la unidad no se mueve y se retira la líder. Las demás miniaturas que no consigan salir también se retiran. Después no podrá Disparar ni Cargar en el Asalto siguiente, salvo que su suministro actual supere el suministro combinado de los enemigos con los que estaba trabada.',
          en: 'An Engaged Unit may move out of combat. If the Leading Model cannot leave Enemy Engagement Range, the action fails: the Unit does not move and that model is removed. Other models that cannot leave are also removed. It cannot make a Ranged Attack or Charge in the next Assault Phase unless its Current Supply exceeds the combined Supply of the enemies it was Engaged with.',
        },
        source: { section: '8.5.4', printedPage: 58 },
        termIds: ['engaged', 'unengaged', 'current-supply-value'],
      },
      {
        id: 'deploy',
        title: { es: 'Desplegar', en: 'Deploy' },
        text: {
          es: 'Comprobad que la unidad en reservas cabe en el suministro disponible. Entrad desde vuestro borde de entrada siguiendo las reglas de movimiento y colocad toda la unidad en coherencia. No puede terminar su activación en la zona de influencia enemiga.',
          en: 'Check that the Unit in Reserves fits within Available Supply. Enter from your Entry Edge under the movement rules and set the whole Unit In Coherency. It cannot end its activation inside the Enemy Zone of Influence.',
        },
        source: { section: '8.5.5', printedPage: 58 },
        termIds: ['reserves', 'entry-edge', 'available-supply'],
      },
      {
        id: 'movement-pass',
        title: { es: 'Cierre de Movimiento', en: 'End Movement' },
        text: {
          es: 'Quien pase primero recibe el marcador de primer jugador para Asalto. Colocad marcadores de Movimiento en las unidades amigas del campo que no se activaron.',
          en: 'The first player to Pass takes the First Player Marker for Assault. Give Movement-side markers to friendly on-table Units that did not activate.',
        },
        source: { section: '8.4.2', printedPage: 56 },
      },
    ],
  },
  {
    id: 'assault',
    title: { es: 'Fase 2 · Asalto', en: 'Phase 2 · Assault' },
    intro: {
      es: 'Las unidades desplegadas atacan a distancia, cargan o se recolocan.',
      en: 'Deployed Units shoot, charge or reposition.',
    },
    steps: [
      {
        id: 'assault-actions',
        title: { es: 'Activad y elegid', en: 'Activate and choose' },
        text: {
          es: 'Activad una unidad con marcador de Movimiento y escoged Disparar, Cargar, Correr o Mantener posición. Al terminar, girad el marcador a Asalto. Las unidades que siguen en reservas no actúan en esta fase.',
          en: 'Activate a Unit with a Movement-side marker and choose Ranged Attack, Charge, Run or Hold. Turn its marker to Assault after the action. Units still in Reserves cannot act in this phase.',
        },
        source: { section: '8.6.1', printedPage: 59 },
      },
      {
        id: 'run-or-hold',
        title: { es: 'Correr o mantener posición', en: 'Run or Hold' },
        text: {
          es: 'Correr permite a una unidad no trabada moverse siguiendo las reglas normales; Mantener posición consume su activación sin otra acción.',
          en: 'Run lets an Unengaged Unit move under the normal movement rules; Hold spends its activation without another action.',
        },
        source: { section: '8.7.1–8.7.2', printedPage: 60 },
      },
      {
        id: 'ranged-targets',
        title: { es: 'Elegid objetivos de disparo', en: 'Choose ranged targets' },
        text: {
          es: 'Comprobad alcance, visibilidad, tipo de objetivo del arma y estado de trabado. Las miniaturas que usen el mismo perfil de arma disparan al mismo objetivo. Si hay varios perfiles, declarad y resolved cada grupo de disparos por separado antes de elegir el siguiente objetivo.',
          en: 'Check Range, visibility, the weapon’s target type and engagement status. Models using the same weapon profile shoot the same target. With several profiles, declare and resolve each weapon Batch before choosing the next target.',
        },
        source: { section: '8.7.3', printedPage: 61 },
        termIds: ['visible', 'line-of-sight', 'batch'],
      },
      {
        id: 'attack-sequence',
        title: { es: 'Resolved cada ataque', en: 'Resolve each attack' },
        text: {
          es: 'Tirad para impactar según la cadencia y el valor de Impacto del arma. Los éxitos pasan a la reserva de Armadura; Surge puede enviar algunos directamente a Daño. El defensor salva con Armadura y, si tiene derecho, con Evasión. Los dados restantes causan daño según el arma y se retiran las bajas.',
          en: 'Roll the weapon’s Rate of Attack dice against its Hit value. Successes enter the Armour Pool; Surge may move some directly to the Damage Pool. The defender rolls Armour and, when eligible, Evade. Remaining dice deal the weapon’s Damage and casualties are removed.',
        },
        source: { section: '8.7.4', printedPage: 62 },
        termIds: ['hits', 'surge', 'evade-roll'],
      },
      {
        id: 'surge-evade-faq',
        title: { es: 'Surge y Evasión', en: 'Surge and Evade' },
        text: {
          es: 'La FAQ confirma que Evasión, cuando procede, también puede salvar dados enviados directamente a la reserva de Daño por Surge: Surge solo evita la tirada de Armadura.',
          en: 'The FAQ confirms that an eligible Evade Roll can also save dice moved directly to the Damage Pool by Surge: Surge bypasses only the Armour Roll.',
        },
        source: { document: 'faq', section: 'Attack Sequence', printedPage: 3 },
        termIds: ['surge', 'evade-roll'],
      },
      {
        id: 'charge',
        title: { es: 'Cargad contra enemigos terrestres', en: 'Charge Ground enemies' },
        text: {
          es: 'Una unidad terrestre no trabada declara todos sus objetivos terrestres antes de tirar. Su distancia de carga es Velocidad + 1D6. La miniatura líder debe poder terminar legalmente dentro del alcance de trabado de todos los objetivos declarados; si no puede, la unidad no se mueve y termina su activación.',
          en: 'An Unengaged Ground Unit declares all Ground targets before rolling. Its Charge distance is Speed + 1D6. The Leading Model must be able to finish legally within Engagement Range of every declared target; otherwise the Unit stays put and its activation ends.',
        },
        source: { section: '8.7.7', printedPage: 66 },
        termIds: ['engagement-range', 'leading-model'],
      },
      {
        id: 'assault-pass',
        title: { es: 'Cierre de Asalto', en: 'End Assault' },
        text: {
          es: 'Quien pase primero recibe el marcador de primer jugador para Combate. Marcad por la cara de Asalto las unidades que no se activaron.',
          en: 'The first player to Pass takes the First Player Marker for Combat. Give Assault-side markers to Units that did not activate.',
        },
        source: { section: '8.6.2', printedPage: 60 },
      },
    ],
  },
  {
    id: 'combat',
    title: { es: 'Fase 3 · Combate', en: 'Phase 3 · Combat' },
    intro: {
      es: 'Todas las unidades terrestres trabadas deben combatir; las voladoras nunca están trabadas.',
      en: 'Every Engaged Ground Unit must fight; Flying Units are never Engaged.',
    },
    steps: [
      {
        id: 'combat-eligibility',
        title: { es: 'Activación obligatoria', en: 'Mandatory activation' },
        text: {
          es: 'Los jugadores se alternan activando una unidad trabada cada vez. Solo esas unidades pueden actuar y deben hacerlo. Un jugador pasa únicamente cuando no le queda ninguna unidad trabada apta para activar.',
          en: 'Players alternate activating one Engaged Unit at a time. Only those Units can act, and they must do so. A player Passes only when no eligible Engaged Units remain.',
        },
        source: { section: '8.8', printedPage: 67 },
      },
      {
        id: 'close-ranks',
        title: { es: 'Cerrad filas si conviene', en: 'Close Ranks if useful' },
        text: {
          es: 'Antes de atacar, la unidad puede Cerrar filas. La miniatura líder se mueve hasta 3 pulgadas y debe quedar más cerca de los enemigos con los que ya estaba trabada; después se recoloca el resto en coherencia, sin entrar en combate con enemigos nuevos.',
          en: 'Before attacking, the Unit may Close Ranks. Its Leading Model moves up to 3 inches and must end closer to enemies it was already Engaged with; then reset the rest In Coherency without engaging new enemies.',
        },
        source: { section: '8.8.1', printedPage: 67 },
      },
      {
        id: 'combat-attack',
        title: { es: 'Determinad quién ataca', en: 'Determine who attacks' },
        text: {
          es: 'Atacan las miniaturas a 1 pulgada o menos del enemigo y las que tocan la base de una miniatura amiga que esté en esa primera fila. Usad solo armas de la fase de Combate y resolved el ataque con la secuencia de impactos, Armadura y Daño; la Evasión requiere una regla que la conceda contra ataques cuerpo a cuerpo.',
          en: 'Models within 1 inch of an Enemy, plus models touching a friendly model in that Fighting Rank, may attack. Use only Combat Phase weapons and resolve Hit, Armour and Damage as usual; Evade requires a rule granting it against Close Combat attacks.',
        },
        source: { section: '8.8.1', printedPage: 68 },
        termIds: ['fighting-rank', 'supporting-rank', 'evade-roll'],
      },
      {
        id: 'combat-after',
        title: { es: 'Comprobad el trabado restante', en: 'Check remaining engagement' },
        text: {
          es: 'Tras retirar las bajas, una unidad sin miniaturas a 1 pulgada o menos de un enemigo queda destrabada. Si aún no había actuado, deja de estar obligada a activarse en esta fase. Retirad el marcador de activación de cada unidad después de resolver su ataque.',
          en: 'After casualties, a Unit with no models within 1 inch of an Enemy becomes Unengaged. If it had not acted yet, it no longer has to activate this phase. Remove each Unit’s Activation Marker after resolving its attack.',
        },
        source: { section: '8.8–8.8.1', printedPage: 68 },
      },
    ],
  },
  {
    id: 'scoring-cleanup',
    title: { es: 'Fase 4 · Puntuación y limpieza', en: 'Phase 4 · Scoring & Cleanup' },
    intro: {
      es: 'Resolved los objetivos y los puntos, comprobad el final de partida y preparad la ronda siguiente.',
      en: 'Resolve objectives and points, check for the end of the game, then prepare the next round.',
    },
    steps: [
      {
        id: 'marker-eligibility',
        title: { es: 'Comprobad quién disputa cada marcador', en: 'Check who contests each marker' },
        text: {
          es: 'Una unidad del campo puede disputar un marcador si está en coherencia y alguna miniatura está a 3 pulgadas o menos, ve el marcador y comparte su elevación.',
          en: 'An on-table Unit may Contest a marker if it is In Coherency and at least one model is within 3 inches, can see the marker and shares its elevation.',
        },
        source: { section: '8.9.1', printedPage: 69 },
        termIds: ['mission-markers', 'unit-coherency', 'elevation-level'],
      },
      {
        id: 'marker-ineligible',
        title: { es: 'Excepciones al control', en: 'Control exceptions' },
        text: {
          es: 'Las unidades voladoras, enterradas o fuera de coherencia no pueden disputar ni controlar marcadores de misión con las reglas generales de control.',
          en: 'Flying, BURROWED or Out of Coherency Units cannot Contest or Control Mission Markers under the general control rules.',
        },
        source: { section: '8.9.1', printedPage: 71 },
        termIds: ['flying', 'burrowed', 'unit-coherency'],
      },
      {
        id: 'coherency-timing-faq',
        title: { es: 'Cuándo comprobar coherencia', en: 'When to check coherency' },
        text: {
          es: 'Para disputar objetivos, la FAQ aclara que la coherencia se comprueba al terminar un movimiento. Una unidad que superó su última comprobación sigue en coherencia aunque después sufra bajas.',
          en: 'For objective control, the FAQ clarifies that coherency is checked at the end of movement. A Unit that passed its last check remains In Coherency even if it later suffers casualties.',
        },
        source: { document: 'faq', section: 'Measuring & Movement', printedPage: 2 },
      },
      {
        id: 'marker-control',
        title: { es: 'Determinad el control', en: 'Determine control' },
        text: {
          es: 'Sumad el suministro actual de las unidades aptas de cada jugador: el total mayor controla el marcador. Una unidad apta de suministro 0 también puede controlarlo si ningún enemigo lo disputa. Cuando ambos jugadores lo disputan y empatan, no cambia de dueño. Una vez conquistado, conserva su control hasta que el rival lo reclame en una fase de Puntuación.',
          en: 'Add each player’s contesting Units’ Current Supply: the higher total Controls the marker. An eligible Unit with Supply 0 can still Control it if no enemy contests it. When both players contest with equal totals, ownership does not change. Once captured, it stays controlled until the opponent claims it in a Scoring Phase.',
        },
        source: { section: '8.9.1', printedPage: 69 },
        termIds: ['current-supply-value', 'mission-markers'],
      },
      {
        id: 'score-and-end',
        title: { es: 'Puntuad y comprobad el final', en: 'Score and check the end' },
        text: {
          es: 'Al inicio de la última fase de Puntuación, las unidades que sigan en reservas cuentan como destruidas. Ambos jugadores suman simultáneamente los puntos de victoria según la carta de misión. Comprobad después sus condiciones especiales de victoria, la eliminación total de un ejército y si terminó la última ronda; gana quien tenga más puntos y se aplica el desempate de la misión si existe.',
          en: 'At the start of the final Scoring Phase, Units still in Reserves count as Destroyed. Both players tally Victory Points simultaneously under the Mission Card. Then check special wins, total army elimination and the final round; the higher VP total wins, with the Mission Card’s tiebreaker if provided.',
        },
        source: { section: '8.9.2–8.10', printedPage: 72 },
        termIds: ['victory-points', 'reserves'],
      },
      {
        id: 'round-end-effects',
        title: { es: 'Resolved efectos de final de ronda', en: 'Resolve round-end effects' },
        text: {
          es: 'Resolved los efectos de «final de ronda». Si ambos jugadores tienen efectos, comienza quien tiene el marcador de primer jugador; cada jugador elige el orden de sus propios efectos.',
          en: 'Resolve “End of the Round” effects. If both players have effects, the First Player Marker holder starts; each player chooses the order of their own effects.',
        },
        source: { section: '8.9.4', printedPage: 72 },
      },
      {
        id: 'cleanup',
        title: { es: 'Limpiad y recuperad cartas', en: 'Cleanup and refresh cards' },
        text: {
          es: 'Retirad fichas y marcadores, excepto los permanentes, los de Daño, los de misión y los indicadores de facción que muestran control. Volved a poner boca arriba las cartas tácticas y de facción agotadas.',
          en: 'Remove tokens and markers except those with STAY IN PLAY, Damage Markers, Mission Markers and Faction Indicators showing control. Turn Exhausted Tactical and Faction Cards face-up again.',
        },
        source: { section: '8.9.5', printedPage: 72 },
      },
      {
        id: 'next-round-initiative',
        title: { es: 'Preparad la siguiente ronda', en: 'Prepare the next round' },
        text: {
          es: 'El jugador con menos puntos de victoria recibe el marcador de primer jugador. Si hay empate, una tirada enfrentada decide quién lo recibe. Comenzad la fase de Movimiento de la nueva ronda.',
          en: 'The player with fewer Victory Points receives the First Player Marker. On a tie, a roll-off decides who takes it. Begin the next round’s Movement Phase.',
        },
        source: { section: '8.9.6', printedPage: 72 },
      },
    ],
  },
];
