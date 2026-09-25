/** Expanded, independently paraphrased rule explanations for the first glossary group. */
export const GAME_TERM_DETAILS_A: Record<string, { es: readonly string[]; en: readonly string[] }> = {
  'access-point': {
    es: [
      'Un Punto de Acceso es la parte de un elemento de terreno que comunica dos niveles de elevación. Una miniatura terrestre puede cambiar de nivel si su recorrido atraviesa esa conexión.',
      'También permite enlazar la Coherencia de miniaturas en niveles distintos. La FAQ aclara que, tras mover a la Miniatura Líder, las demás pueden colocarse en terreno elevado mediante ese enlace sin realizar otra acción de Movimiento.',
    ],
    en: [
      'An Access Point is the part of a terrain feature connecting two elevation levels. A Ground model can change elevation when its movement path uses that connection.',
      'It also lets Coherency Links connect models on different levels. The FAQ clarifies that, after moving the Leading Model, the other models may be set on High Ground through such a link without a separate Move action.',
    ],
  },
  'active-player': {
    es: [
      'Es el jugador cuyo turno de actuar se está resolviendo en ese momento. El papel cambia conforme los jugadores alternan sus activaciones durante una fase.',
      'No equivale necesariamente a ser quien tiene el Marcador de Primer Jugador: ese marcador decide quién comienza la fase y puede cambiar de dueño según las reglas de Pasar y de final de ronda.',
    ],
    en: [
      'The Active Player is the player whose turn to act is currently being resolved. This role changes as players alternate activations within a phase.',
      'It is not necessarily the holder of the First Player Marker. That marker determines who starts a phase and can change hands through Passing or end-of-round rules.',
    ],
  },
  'anti-evade': {
    es: [
      'Al resolver un ataque con esta arma contra una unidad enemiga, su tirada de Evasión recibe un modificador de −X durante ese ataque.',
      'La FAQ aclara que la penalización no elimina la tirada: ningún modificador puede empeorar su valor objetivo más allá de 6+ ni mejorarlo por debajo de 2+.',
    ],
    en: [
      'When this weapon attacks an Enemy Unit, apply a −X modifier to that Unit’s Evade roll for this attack.',
      'The FAQ clarifies that the penalty never removes the roll: modifiers cannot make its target number worse than 6+ or better than 2+.',
    ],
  },
  'army-slot': {
    es: [
      'Cada espacio de ejército pertenece a un tipo: Básica, Élite, Apoyo, Aérea o Héroe. Al crear la lista, una unidad consume espacios de su tipo iguales a su Valor de Suministro inicial.',
      'La Carta de Facción aporta los espacios iniciales. Pueden añadirse otros al comprar Cartas Tácticas con gas vespeno durante la creación del ejército.',
      'Los espacios que sobren se pierden; no se cambian por otro tipo ni se reservan para más tarde.',
    ],
    en: [
      'Each Army Slot has a type: Core, Elite, Support, Air or Hero. During army building, a Unit uses a number of slots of its own type equal to its starting Supply Value.',
      'The Faction Card supplies the initial slots. Buying Tactical Cards with Vespene Gas during army building can unlock more.',
      'Unused slots are lost; they cannot be exchanged for another type or saved for later.',
    ],
  },
  'available-supply': {
    es: [
      'Es el Suministro que queda libre: Reserva de Suministro actual menos la suma del Suministro Actual de todas tus unidades presentes en el campo de batalla.',
      'Solo puedes desplegar una unidad desde Reservas si su Suministro Actual cabe en esa cantidad; el total desplegado nunca puede superar la Reserva. Las bajas o la destrucción de unidades liberan capacidad.',
      'Durante la última ronda, la Reserva de Suministro pasa a ser ilimitada y deja de restringir el despliegue.',
    ],
    en: [
      'Available Supply is the unused capacity: the current Supply Pool minus the combined Current Supply Values of your Friendly Units on the battlefield.',
      'A Unit in Reserves can deploy only if its Current Supply fits in that capacity; the deployed total cannot exceed the pool. Casualties and destroyed Units free capacity.',
      'In the final Round, the Supply Pool becomes unlimited, so this deployment limit no longer applies.',
    ],
  },
  'blocking-terrain': {
    es: [
      'Es cualquier elemento de terreno cuyo Tamaño Efectivo sea 1 o superior. Puede interrumpir la Línea de Visión cuando satisface las condiciones de Cobertura Completa o Directa.',
      'La clasificación como bloqueante no decide por sí sola si se puede atravesar. El movimiento se resuelve aparte según tamaño, Puntos de Acceso, espacio de paso y reglas propias del terreno.',
    ],
    en: [
      'Any terrain feature with Effective Size 1 or more is Blocking Terrain. It may interrupt Line of Sight when the Full or Direct Cover conditions are met.',
      'Being blocking does not by itself decide whether models can cross it. Movement is checked separately using terrain Size, Access Points, gap clearance and terrain keywords.',
    ],
  },
  buff: {
    es: [
      'BUFF [Característica] (X) mejora la característica indicada hasta el final de la ronda. En valores objetivo, como Armadura o Impactar, reduce el número requerido en X; en valores numéricos, como Velocidad o Cadencia de Ataque, lo aumenta.',
      'Obtener la misma keyword varias veces no suma sus efectos; si sus valores difieren se usa el mayor. La FAQ distingue los modificadores planos de fuentes distintas, que sí pueden acumularse con un BUFF cuando no comparten esa keyword.',
    ],
    en: [
      'BUFF [Characteristic] (X) improves the named characteristic until the end of the Round. For target numbers such as Armour or Hit it lowers the required number by X; for numerical values such as Speed or RoA it adds X.',
      'Repeated copies of the same keyword do not add together; use the highest numeric value. The FAQ distinguishes flat modifiers from differently named sources, which may stack with a BUFF when they do not share that keyword.',
    ],
  },
  bulky: {
    es: [
      'Un arma BULKY no puede utilizarse para efectuar un Ataque a Distancia mientras la unidad que la lleva esté Trabada.',
      'La restricción depende del estado de la unidad atacante, no del objetivo. Otras armas de la unidad se resuelven conforme a sus propias reglas y a las limitaciones generales del combate.',
    ],
    en: [
      'A BULKY weapon cannot make a Ranged Attack while its own Unit is Engaged.',
      'The restriction depends on the attacking Unit, not its target. Any other weapons still follow their own rules and the general engagement restrictions.',
    ],
  },
  burrowed: {
    es: [
      'BURROWED es un estado. Al adquirirlo la unidad también gana HIDDEN, lo recupera al comienzo de cada ronda mientras siga enterrada y pierde HIDDEN cuando se retira BURROWED. Su Tamaño se considera 0 a todos los efectos y su Suministro Actual cuenta como 0 para las comprobaciones de Destrabarse.',
      'Mientras está BURROWED solo puede realizar Desplegar, Mover, Destrabarse, Correr, Mantener la Posición y Cerrar Filas. Cualquiera de esas acciones excepto Mantener la Posición retira BURROWED de inmediato. Puede usar Habilidades Especiales salvo indicación contraria y tirar Evasión contra cada ataque que la tenga como objetivo.',
      'No puede controlar ni disputar Marcadores de Misión. La FAQ precisa que en Artefact Hunt sí puede reclamar un marcador ya controlado, porque reclamarlo es distinto de controlarlo o disputarlo.',
      'Otras miniaturas pueden atravesar sus miniaturas, pero no terminar dentro del Alcance de Enfrentamiento de la unidad BURROWED.',
      'Si comienza la Fase de Combate Trabada, debe activarse. No puede atacar mientras conserve BURROWED: primero puede Cerrar Filas, lo que retira el estado y le permite completar el ataque cuerpo a cuerpo; si no puede o no lo hace, no ataca. Los enemigos Trabados con ella sí pueden atacarla normalmente.',
    ],
    en: [
      'BURROWED is a Status. Gaining it also grants HIDDEN; a still-burrowed Unit gains HIDDEN again at each Round start and loses HIDDEN when BURROWED is removed. Treat its Size as 0 for all purposes and its Current Supply as 0 for Disengage checks.',
      'While BURROWED, it may only Deploy, Move, Disengage, Run, Hold or Close Ranks. Any of these except Hold immediately removes BURROWED. It may use Special Abilities unless stated otherwise and may Evade every attack targeting it.',
      'It cannot Control or Contest Mission Markers. The FAQ clarifies that in Artefact Hunt it may still claim a marker already controlled, because claiming is distinct from controlling or contesting.',
      'Other models may pass through its models, but cannot finish within the BURROWED Unit’s Engagement Range.',
      'If it starts the Combat Phase Engaged, it must activate. It cannot attack while still BURROWED: it may Close Ranks first, lose the Status and finish the Close Combat Attack; if it cannot or does not Close Ranks, it makes no attack. Engaged enemies may attack it normally.',
    ],
  },
  'burst-fire': {
    es: [
      'Al hacer un Ataque a Distancia, comprueba si el objetivo está a Y pulgadas o menos de cada miniatura que utiliza esta arma.',
      'Cada miniatura que cumple esa distancia aumenta en X la Cadencia de Ataque de esta arma para ese ataque; la bonificación no se aplica a las que quedan fuera de Y pulgadas.',
    ],
    en: [
      'During a Ranged Attack, check whether the target is within Y inches of each model using this weapon.',
      'For that attack, each qualifying model adds X to this weapon’s Rate of Attack; models outside Y inches do not receive the bonus.',
    ],
  },
  'combat-tags': {
    es: [
      'Son descriptores impresos en la Carta de Unidad. Incluyen Armoured, Biological, Light, Mechanical, Psionic, Flying y Ground.',
      'Sirven para determinar objetivos válidos, activar el tipo de Surge de un arma y aplicar bonificaciones o habilidades condicionadas a una etiqueta concreta.',
      'La etiqueta Ground indica una clase de combate y no equivale a estar en GROUND LEVEL. Una unidad Flying puede tener su peana sobre el tapete sin adquirir por ello la etiqueta Ground.',
    ],
    en: [
      'Combat Tags are descriptors on a Unit Card: Armoured, Biological, Light, Mechanical, Psionic, Flying and Ground.',
      'They determine eligible targets, whether a weapon’s Surge type applies, and whether tag-dependent bonuses or abilities work.',
      'The Ground tag is a combat classification, not the GROUND LEVEL elevation. A Flying Unit may have its base on the playmat without gaining the Ground tag.',
    ],
  },
  'concentrated-fire': {
    es: [
      'Un ataque con esta arma puede retirar como bajas un máximo de X miniaturas, aunque su daño alcanzara para destruir más.',
      'Cuando se llega a ese máximo, todo el Daño Total sobrante se descarta: no queda anotado en un Marcador de Daño ni se arrastra al siguiente ataque.',
    ],
    en: [
      'An attack with this weapon may remove at most X models as casualties, even if its damage would otherwise destroy more.',
      'After reaching that cap, discard all leftover Total Damage. It is neither recorded on a Damage Marker nor carried into another attack.',
    ],
  },
  'controlling-player': {
    es: [
      'Es quien dirige actualmente una unidad, miniatura o ficha, elige sus decisiones y realiza sus tiradas.',
      'Una habilidad puede transferir el control. Desde ese momento el nuevo controlador actúa con ella como si fuera propia a efectos de las decisiones y reglas pertinentes.',
    ],
    en: [
      'The Controlling Player currently commands the Unit, model or Token, makes its decisions and rolls its dice.',
      'An ability can transfer control. The new controller then handles that piece as their own for the relevant decisions and rules.',
    ],
  },
  'critical-hit': {
    es: [
      'CRITICAL HIT (X) traslada hasta X dados desde la Reserva de Armadura directamente a la Reserva de Daño y evita la Tirada de Armadura para ellos. Nunca puede trasladar más dados que los presentes.',
      'La keyword actúa sobre el lote de dados generado por el arma, no una vez por cada miniatura atacante. La FAQ confirma que sus efectos no se trasladan a lotes separados de Spillover.',
    ],
    en: [
      'CRITICAL HIT (X) moves up to X dice straight from the Armour Pool into the Damage Pool, skipping their Armour rolls. It cannot move more dice than the pool contains.',
      'The keyword applies to the weapon’s combined dice batch, not once per attacking model. The FAQ confirms that its effect does not carry into separate Spillover batches.',
    ],
  },
  'current-supply-value': {
    es: [
      'Es el valor que indica el Perfil de Suministro para la cantidad de miniaturas que conserva la unidad. Se actualiza inmediatamente cuando las bajas la hacen pasar a un tramo inferior.',
      'Se utiliza para comprobar despliegues desde Reservas, capacidad disponible, control de Marcadores de Misión, Masa Táctica al Destrabarse y condiciones de puntuación basadas en Suministro.',
      'La FAQ confirma que perder Suministro Actual concede al rival los PV correspondientes incluso si la pérdida se debe a una transformación MORPH.',
    ],
    en: [
      'Read this value from the Unit’s Supply Profile using its current model count. Update it immediately when casualties move the Unit into a lower bracket.',
      'It is used for deployment from Reserves, available capacity, Mission Marker control, Tactical Mass when Disengaging, and Supply-based scoring.',
      'The FAQ confirms that losing Current Supply awards the corresponding VPs to the opponent even when the loss occurs during a MORPH.',
    ],
  },
  debuff: {
    es: [
      'DEBUFF [Característica] (X) empeora la característica indicada hasta el final de la ronda. Aumenta en X los valores objetivo y reduce en X los valores numéricos, sin bajar estos últimos de 0.',
      'Las copias repetidas de la misma keyword no se suman; si aparecen distintos valores numéricos, se aplica el mayor.',
    ],
    en: [
      'DEBUFF [Characteristic] (X) worsens the named characteristic until the Round ends. It raises target numbers by X and reduces numerical values by X, never below 0.',
      'Repeated copies of the same keyword do not add together; if their numeric values differ, apply the highest one.',
    ],
  },
  displacement: {
    es: [
      'DISPLACEMENT permite que la Miniatura Líder termine solapando la ficha o unidad que lo posee, como excepción a la prohibición habitual de solaparse.',
      'Se aplica al final de Mover, Desplegar, Correr, Cargar, Destrabarse, Cerrar Filas o un movimiento de Habilidad Especial. El controlador de la Miniatura Líder recoloca inmediatamente el elemento solapado en contacto de peanas con ella o, si eso no cabe, lo más cerca posible.',
    ],
    en: [
      'DISPLACEMENT lets the Leading Model finish overlapping the Token or Unit that has this rule, as an exception to the normal overlap restriction.',
      'It applies after Move, Deploy, Run, Charge, Disengage, Close Ranks or a Special Ability movement. The Leading Model’s controller immediately sets the overlapped piece in base contact with it or, if that is impossible, as close as possible.',
    ],
  },
  dodge: {
    es: [
      'Cuando esta unidad recibe un ataque, DODGE (X) reduce en X, hasta un mínimo de 0, los dados que Surge o CRITICAL HIT pasarían de la Reserva de Armadura a la de Daño.',
      'Aplica esta reducción durante el paso de resolución de Surge. Los dados que no se trasladan permanecen sujetos a la resolución de Armadura correspondiente.',
    ],
    en: [
      'When this Unit is attacked, DODGE (X) reduces by X, to a minimum of 0, the dice that Surge or CRITICAL HIT would move from the Armour Pool to the Damage Pool.',
      'Apply the reduction during the Resolve Surge step. Dice not moved remain to be resolved through Armour as appropriate.',
    ],
  },
  'effective-size': {
    es: [
      'El Tamaño Efectivo de una miniatura es su propio Tamaño más el del terreno sobre el que descansa. A Nivel del Suelo solo cuenta su Tamaño; en nivel Medio o Alto suma también el del elemento de terreno.',
      'Si hay terrenos apilados, sus tamaños se suman del mismo modo. La Cobertura Completa y Directa comparan los Tamaños Efectivos para decidir si un elemento interrumpe la Línea de Visión.',
      'Para esas comprobaciones de cobertura se considera que una miniatura Flying tiene un Tamaño Efectivo superior al de cualquier terreno de la mesa; no suma el tamaño del terreno bajo ella.',
    ],
    en: [
      'A model’s Effective Size is its own Size plus the Size of terrain beneath it. At Ground Level only the model’s Size counts; on Mid or High Ground, add the terrain’s Size.',
      'Terrain stacked on other terrain adds Sizes in the same way. Full and Direct Cover compare Effective Sizes to decide whether a feature interrupts Line of Sight.',
      'For cover checks a Flying model is treated as having Effective Size above every terrain feature on the table; terrain beneath it does not add to its Size.',
    ],
  },
  'elevation-level': {
    es: [
      'Hay tres niveles: GROUND LEVEL si la peana está directamente sobre el tapete; MID GROUND sobre una superficie horizontal de terreno de Tamaño 1–2; HIGH GROUND sobre una de Tamaño 3 o superior.',
      'La posición de la peana determina el nivel. Si ocupa más de uno, se considera en el más alto. El nivel influye en movimiento, trabamiento, cobertura y algunas plantillas.',
    ],
    en: [
      'There are three levels: GROUND LEVEL for a base directly on the playmat, MID GROUND on horizontal Size 1–2 terrain, and HIGH GROUND on horizontal Size 3+ terrain.',
      'The base determines the level. If it spans several, use the highest. Elevation affects movement, Engagement, cover and some templates.',
    ],
  },
  enemy: {
    es: [
      'Son enemigas las unidades, fichas y cartas del jugador contrario; en partidas por equipos, también las de todos los jugadores del equipo rival.',
      'Una unidad no puede elegir una unidad amiga como objetivo de un ataque salvo permiso expreso. La condición de enemiga se usa además para trabamiento y disputa de objetivos.',
    ],
    en: [
      'An opponent’s Units, Tokens and cards are Enemies; in team games this includes those of every opposing teammate.',
      'A Unit cannot target a Friendly Unit with an attack unless a rule explicitly permits it. Enemy status also matters for Engagement and contesting objectives.',
    ],
  },
  engaged: {
    es: [
      'Una unidad Ground queda Trabada si al menos una de sus miniaturas está a 1 pulgada o menos de una miniatura Ground enemiga, siempre que el terreno y los niveles permitan el enfrentamiento. Toda la unidad se considera Trabada aunque solo una miniatura cumpla la condición.',
      'Las unidades Flying nunca se traban. Un terreno de Tamaño 2 o superior entre miniaturas impide el trabamiento; tampoco pueden trabarse directamente una miniatura en HIGH GROUND y otra en GROUND LEVEL.',
      'Una unidad Trabada no puede hacer un Movimiento normal: debe Destrabarse o Mantener la Posición. También se aplican las restricciones pertinentes a los Ataques a Distancia.',
    ],
    en: [
      'A Ground Unit becomes Engaged when at least one of its models is within 1 inch of an Enemy Ground model and terrain and elevation permit contact. The entire Unit is Engaged even if only one model meets the condition.',
      'Flying Units never become Engaged. Size 2+ terrain between the models prevents Engagement; a High Ground model also cannot directly Engage one at Ground Level.',
      'An Engaged Unit cannot make a standard Move: it must Disengage or Hold. The relevant Ranged Attack restrictions also apply.',
    ],
  },
  'engagement-range': {
    es: [
      'El Alcance de Enfrentamiento se extiende 1 pulgada horizontalmente desde el borde de la peana de cada miniatura. Se mide visto desde arriba, sin añadir la diferencia vertical.',
      'Dos miniaturas Ground enemigas dentro de ese alcance pueden estar Trabadas si las reglas de terreno y elevación no lo impiden. Un arma de Combate con alcance E solo puede golpear objetivos en ese alcance.',
      'Este límite también se comprueba en movimiento, Carga, Destrabarse, Cerrar Filas y algunos efectos PLACE.',
    ],
    en: [
      'Engagement Range extends 1 inch horizontally from a model’s base. Measure it from above without adding vertical distance.',
      'Enemy Ground models within that distance can be Engaged if terrain and elevation allow it. A Combat weapon with Range E can strike only targets within Engagement Range.',
      'The same distance matters for movement, Charge, Disengage, Close Ranks and some PLACE effects.',
    ],
  },
  'entry-edge': {
    es: [
      'Es el borde de la mesa asignado a un jugador por su Carta de Despliegue. Por él entran normalmente las unidades que despliegan desde Reservas.',
      'La FAQ permite desplegar directamente sobre HIGH GROUND cuando el elemento toca físicamente ese Borde de Entrada, manteniendo las exigencias habituales de colocación y Coherencia.',
      'Algunas habilidades convierten un Omega Worm o la peana de un Pylon en un Borde de Entrada amigo adicional; la FAQ aclara que no generan una nueva Zona de Influencia. Un transporte o despliegue avanzado que solo permita colocar sin borde no crea un Borde de Entrada.',
    ],
    en: [
      'This is the table edge assigned by a player’s Deployment Card. Units normally enter from it when deploying out of Reserves.',
      'The FAQ allows direct deployment onto High Ground if that terrain physically touches the Entry Edge, while all normal placement and Coherency requirements remain.',
      'Some abilities turn an Omega Worm or Pylon base into an additional Friendly Entry Edge; the FAQ says they create no new Zone of Influence. A transport or forward deployment effect that merely allows placement without an edge does not create one.',
    ],
  },
  'faction-tags': {
    es: [
      'Las Etiquetas de Facción indican la raza (Terran, Zerg o Protoss) y, cuando corresponde, una subfacción concreta. Se imprimen en las Cartas de Unidad, Tácticas y de Facción.',
      'Al construir el ejército, todas las etiquetas de cada unidad y Carta Táctica elegida deben aparecer en la Carta de Facción. Si falta una sola, la elección no es válida; una carta con menos etiquetas sí se permite.',
    ],
    en: [
      'Faction Tags name a race (Terran, Zerg or Protoss) and, where applicable, a specific subfaction. They appear on Unit, Tactical and Faction Cards.',
      'During army building, every tag on each chosen Unit or Tactical Card must also appear on the Faction Card. One missing tag makes the choice illegal; having fewer tags than the Faction Card is allowed.',
    ],
  },
  'fighting-rank': {
    es: [
      'Una miniatura pertenece a la Fila de Combate si está dentro del Alcance de Enfrentamiento de una miniatura enemiga.',
      'Las miniaturas de esta fila pueden atacar con sus armas de la Fase de Combate al resolver el ataque cuerpo a cuerpo. La Fila de Apoyo se determina por separado y también puede contar para IMPACT.',
    ],
    en: [
      'A model is in the Fighting Rank when it lies within an Enemy model’s Engagement Range.',
      'Models in this rank may strike with Combat Phase weapons during a Close Combat Attack. The Supporting Rank is checked separately and can also contribute to IMPACT.',
    ],
  },
  'first-player-marker': {
    es: [
      'Al comenzar la partida, el ganador de la tirada inicial asigna el Marcador de Primer Jugador a uno de los dos jugadores. Quien lo posee elige quién se activa primero al inicio de cada fase.',
      'En las Fases 1 y 2, el primero que Pasa toma el marcador para la fase siguiente. Tras la Fase 4 se entrega a quien tenga menos Puntos de Victoria; si hay empate, una tirada enfrentada decide quién lo obtiene.',
      'La FAQ añade que, si ambos jugadores quieren reaccionar al mismo desencadenante fuera de una activación, la reacción del poseedor del marcador se resuelve primero.',
    ],
    en: [
      'At game start, the initial roll-off winner assigns the First Player Marker to either player. Its holder chooses who activates first at the beginning of each Phase.',
      'In Phases 1 and 2, the first player to Pass takes it for the next Phase. After Phase 4 it goes to the player with fewer Victory Points; a roll-off breaks a tie.',
      'The FAQ adds that if both players react to the same trigger outside an activation, the marker holder resolves their reaction first.',
    ],
  },
  flying: {
    es: [
      'Al mover, una unidad Flying ignora el terreno y los niveles: la Miniatura Líder se desplaza de punto a punto midiendo horizontalmente. Sus miniaturas pueden atravesar las peanas de otras miniaturas y viceversa, pero la unidad debe terminar a 1 pulgada o más de las Flying enemigas.',
      'Nunca queda Trabada, no puede Cargar ni ser cargada y no participa en la Fase de Combate. Tampoco controla ni disputa Marcadores de Misión. La FAQ precisa que en Artefact Hunt sí puede reclamar un marcador controlado.',
      'En cobertura ignora Cobertura Completa y se considera más alta que cualquier terreno; todavía se comprueban Cobertura Directa y Zona Muerta de Elevación. No obtiene la cobertura propia de HIGH GROUND.',
      'No utiliza Puntos de Acceso ni suma el terreno a su Tamaño Efectivo. Sobrevuela la hierba sin destruirla, pero si alguna miniatura termina sobre ella, la hierba se retira.',
    ],
    en: [
      'During movement, a Flying Unit ignores terrain and elevation: its Leading Model moves point to point using horizontal distance. Flying bases may pass through other models and vice versa, but the Unit must end at least 1 inch from Enemy Flying Units.',
      'It is never Engaged, cannot Charge or be Charged, and does not fight in the Combat Phase. It also cannot Control or Contest Mission Markers. The FAQ clarifies that it may still claim a controlled marker in Artefact Hunt.',
      'For cover it ignores Full Cover and counts as higher than any terrain, but Direct Cover and the Elevation Dead Zone still apply. It does not gain High Ground cover.',
      'It does not use Access Points or add terrain to its Effective Size. Flying over Grass leaves it intact, but ending any model on Grass removes that feature.',
    ],
  },
  friendly: {
    es: [
      'Son amigas entre sí las unidades, fichas y cartas del mismo jugador controlador; en una partida por equipos también lo son las de sus compañeros. Las miniaturas de una unidad siempre son amigas de ella.',
      'La relación determina objetivos válidos, interacciones de movimiento y a quién pueden beneficiar algunas habilidades. Salvo regla expresa, una unidad no puede atacar a otra amiga.',
    ],
    en: [
      'Units, Tokens and cards belonging to the same Controlling Player are Friendly to one another; teammates’ pieces also count in team games. A Unit’s own models are always Friendly to it.',
      'This relationship controls valid targets, movement interactions and eligibility for some abilities. Unless a rule expressly allows it, a Unit cannot attack another Friendly Unit.',
    ],
  },
  grass: {
    es: [
      'Grass es un terreno de Tamaño 2 que bloquea Línea de Visión conforme a las reglas normales de cobertura, pero puede atravesarse pese a su tamaño.',
      'Se retira de la partida inmediatamente si el recorrido de la Miniatura Líder lo atraviesa o si cualquier miniatura de la unidad acaba sobre él durante Mover, Desplegar, Correr, Cargar, Destrabarse o Cerrar Filas. No vuelve durante la limpieza.',
      'Una unidad Flying que pasa por encima no lo retira; sí lo hace si alguna de sus miniaturas acaba encima.',
    ],
    en: [
      'Grass is Size 2 terrain that blocks Line of Sight under the normal cover rules, yet can be crossed despite its Size.',
      'Remove it immediately if the Leading Model’s path passes through it or any model finishes on it during Move, Deploy, Run, Charge, Disengage or Close Ranks. Cleanup does not restore it.',
      'A Flying Unit passing above does not remove Grass; ending any of its models on the feature does.',
    ],
  },
  'ground-level': {
    es: [
      'Una miniatura está en GROUND LEVEL cuando su peana descansa directamente sobre el tapete. En ese nivel su Tamaño Efectivo coincide con su Tamaño propio.',
      'No puede trabarse directamente con miniaturas en HIGH GROUND. Para trabarse con una de MID GROUND, ambas deben estar junto al mismo Punto de Acceso que une sus niveles.',
      'GROUND LEVEL designa una elevación; no concede por sí mismo la Etiqueta de Combate Ground.',
    ],
    en: [
      'A model is at GROUND LEVEL when its base rests directly on the playmat. Its Effective Size there is simply its own Size.',
      'It cannot directly Engage a model on HIGH GROUND. To Engage one on MID GROUND, both models must be adjacent to the same Access Point connecting their levels.',
      'GROUND LEVEL names an elevation; it does not itself grant the Ground Combat Tag.',
    ],
  },
  heal: {
    es: [
      'HEAL (X) retira hasta X puntos de daño acumulado de una unidad y ajusta en consecuencia su Marcador de Daño.',
      'No devuelve miniaturas destruidas; para eso hace falta una regla como RESPAWN. La FAQ confirma que los puntos de vida del Escudo sumados a la primera miniatura sí pueden curarse con normalidad.',
    ],
    en: [
      'HEAL (X) removes up to X points of accumulated Damage from a Unit and adjusts its Damage Marker accordingly.',
      'It does not return destroyed models; a rule such as RESPAWN is needed for that. The FAQ confirms that lost Shield HP added to the first model can be healed normally.',
    ],
  },
  hidden: {
    es: [
      'HIDDEN es un estado. Una unidad con él no puede elegirse como objetivo de un Ataque a Distancia ni de una Habilidad Especial que requiera Línea de Visión, salvo que la miniatura que actúa esté a 4 pulgadas o menos.',
      'Es inmune a IMPACT y puede tirar Evasión contra cada ataque que la tenga como objetivo. La FAQ aclara que la Evasión se resuelve contra la Reserva de Daño final, incluidos los dados procedentes de Surge.',
      'La FAQ distingue las habilidades de detección que apuntan a una posición y crean un área: pueden afectar a una unidad HIDDEN desde más de 4 pulgadas porque no la seleccionan directamente como objetivo.',
    ],
    en: [
      'HIDDEN is a Status. The Unit cannot be selected for a Ranged Attack or a Line-of-Sight-dependent Special Ability unless the acting model is within 4 inches.',
      'It is immune to IMPACT and may Evade every attack targeting it. The FAQ clarifies that Evade applies to the final Damage Pool, including dice moved there by Surge.',
      'The FAQ distinguishes detection abilities aimed at a location to create an area: they may affect a HIDDEN Unit from more than 4 inches because they do not directly select it as the target.',
    ],
  },
  'high-ground': {
    es: [
      'Una miniatura ocupa HIGH GROUND si su peana está sobre una superficie horizontal de terreno de Tamaño 3 o mayor. Su Tamaño Efectivo suma el Tamaño propio y el del terreno.',
      'No puede trabarse directamente con miniaturas en GROUND LEVEL. Para trabarse con una de MID GROUND, ambas deben situarse junto al mismo Punto de Acceso que comunica ambos niveles.',
      'La FAQ aclara que un Borde de Entrada que toca ese terreno permite desplegar allí legalmente. Si la peana no cabe, aplica Wobbly Model Syndrome: el centro debe quedar sobre el terreno y el saliente se limita a lo imprescindible.',
      'Para comprobar espacio de paso, el borde de HIGH GROUND se trata como Terreno Infranqueable; las unidades terrestres tampoco pueden pasar directamente entre dos alturas no conectadas.',
    ],
    en: [
      'A model occupies HIGH GROUND when its base is on a horizontal terrain surface of Size 3 or more. Its Effective Size adds its own Size to the terrain’s.',
      'It cannot directly Engage a model at GROUND LEVEL. To Engage one on MID GROUND, both must be next to the same Access Point connecting the levels.',
      'The FAQ clarifies that deployment there is legal if an Entry Edge touches the feature. If a base cannot fit, use Wobbly Model Syndrome: its centre remains on the feature and it overhangs only as much as needed.',
      'For gap clearance, treat the High Ground edge as Impassable Terrain; Ground Units also cannot move straight between unconnected elevated areas.',
    ],
  },
  hits: {
    es: [
      'HITS X (Y) inflige X impactos automáticos a la unidad afectada: coloca X dados directamente en la Reserva de Armadura y pasa a resolver las Tiradas de Armadura.',
      'Cada impacto usa Y como valor de Daño. No hay Tirada de Impactar para generarlos ni pueden producir Surge.',
    ],
    en: [
      'HITS X (Y) deals X automatic hits to the affected Unit: put X dice straight into the Armour Pool and proceed to Armour rolls.',
      'Each hit uses Y as its Damage value. They do not require a Hit roll and cannot generate Surge.',
    ],
  },
  impact: {
    es: [
      'Inmediatamente después de que la unidad complete una Carga con éxito, cada miniatura apta en la Fila de Combate o de Apoyo genera X dados de IMPACT.',
      'Si esa miniatura está frente a varios enemigos, su controlador puede distribuir esos dados entre ellos. Tira por separado los dados asignados a cada unidad objetivo.',
      'Cada resultado de Y+ coloca un dado en la Reserva de Armadura del objetivo. Resuelve la Armadura directamente; estos impactos hacen Daño 1 y no generan Surge. Una unidad HIDDEN es inmune a IMPACT.',
    ],
    en: [
      'Immediately after a successful Charge, each eligible model in the Fighting or Supporting Rank generates X IMPACT dice.',
      'If the model faces several Enemy Units, its controller may divide those dice between them. Roll the allocated dice separately for each target Unit.',
      'Each Y+ result adds one die to that target’s Armour Pool. Resolve Armour directly; these hits have Damage 1 and no Surge. A HIDDEN Unit is immune to IMPACT.',
    ],
  },
  'impassable-terrain': {
    es: [
      'Un terreno es IMPASSABLE si no dispone de un Punto de Acceso que lo conecte con una elevación adyacente. Las miniaturas no pueden mover a través, sobre o por encima de él ni terminar su movimiento solapándolo.',
      'La restricción debe distinguirse de los elementos normales de Tamaño 0 o 1, que sí pueden atravesarse. Las excepciones de movimiento impresas en una unidad se aplican según su propio texto; la FAQ aclara que atravesar unidades enemigas no autoriza a cruzar terreno como Force Field.',
    ],
    en: [
      'Terrain is IMPASSABLE when it has no Access Point linking it to an adjacent elevation. Models cannot move through, onto or across it, or finish a movement overlapping it.',
      'This differs from ordinary Size 0 or 1 terrain, which models may cross. A Unit’s printed movement exceptions apply according to their own wording; the FAQ clarifies that permission to pass through Enemy Units does not allow crossing terrain such as Force Field.',
    ],
  },
  'indirect-fire': {
    es: [
      'Esta arma puede seleccionar y dañar un objetivo mediante un Ataque a Distancia sin Línea de Visión, pero el objetivo debe seguir dentro de su Alcance.',
      'Si la unidad objetivo no es visible, obtiene una tirada de Evasión contra ese ataque. La FAQ aclara que, si al menos una de sus miniaturas es visible, la unidad se considera visible y no obtiene esa Evasión adicional; aun así, sus miniaturas no visibles pueden retirarse como bajas.',
    ],
    en: [
      'This weapon may select and damage a target with a Ranged Attack without Line of Sight, but the target must still be within Range.',
      'If the target Unit is out of sight, it gains an Evade roll against the attack. The FAQ clarifies that seeing even one of its models makes the Unit visible, so this extra Evade is not granted; non-visible models may still be removed as casualties.',
    ],
  },
  instant: {
    es: [
      'Un ataque realizado con esta arma no permite que las unidades enemigas declaren Habilidades de Reacción como respuesta.',
      'Tampoco pueden resolver una Reacción que responda a ese ataque; la prohibición se limita a la respuesta al ataque de esta arma.',
    ],
    en: [
      'An attack with this weapon prevents Enemy Units from declaring Reaction abilities in response.',
      'They also cannot resolve a Reaction in response to that attack; the restriction concerns reactions to this weapon’s attack.',
    ],
  },
  'leading-model': {
    es: [
      'Cuando una acción de Mover, Desplegar, Correr, Cargar, Destrabarse, Cerrar Filas o una regla especial lo indique, el controlador elige temporalmente una Miniatura Líder de la unidad.',
      'Mueve primero esa miniatura midiendo su recorrido exacto. Después coloca las restantes en Coherencia válida respecto de la nueva posición. La elección termina al resolverse la acción.',
      'El Tamaño y las capacidades de la Miniatura Líder determinan el espacio de paso y las restricciones de terreno. La FAQ confirma que los Enlaces de Coherencia pueden atravesar lo que ella podría cruzar legalmente y que, si una orden exige ir directamente hacia un objetivo o alejarse de él, debe recorrer la máxima distancia posible.',
    ],
    en: [
      'For Move, Deploy, Run, Charge, Disengage, Close Ranks or another rule requiring it, the controller temporarily nominates one model in the Unit as its Leading Model.',
      'Move that model first along a measured path. Then set the other models in legal Coherency around its new position. The nomination ends with the action.',
      'Its Size and movement permissions determine gap clearance and terrain restrictions. The FAQ confirms that Coherency Links may cross anything the leader could legally cross and that a “directly towards” or “directly away” instruction requires the maximum possible movement.',
    ],
  },
  'line-of-sight': {
    es: [
      'Comprueba la visión desde arriba, trazando una línea recta de cualquier punto de la peana atacante a cualquier punto de la peana objetivo; no añadas la altura vertical. Si no cruza Terreno Bloqueante, el objetivo es visible.',
      'Si cruza terreno, comprueba cada elemento por separado: Cobertura Completa cuando su Tamaño Efectivo alcanza al de ambos modelos; Cobertura Directa cuando el trazado lo cruza y uno de los modelos está a 1 pulgada o menos de ese mismo elemento, que alcanza el Tamaño Efectivo de ese modelo. Si ambos están a 1 pulgada del mismo elemento y entre ellos hay 3 pulgadas o menos, se aplica la excepción de proximidad.',
      'También hay Zona Muerta de Elevación entre una miniatura en HIGH GROUND y otra en GROUND LEVEL a 1 pulgada o menos de la base del mismo terreno, con la misma excepción de proximidad. Varios terrenos no suman sus tamaños ni sus distancias para bloquear una línea.',
      'La huella exterior de un elemento cuenta entera, incluidos huecos y puertas, salvo acuerdo durante la preparación. Las unidades Flying ignoran Cobertura Completa, pero no Cobertura Directa ni la Zona Muerta; la visibilidad es mutua.',
      'La FAQ aclara que, para Cobertura Directa, basta estar a 1 pulgada de cualquier parte del mismo elemento atravesado por el trazado; no hace falta que la parte cercana sea precisamente la que cruza la línea.',
    ],
    en: [
      'Check sight from above by tracing a straight line between any points of the attacker’s and target’s bases; do not add vertical height. If it crosses no Blocking Terrain, the target is visible.',
      'If it crosses terrain, assess each feature alone: Full Cover applies when its Effective Size reaches both models’; Direct Cover applies when the trace crosses it and one model is within 1 inch of that same feature, which reaches that model’s Effective Size. If both models are within 1 inch of the same feature and within 3 inches of each other, use the close-quarters exception.',
      'An Elevation Dead Zone also exists between a High Ground model and a Ground Level model within 1 inch of the base of the same feature, with the same close-quarters exception. Separate features cannot combine their Sizes or proximity to block sight.',
      'A feature’s whole outer footprint counts, including openings and doorways, unless players agree otherwise during setup. Flying Units ignore Full Cover but not Direct Cover or the Dead Zone; visibility is mutual.',
      'The FAQ clarifies that Direct Cover needs proximity to any part of the same feature crossed by the trace; the nearby section need not be the exact section intersected by the line.',
    ],
  },
  'locked-in': {
    es: [
      'Al efectuar un Ataque a Distancia con esta arma, LOCKED IN (X) suma X a su Cadencia de Ataque si la unidad objetivo tiene el estado STATIONARY.',
      'La FAQ confirma que debe estar inmóvil el objetivo; el estado de la miniatura atacante no activa esta bonificación.',
    ],
    en: [
      'When this weapon makes a Ranged Attack, LOCKED IN (X) adds X to its Rate of Attack if the target Unit has STATIONARY Status.',
      'The FAQ confirms that the target must have the Status; being stationary as the attacker does not trigger this bonus.',
    ],
  },
};
