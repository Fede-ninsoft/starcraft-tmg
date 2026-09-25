/**
 * Expanded, paraphrased rules for the latter half of the game glossary.
 * Each entry follows the corresponding GameTerm ID in gameTerms.ts.
 */
export const GAME_TERM_DETAILS_B: Record<string, { es: readonly string[]; en: readonly string[] }> = {
  'long-range': {
    es: [
      'LONG RANGE (X) amplía el alcance máximo del arma hasta X pulgadas. Cada miniatura atacante mide por separado la distancia a la unidad objetivo.',
      'Las miniaturas dentro del alcance normal del perfil disparan sin esta penalización. Las que estén fuera de ese alcance, pero dentro de X pulgadas, reciben -1 a la tirada para Impactar.',
      'Si un mismo lote combina disparos normales y de largo alcance, se suman sus dados, pero se tiran en grupos distintos porque necesitan valores objetivo diferentes.',
    ],
    en: [
      'LONG RANGE (X) extends the weapon’s maximum reach to X inches. Measure each attacking model’s distance to the target separately.',
      'Models inside the profile’s normal range attack without this penalty. Models beyond it but within X inches take -1 to their Hit roll.',
      'If one batch includes both normal- and long-range shots, combine the dice total but roll the groups separately because their Hit target numbers differ.',
    ],
  },
  'mid-ground': {
    es: [
      'Una miniatura está en Nivel Medio si su peana descansa sobre terreno horizontal de Tamaño 1 o 2. Su Tamaño Efectivo suma su Tamaño y el de ese terreno.',
      'Para trabarse con miniaturas a Nivel del Suelo o Nivel Alto, ambas deben estar junto al mismo Punto de Acceso que conecte sus elevaciones.',
    ],
    en: [
      'A model is on Mid Ground when its base rests on horizontal Size 1 or 2 terrain. Its Effective Size is its own Size plus that terrain’s Size.',
      'To engage a model on Ground Level or High Ground, both models must be adjacent to the same Access Point linking their elevations.',
    ],
  },
  'mission-markers': {
    es: [
      'Durante la preparación se colocan los marcadores numerados donde indique la Carta de Despliegue. Miden 32 mm y tienen caras Activada y Desactivada; 1 y 3 son rojos, 2 y 4 azules y 5 neutral.',
      'Al final de cada ronda se compara el Suministro Actual total de las unidades aptas de cada jugador alrededor de cada marcador. Una unidad debe estar en mesa, en Coherencia y tener al menos una miniatura a 3 pulgadas o menos, con Línea de Visión y en la misma elevación. El marcador se trata como Tamaño 0 al trazar la visión.',
      'Las unidades Voladoras y BURROWED no pueden disputar ni controlar marcadores. Si solo un jugador disputa el marcador, puede controlarlo incluso con Suministro 0; ese valor no gana frente a un rival que también lo dispute.',
      'El control ya obtenido se conserva aunque se alejen las unidades. Solo cambia cuando el adversario termina la fase de puntuación con mayor Suministro disputante; un empate no lo transfiere. Tras ser controlado por primera vez, el marcador no vuelve a ser neutral.',
      'La FAQ aclara que la cara Desactivada no impide controlar el marcador. En la misión Artefact Hunt, una unidad Voladora o BURROWED puede reclamar un marcador controlado aunque no pueda disputarlo ni controlarlo por sí misma.',
    ],
    en: [
      'During setup, place the numbered markers at the Deployment Card’s coordinates. Each is 32 mm across with Activated and Deactivated faces; 1 and 3 are red, 2 and 4 blue, and 5 neutral.',
      'At each round’s end, compare the players’ combined Current Supply from eligible units around each marker. A unit must be on the battlefield, In Coherency, and have a model within 3 inches with Line of Sight to the marker at the same elevation. Treat the marker as Size 0 when tracing sight.',
      'Flying and BURROWED units cannot contest or control markers. If only one player contests, that player can control the marker even at Supply 0; that value cannot beat an opponent also contesting it.',
      'Existing control lasts even after units move away. It changes only when the opponent ends a scoring phase with a higher contesting Supply total; a tie does not transfer it. A marker never returns to neutral after first being controlled.',
      'The FAQ confirms that a Deactivated marker is still controllable. In Artefact Hunt, a Flying or BURROWED unit may claim a controlled marker even though it cannot itself contest or control it.',
    ],
  },
  modifier: {
    es: [
      'Un modificador cambia el valor objetivo de la tirada antes de lanzar los dados; no se suma al resultado físico del dado. Un +X reduce ese valor y facilita la tirada, mientras que un -X lo eleva y la dificulta.',
      'Los modificadores de fuentes con nombres diferentes se acumulan salvo indicación contraria. El valor objetivo final nunca baja de 2+ ni sube de 6+.',
      'Un 6 natural siempre tiene éxito y un 1 natural siempre falla. La Adición Fija es una regla diferente que produce un valor en vez de modificar el valor objetivo.',
      'La FAQ confirma que ANTI-EVADE y otros modificadores no pueden anular por completo una tirada: incluso una Evasión empeorada conserva como máximo un objetivo de 6+.',
    ],
    en: [
      'A modifier changes the roll’s target number before dice are rolled; it does not add to the face showing on a die. +X lowers the target and helps, while -X raises it and hinders.',
      'Modifiers from differently named sources stack unless a rule says otherwise. The final target number cannot go below 2+ or above 6+.',
      'An unmodified 6 always succeeds and an unmodified 1 always fails. Fixed Addition is a separate rule that produces a value instead of changing a target number.',
      'The FAQ confirms that ANTI-EVADE and similar modifiers cannot eliminate a roll altogether: even a worsened Evade roll still has a target no higher than 6+.',
    ],
  },
  morph: {
    es: [
      'Para usar MORPH (Nombre de unidad) X debe haber Suministro Disponible suficiente para la nueva unidad. Coloca una miniatura del tipo indicado en contacto de peanas con una miniatura de la unidad activa.',
      'Retira X miniaturas de la unidad original. La miniatura colocada forma una unidad nueva y no puede quedar a 1 pulgada o menos de ninguna unidad enemiga.',
      'Pon un Marcador de Activación junto a la nueva unidad: no puede activarse durante el resto de esa ronda.',
      'La FAQ confirma que cualquier descenso del Suministro Actual causado por MORPH concede al rival tantos Puntos de Victoria como Suministro perdido. Después, la unidad transformada también concede puntos normalmente cuando pierde Suministro.',
    ],
    en: [
      'MORPH (Unit Name) X requires enough Available Supply for the new unit. Place one named model in base contact with a model of the active unit.',
      'Remove X models from the original unit. The placed model becomes a separate unit and must not be within 1 inch of any enemy unit.',
      'Give the new unit an Activation Marker; it cannot activate for the rest of the round.',
      'The FAQ confirms that any Current Supply lost during the Morph gives the opponent that many Victory Points. The morphed unit later awards points normally whenever its own Supply falls.',
    ],
  },
  'non-lethal-damage': {
    es: [
      'NON-LETHAL DAMAGE (X) añade X al daño acumulado de la unidad y se refleja en su Marcador de Daño.',
      'Esta aplicación por sí sola no retira miniaturas, aunque el daño acumulado alcance o supere sus Puntos de Vida. Si más adelante recibe daño normal, ambos importes se combinan y entonces se comprueban las bajas.',
      'El daño asignado puede hacer que se pierda SHIELDED al superar el valor de Escudo, aunque este efecto no retire miniaturas inmediatamente.',
    ],
    en: [
      'NON-LETHAL DAMAGE (X) adds X to the unit’s accumulated damage, tracked on its Damage Marker.',
      'This application alone removes no models even if the accumulated amount meets or exceeds their HP. Later ordinary damage combines with that amount and then casualties are checked normally.',
      'Assigned damage can end SHIELDED once it exceeds the Shield value, even when the non-lethal effect does not immediately remove a model.',
    ],
  },
  'on-creep': {
    es: [
      'Una unidad Zerg Terrestre, amiga o enemiga, está SOBRE CREEP mientras se encuentre a 6 pulgadas o menos de un Creep Tumor o de una miniatura designada como Fuente de Creep.',
      'El estado habilita solo las habilidades y mejoras que lo exijan; no concede por sí mismo una bonificación general de movimiento.',
      'Según la FAQ, para un bono como Accelerating Creep se comprueba el estado al empezar el movimiento; si se cumple entonces, dura todo ese desplazamiento aunque la unidad salga del Creep.',
      'Una unidad aún en Reservas no puede aplicar el bono de velocidad de Creep durante su Despliegue: entra con su Velocidad normal y solo después puede pasar a estar SOBRE CREEP.',
    ],
    en: [
      'A friendly or enemy Ground Zerg unit is ON CREEP while within 6 inches of a Creep Tumor or a model designated as a Source of Creep.',
      'The status enables only abilities and upgrades that require it; the keyword alone grants no universal movement bonus.',
      'Under the FAQ, a bonus such as Accelerating Creep checks the status when movement begins; if the condition holds then, the bonus lasts for that whole move even if the unit leaves Creep.',
      'A unit still in Reserves cannot use a Creep speed bonus for its Deploy move: it enters with its normal Speed and can become ON CREEP only once on the battlefield.',
    ],
  },
  pierce: {
    es: [
      'PIERCE [ETIQUETA] X se comprueba contra las Etiquetas de Combate de la unidad objetivo.',
      'Si posee la etiqueta indicada, el Daño del arma para ese ataque pasa a ser X. Si no coincide, conserva el Daño normal del perfil.',
    ],
    en: [
      'PIERCE [TAG] X checks the target unit’s Combat Tags.',
      'When the specified tag matches, use X as the weapon’s Damage for that attack. Otherwise use the profile’s ordinary Damage value.',
    ],
  },
  pinpoint: {
    es: [
      'PINPOINT permite elegir como objetivo de un Ataque a Distancia una unidad enemiga Trabada.',
      'Solo elimina esa prohibición concreta; siguen aplicándose los demás requisitos de objetivo, como alcance, tipo de objetivo y visibilidad cuando corresponda.',
    ],
    en: [
      'PINPOINT allows a Ranged Attack to select an Engaged enemy unit as its target.',
      'It lifts that specific restriction only; all other target requirements, including range, target type and applicable visibility, still apply.',
    ],
  },
  place: {
    es: [
      'Con PLACE (X), elige una Miniatura Líder, retírala y colócala completamente dentro de X pulgadas de su posición inicial. Después recoloca todas las demás miniaturas de la unidad en Coherencia.',
      'La colocación no recorre un trayecto, por lo que ignora requisitos de paso entre huecos y cambio de elevación. La posición final debe seguir siendo legal.',
      'Fuera de la Fase de Asalto, la unidad no puede terminar dentro del Alcance de Enfrentamiento enemigo. Si PLACE se usa en Asalto, sí puede colocarse dentro de ese alcance y quedar Trabada.',
    ],
    en: [
      'For PLACE (X), choose a Leading Model, remove it and set it wholly within X inches of its starting point. Then reset the rest of its unit In Coherency.',
      'Placement follows no travel path, so it bypasses gap-clearance and elevation-travel requirements. The final position must still be legal.',
      'Outside the Assault Phase, the unit cannot finish inside an enemy’s Engagement Range. PLACE used during Assault may end there and leave the unit Engaged.',
    ],
  },
  precision: {
    es: [
      'Después de tirar para Impactar, PRECISION (X) convierte hasta X dados fallidos del Lote de Ataque en impactos: pásalos directamente a la Reserva de Armadura.',
      'Esos dados cuentan como impactos normales para los efectos posteriores, incluido Surge.',
      'La FAQ aclara que el efecto pertenece al lote colectivo del arma, no a cada miniatura. Si en Combate se divide un solo lote contra varias unidades, puedes aplicar PRECISION a una de sus reservas o repartirlo entre ellas.',
    ],
    en: [
      'After rolling to Hit, PRECISION (X) turns up to X failed dice from the attack batch into hits by moving them straight to the Armour Pool.',
      'Those dice count as ordinary successful hits for later effects, including Surge.',
      'The FAQ clarifies that the effect belongs to the weapon’s collective batch, not to each model. If one Combat batch is split among target units, its PRECISION benefit may be assigned to one target pool or divided between them.',
    ],
  },
  ready: {
    es: [
      'READY es el estado inicial, boca arriba, de las Cartas Tácticas y de Facción al comienzo de cada ronda. Sus habilidades están disponibles y la carta puede agotarse cuando una regla lo exija como coste o activación.',
      'Durante Limpieza y Renovación, las cartas agotadas vuelven a READY para la siguiente ronda.',
    ],
    en: [
      'READY is the starting, face-up state of Tactical and Faction Cards each round. Their abilities are available, and a card can be exhausted when a rule requires it as a cost or activation.',
      'During Cleanup & Refresh, exhausted cards return to READY for the following round.',
    ],
  },
  repeatable: {
    es: [
      'REPEATABLE elimina el límite de una vez por ronda de la habilidad que lo lleva. Puede utilizarse varias veces en una ronda e incluso en una misma activación.',
      'En cada uso deben volver a cumplirse el disparador, las demás condiciones y todos los costes.',
      'Si es una Reacción, sigue vigente el límite general de una Reacción por jugador y activación; REPEATABLE no suprime ese límite.',
    ],
    en: [
      'REPEATABLE removes the ability’s once-per-round limit. It may be used several times in a round and even within one activation.',
      'Each use must independently satisfy its trigger, other conditions and full costs.',
      'If the ability is a Reaction, the general one-Reaction-per-player-per-activation limit still applies; REPEATABLE does not remove it.',
    ],
  },
  reserves: {
    es: [
      'Todas las unidades empiezan en Reservas, fuera del campo de batalla, y salen al efectuar un Despliegue u otro efecto que autorice su llegada.',
      'Mientras permanezcan allí, no pueden ser objetivo de ataques o habilidades ni usar habilidades Activas, Pasivas o de Reacción, salvo que una regla indique expresamente que funciona en Reservas.',
      'No disputan ni controlan Marcadores de Misión, y su Suministro Actual no cuenta para el total de unidades presentes en la mesa. Conservan el equipo, mejoras y armas elegidos para el ejército.',
      'La llegada necesita espacio en la Reserva de Suministro y respeta las restricciones de despliegue y Zona de Influencia. Algunas reglas devuelven unidades a Reservas; la sección 8.5.5 regula cómo se tratan sus efectos y daño.',
      'En la ronda final, las unidades que sigan en Reservas sin desplegar se consideran Destruidas para la puntuación final.',
    ],
    en: [
      'Every unit starts in Reserves, off the battlefield, and leaves when it Deploys or another rule authorizes its arrival.',
      'While there, it cannot be targeted by attacks or abilities or use Active, Passive or Reaction Abilities unless a rule expressly works in Reserves.',
      'It cannot contest or control Mission Markers, and its Current Supply does not count toward the total fielded Supply. It keeps the equipment, upgrades and weapons chosen for the army.',
      'Arrival needs room in the Supply Pool and obeys deployment and Zone of Influence restrictions. Some rules send units back to Reserves; section 8.5.5 governs their effects and damage.',
      'In the final round, units still in Reserves without deploying count as Destroyed for final scoring.',
    ],
  },
  respawn: {
    es: [
      'RESPAWN (X) devuelve hasta X miniaturas destruidas a una unidad que todavía existe.',
      'Cada miniatura reaparecida debe colocarse en contacto de peanas con una de la unidad y fuera del Alcance de Enfrentamiento enemigo; si no hay posición legal, no vuelve.',
      'La devolución no puede elevar el Suministro Actual de la unidad a un tramo superior de su Perfil de Suministro.',
    ],
    en: [
      'RESPAWN (X) restores up to X destroyed models to a unit that is still present.',
      'Each returning model must be placed in base contact with a model of its unit and outside enemy Engagement Range; a model with no legal placement cannot return.',
      'Returning models cannot raise the unit’s Current Supply into a higher bracket of its Supply Profile.',
    ],
  },
  shielded: {
    es: [
      'Si la Carta de Unidad muestra Escudo, su valor se suma a los Puntos de Vida de la primera miniatura y la unidad adquiere SHIELDED.',
      'El estado termina cuando el Daño Total asignado supera el valor de Escudo o cuando se retira la primera miniatura de la unidad.',
      'La FAQ aclara que se comprueba después de resolver el daño; una reducción aplicada antes de asignarlo puede evitar que se pierda el estado. El daño no letal cuenta igual que el normal para esta comprobación.',
      'Perder SHIELDED no elimina los Puntos de Vida restantes: solo deja de aplicar los efectos que exigen ese estado. HEAL no puede restaurarlo.',
    ],
    en: [
      'If the Unit Card has a Shield value, add it to the first model’s HP and the unit gains SHIELDED.',
      'The status ends when assigned Total Damage exceeds the Shield value or when the unit’s first model is removed.',
      'The FAQ checks this after damage is resolved, so reduction before assignment can preserve the status. Non-lethal damage counts in this check just like ordinary damage.',
      'Losing SHIELDED does not remove remaining HP; it only ends effects conditional on that status. HEAL cannot restore it.',
    ],
  },
  sidearm: {
    es: [
      'En un Ataque a Distancia o de Combate Cuerpo a Cuerpo, una miniatura equipada con SIDEARM puede usarlo además del arma que normalmente puede elegir. Si lleva varias armas SIDEARM, puede emplearlas todas en la misma activación.',
      'Los ataques de cada SIDEARM forman lotes separados. Cada lote puede elegir una unidad enemiga distinta de la del arma principal, siempre que cumpla los requisitos normales de objetivo.',
    ],
    en: [
      'During a Ranged or Close Combat Attack, a model equipped with SIDEARM may use it in addition to its normally selected weapon. A model with several SIDEARMs may use them all in the same activation.',
      'Resolve every SIDEARM in its own batch. Each batch may choose a different enemy unit from the main weapon’s target, provided normal target eligibility is met.',
    ],
  },
  'siege-mode': {
    es: [
      'Una unidad en SIEGE MODE no puede realizar Mover, Destrabarse, Correr, Cargar ni Cerrar Filas.',
      'Solo puede utilizar perfiles de armas que requieran SIEGE MODE; los demás perfiles de armas quedan inutilizables mientras conserve el estado.',
      'Al regresar a Reservas pierde SIEGE MODE.',
    ],
    en: [
      'A unit in SIEGE MODE cannot Move, Disengage, Run, Charge or Close Ranks.',
      'It may use only weapon profiles requiring SIEGE MODE; its other weapon profiles cannot be used while the status lasts.',
      'Returning to Reserves removes SIEGE MODE.',
    ],
  },
  'special-ability': {
    es: [
      'Una Habilidad Especial es una habilidad con nombre de una Carta de Unidad, Táctica o de Facción. Es Activa, Pasiva o de Reacción, y siempre debe cumplir sus propios requisitos y costes.',
      'Las Activas requieren que se active la unidad y se usan inmediatamente antes o después de una acción. Cada habilidad Activa con nombre solo puede usarse una vez por ronda y unidad, salvo que sea REPEATABLE.',
      'Las Pasivas funcionan mientras la unidad está en el campo de batalla. Las Reacciones responden a su disparador; cada jugador resuelve como máximo una Reacción por activación y cada Reacción con nombre, una vez por ronda y unidad.',
      'En Reservas ninguna de las tres clases funciona salvo indicación expresa. Una unidad no puede estar afectada simultáneamente por varias copias de una Habilidad Especial con el mismo nombre.',
    ],
    en: [
      'A Special Ability is a named ability on a Unit, Tactical or Faction Card. It is Active, Passive or Reaction, and its own conditions and costs must always be met.',
      'Active Abilities require the unit to activate and are used immediately before or after an action. Each named Active Ability is limited to once per round per unit unless REPEATABLE applies.',
      'Passive Abilities work while the unit is on the battlefield. Reactions answer their stated trigger; each player resolves at most one Reaction per activation, and each named Reaction is limited to once per round per unit.',
      'None of these types works in Reserves unless expressly stated. A unit cannot simultaneously benefit from several copies of the same-named Special Ability.',
    ],
  },
  specialist: {
    es: [
      'SPECIALIST limita esa arma a una sola miniatura equipada dentro de la unidad.',
      'Durante la creación del ejército no pueden combinarse mejoras que den más de una copia del arma SPECIALIST a esa misma unidad.',
    ],
    en: [
      'SPECIALIST limits the weapon to one equipped model in the unit.',
      'During army building, upgrades cannot be combined to give that unit more than one copy of the SPECIALIST weapon.',
    ],
  },
  spillover: {
    es: [
      'Una Plantilla Explosiva o Lanzallamas puede cubrir miniaturas de otras unidades además de la unidad objetivo principal. Si comparten su elevación y al menos una Etiqueta de Combate, las miniaturas aptas reciben SPILLOVER; puede afectar tanto a amigas como a enemigas.',
      'Cada unidad adicional se resuelve en un lote separado con tantos dados de Ataque como miniaturas afectadas. No recibe modificadores de Cadencia de Ataque ni genera Surge.',
      'La FAQ aclara que palabras clave del arma como PRECISION o CRITICAL HIT pertenecen solo al lote del objetivo principal y no se trasladan a los lotes de SPILLOVER.',
      'Los modificadores que afecten a la unidad defensora se evalúan por lote: por ejemplo, Guardian Shield reduce en un dado cada lote de Ataque a Distancia contra una unidad protegida.',
      'Para determinar qué miniaturas están afectadas, aplica las reglas completas de Plantillas de la sección 8.7.6: solapamiento de peana, elevación, tipo de objetivo y bloqueo por terreno de Tamaño 2 o más.',
      'Según la FAQ, una plantilla de habilidad sin objetivo principal físico usa como Punto Objetivo el centro de la plantilla: no exige compartir Etiqueta de Combate, pero sí el nivel de elevación; las unidades Voladoras se comparan con el nivel de sus peanas.',
    ],
    en: [
      'A Blast or Flamer Template can cover models from units beyond the primary target. Eligible models at the primary target’s elevation and sharing at least one Combat Tag receive SPILLOVER; friendly and enemy units may both be affected.',
      'Resolve each additional unit in a separate batch with one Attack Die per affected model. These batches receive no Rate of Attack modifiers and generate no Surge.',
      'The FAQ clarifies that weapon keywords such as PRECISION or CRITICAL HIT belong only to the main target’s batch and do not carry into SPILLOVER batches.',
      'Modifiers affecting a defending unit are checked for each batch: for example, Guardian Shield removes one Attack Die from each ranged batch aimed at a protected unit.',
      'For which models are affected, follow the full Template rules in section 8.7.6: base coverage, elevation, target type and blockage by Size 2 or larger terrain.',
      'For an ability template with no physical primary target, the FAQ uses the template centre as Target Point: no Combat Tag must be shared, but elevation must match; Flying models are compared using their bases’ elevation.',
    ],
  },
  stationary: {
    es: [
      'Al comienzo de cada ronda, todas las unidades adquieren STATIONARY.',
      'Lo pierden en cuanto cualquier miniatura de la unidad se mueve, es movida por otro efecto o es colocada mediante PLACE, con independencia del motivo.',
    ],
    en: [
      'Every unit gains STATIONARY at the start of each round.',
      'It is lost as soon as any model in the unit moves, is moved by another effect or is PLACED, whatever the reason.',
    ],
  },
  status: {
    es: [
      'Un Estado es una palabra clave que describe un modo operativo, una condición o un cambio temporal o persistente de características de una unidad, como BURROWED o SIEGE MODE.',
      'Salvo que la regla del Estado indique otra cosa, no se retira durante Puntuación y Limpieza: permanece hasta que ocurra su condición de finalización.',
      'Se marca junto a la unidad. Los modos usan marcadores de plástico y otros estados usan marcadores azules de bonificación o rojos de penalización; estos marcadores permanecen en juego.',
    ],
    en: [
      'A Status is a keyword describing a unit’s operating mode, condition or temporary or persistent characteristic change, such as BURROWED or SIEGE MODE.',
      'Unless its own rule says otherwise, Scoring & Cleanup does not remove it: the status lasts until its removal condition occurs.',
      'Track it beside the unit. Modes use plastic markers, while other statuses use blue Buff or red Debuff markers; these markers stay in play.',
    ],
  },
  'stay-in-play': {
    es: [
      'STAY IN PLAY permite que una ficha, marcador o efecto de habilidad sobreviva al paso de Limpieza y Renovación, que normalmente retira efectos temporales.',
      'Permanece hasta que se cumpla la duración o condición específica que lo retira, como la destrucción de su origen.',
    ],
    en: [
      'STAY IN PLAY lets a token, marker or ability effect survive Cleanup & Refresh, which normally removes temporary effects.',
      'It persists until its stated duration or specific removal condition is met, such as destruction of its source.',
    ],
  },
  summon: {
    es: [
      'SUMMON (Nombre de unidad) requiere Suministro Disponible suficiente: la nueva unidad no puede hacer que el Suministro Actual total en mesa supere la Reserva de Suministro.',
      'Coloca su Miniatura Líder en contacto de peanas con la unidad madre y el resto en Coherencia. No pueden quedar dentro del Alcance de Enfrentamiento enemigo ni en la Zona de Influencia rival.',
      'Pon un Marcador de Activación junto a la invocada; no puede activarse en la misma fase en que apareció.',
      'En las fases posteriores debe activarse inmediatamente después de que termine la activación de su madre, antes de que actúe el rival. Si la madre ya no está en mesa, puede activarse normalmente.',
    ],
    en: [
      'SUMMON (Unit Name) requires enough Available Supply: the new unit cannot raise the total fielded Current Supply above the Supply Pool.',
      'Place its Leading Model in base contact with the Parent Unit and the rest In Coherency. They may not end inside enemy Engagement Range or the opponent’s Zone of Influence.',
      'Give the summoned unit an Activation Marker; it cannot activate in the phase when it appeared.',
      'In later phases it must activate immediately after its Parent Unit finishes activating, before the opponent acts. If the parent has left the battlefield, it may activate normally.',
    ],
  },
  'supply-value': {
    es: [
      'El Perfil de Suministro de la Carta de Unidad asigna un valor según su número actual de miniaturas. Al crear el ejército, la composición elegida fija el Suministro inicial y cuántos Espacios de Ejército ocupa.',
      'Durante la partida, si las bajas reducen la unidad hasta un tramo inferior del perfil, actualiza inmediatamente su Suministro Actual.',
      'El valor vigente interviene en el Despliegue, el control de Marcadores de Misión, la Masa Táctica y la puntuación. La FAQ confirma que una reducción causada por MORPH también concede PV al adversario.',
    ],
    en: [
      'The Unit Card’s Supply Profile assigns a value for the unit’s current model count. During army building, the selected composition fixes Starting Supply and how many Army Slots it takes.',
      'During play, immediately update Current Supply when casualties move the unit to a lower bracket of that profile.',
      'The current value matters for Deployment, Mission Marker control, Tactical Mass and scoring. The FAQ confirms that a reduction caused by MORPH also awards VP to the opponent.',
    ],
  },
  'supporting-rank': {
    es: [
      'Una miniatura ocupa la Fila de Apoyo si está en contacto de peanas con otra de su misma unidad que esté en Fila de Combate, pero ella misma queda fuera del Alcance de Enfrentamiento enemigo.',
      'Aunque no esté en contacto directo con el enemigo, puede atacar con sus armas de Fase de Combate como parte de esa lucha.',
    ],
    en: [
      'A model is in the Supporting Rank when it touches a same-unit model in the Fighting Rank but is itself outside enemy Engagement Range.',
      'Despite not directly engaging the enemy, it can strike with its Combat Phase weapons as part of that fight.',
    ],
  },
  'tactical-mass': {
    es: [
      'Una unidad tiene Masa Táctica si su Suministro Actual supera la suma del Suministro Actual de todas las unidades enemigas con las que está Trabada. Un empate no basta.',
      'Si se Destraba con Masa Táctica, ignora la penalización habitual de esa acción: en la Fase de Asalto siguiente puede hacer un Ataque a Distancia o Cargar con normalidad.',
    ],
    en: [
      'A unit has Tactical Mass only if its Current Supply exceeds the combined Current Supply of every enemy unit it is Engaged with. A tie is insufficient.',
      'If it Disengages with Tactical Mass, it ignores the ordinary Disengage penalty and may make a Ranged Attack or Charge normally in the following Assault Phase.',
    ],
  },
  tough: {
    es: [
      'Al resolver una Tirada de Armadura, TOUGH (X) permite convertir hasta X resultados fallidos en éxitos.',
      'Esos dados se descartan como si hubiesen alcanzado el valor de Armadura; no pasan a la Reserva de Daño.',
    ],
    en: [
      'When resolving an Armour Roll, TOUGH (X) changes up to X failed results into successes.',
      'Discard those dice as though they met the Armour target; they do not enter the Damage Pool.',
    ],
  },
  unengaged: {
    es: [
      'Una unidad Terrestre está No Trabada si ninguna de sus miniaturas está a 1 pulgada o menos de una miniatura Terrestre enemiga con la que pueda trabarse válidamente; las restricciones del terreno pueden impedir el enfrentamiento pese a la cercanía.',
      'Las unidades Voladoras se consideran siempre No Trabadas.',
      'Una unidad No Trabada puede Mover, Correr, efectuar un Ataque a Distancia o Cargar según la fase. Solo las unidades No Trabadas pueden elegirse para Mover.',
    ],
    en: [
      'A Ground unit is Unengaged if none of its models is within 1 inch of an enemy Ground model with which a valid engagement exists; terrain can prevent engagement despite proximity.',
      'Flying units are always Unengaged.',
      'An Unengaged unit may Move, Run, make a Ranged Attack or Charge when the phase permits. Only Unengaged units may be chosen for a Move action.',
    ],
  },
  visible: {
    es: [
      'Una miniatura es Visible cuando puede trazarse hasta ella una Línea de Visión válida. Si la línea no cruza Terreno Bloqueante, no hacen falta más comprobaciones.',
      'Si cruza terreno de ese tipo, comprueba cada pieza según las reglas de Cobertura Total y Directa. La miniatura sigue Visible si ninguna de ellas bloquea la línea.',
      'HIDDEN impide ver a esa miniatura desde más de 4 pulgadas, aunque la Línea de Visión geométrica fuese válida.',
    ],
    en: [
      'A model is Visible when a valid Line of Sight can be traced to it. If the trace crosses no Blocking Terrain, no further cover check is needed.',
      'Where it crosses such terrain, check each piece against Full and Direct Cover. The model remains Visible if neither blocks the line.',
      'HIDDEN prevents the model from being Visible to observers more than 4 inches away, even if geometric Line of Sight would otherwise exist.',
    ],
  },
  'wholly-within': {
    es: [
      'Una miniatura está Completamente Dentro de una distancia solo si toda su peana cabe en ella; no basta con que toque el límite.',
      'Para que una unidad cumpla esta condición, deben cumplirla todas sus miniaturas. Se usa, entre otras cosas, para la Coherencia y algunas áreas de efecto.',
    ],
    en: [
      'A model is Wholly Within a distance only when its entire base fits inside it; merely touching the range is insufficient.',
      'Every model must qualify for the whole unit to be Wholly Within. This stricter measure is used for Coherency and some areas of effect.',
    ],
  },
  within: {
    es: [
      'Una miniatura está Dentro de una distancia cuando cualquier parte de su peana toca o entra en ese alcance.',
      'Una unidad cumple si al menos una de sus miniaturas lo hace. Si una regla solo dice «Dentro de», no exige que toda la peana ni toda la unidad queden dentro.',
    ],
    en: [
      'A model is Within a distance when any part of its base touches or enters that range.',
      'A unit qualifies if at least one model does. A rule saying only “Within” does not require the whole base or whole unit to fit inside.',
    ],
  },
  'zone-of-influence': {
    es: [
      'La Zona de Influencia ocupa 6 pulgadas hacia el interior de la mesa desde el Borde de Entrada que indique la Carta de Despliegue. Si el borde solo cubre parte del lateral, se delimitan sus esquinas con marcadores.',
      'Una unidad llegada desde Reservas no puede terminar su llegada dentro de la zona rival, ya sea por Despliegue normal, transporte o SUMMON.',
      'La zona no restringe el movimiento de unidades ya presentes en la mesa ni bloquea Línea de Visión después de la llegada.',
    ],
    en: [
      'The Zone of Influence extends 6 inches into the battlefield from the Entry Edge on the Deployment Card. When that edge covers only part of a table side, markers show its corners.',
      'A unit arriving from Reserves cannot finish inside the opponent’s zone, whether it arrives by normal Deploy, transport or SUMMON.',
      'The zone does not restrict later movement of units already on the table or block Line of Sight after arrival.',
    ],
  },
  activation: {
    es: [
      'En Movimiento, Asalto y Combate, los jugadores se alternan activando una unidad apta cada vez. Quien tenga el Marcador de Primer Jugador decide quién inicia cada fase.',
      'Al activarse, la unidad realiza exactamente una acción permitida por la fase y por su estado; las opciones varían entre Mover o Desplegar, disparar o Cargar, y combatir o Cerrar Filas.',
      'Una habilidad que indique un momento relativo a la activación se resuelve conforme a su disparador y a las limitaciones generales de Habilidades Especiales.',
    ],
    en: [
      'During Movement, Assault and Combat, players alternate activating one eligible unit at a time. The First Player Marker holder decides who starts each phase.',
      'When activated, the unit performs exactly one action allowed by the phase and its current state; the choices change from moving or deploying to shooting or charging and then fighting or closing ranks.',
      'An ability tied to an activation is resolved at its stated trigger and under the general Special Ability limits.',
    ],
  },
  pass: {
    es: [
      'En su turno, el Jugador Activo puede Pasar en lugar de activar una unidad; debe hacerlo si no le queda ninguna apta.',
      'El primero que Pasa en una fase recibe el Marcador de Primer Jugador para la fase siguiente. Después de Pasar ya no puede activar más unidades durante esa fase.',
      'El rival termina sus activaciones pendientes antes de que avance la secuencia de fases.',
    ],
    en: [
      'On their turn, the Active Player may Pass instead of activating a unit and must do so when no eligible units remain.',
      'The first player to Pass in a phase takes the First Player Marker for the next phase. A player who has Passed cannot activate further units in the current phase.',
      'The opponent completes any remaining activations before play proceeds to the next phase.',
    ],
  },
  'unit-coherency': {
    es: [
      'Se comprueba al terminar cualquier acción que recoloca miniaturas, incluidos Mover, Desplegar, Cargar, Destrabarse, Cerrar Filas, Correr, PLACE y SUMMON.',
      'Coloca primero la Miniatura Líder. Cada otra miniatura debe quedar completamente dentro de 3 pulgadas de ella y enlazada mediante una cadena válida entre miniaturas de la misma unidad.',
      'Los Enlaces de Coherencia pueden cruzar cualquier terreno, miniatura o hueco que la Líder pudiera atravesar legalmente; también enemigos con los que la unidad esté Trabada y Puntos de Acceso. Los enlaces de unidades Voladoras ignoran terreno y otras miniaturas.',
      'Si un obstáculo impide alcanzar las 3 pulgadas, coloca la miniatura lo más cerca posible conservando un enlace válido: la unidad queda Fuera de Coherencia y no puede disputar ni controlar marcadores. Si no existe ninguna posición legal enlazada, retira esa miniatura como baja.',
      'Las bajas por sí solas no obligan a comprobar Coherencia ni cambian el estado de la unidad. La FAQ confirma que el control de un objetivo se determina con el estado de Coherencia resultante al terminar el movimiento.',
    ],
    en: [
      'Check Coherency after any action that repositions models, including Move, Deploy, Charge, Disengage, Close Ranks, Run, PLACE and SUMMON.',
      'Set the Leading Model first. Every other model must finish wholly within 3 inches of it and connect through a valid chain of same-unit models.',
      'Coherency Links may cross any terrain, model or gap the leader could legally traverse; they may also cross enemies the unit is Engaged with and Access Points. Flying units’ links ignore terrain and other models.',
      'If obstacles prevent a model reaching the 3-inch range, place it as close as possible while preserving a valid link: the unit is Out of Coherency and cannot contest or control markers. Remove a model as a casualty if no linked legal position exists.',
      'Casualties alone never cause a Coherency recheck or change the unit’s state. The FAQ confirms that objective control uses the Coherency state established after the move ends.',
    ],
  },
  'supply-pool': {
    es: [
      'La Reserva de Suministro es el límite del Suministro Actual total que puede haber en mesa. En la primera ronda equivale al Suministro inicial de la Carta de Misión.',
      'En cada ronda posterior aumenta según el valor de Escalada de la misión; en la última ronda pasa a ser ilimitada.',
      'Suministro Disponible = Reserva de Suministro menos el Suministro Actual de las unidades amigas presentes. Para desplegar o invocar una unidad, su Suministro Actual debe caber en esa diferencia. La destrucción o reducción de Suministro libera capacidad.',
    ],
    en: [
      'The Supply Pool caps the combined Current Supply that may be on the battlefield. In round one it equals the Mission Card’s starting Supply.',
      'It increases by the mission’s Escalation value in later rounds and becomes unlimited in the final round.',
      'Available Supply equals the Supply Pool minus the Current Supply of friendly fielded units. A deploying or summoned unit must fit inside that remainder. Destruction or a reduction in Supply frees capacity.',
    ],
  },
  batch: {
    es: [
      'Las miniaturas que usan el mismo perfil de arma combinan su Cadencia de Ataque en un Lote dirigido a una sola unidad enemiga. Armas con perfiles diferentes y cada SIDEARM se resuelven en lotes separados.',
      'Se elige el objetivo del lote, se resuelve por completo y solo después se declara el siguiente. La FAQ confirma que no hace falta fijar por adelantado los objetivos de todas las armas.',
      'Cada lote pasa por Impacto, Surge, Armadura, Evasión si procede y Daño. Dados con modificadores distintos pueden tirarse por separado sin dejar de pertenecer al mismo lote.',
      'La FAQ aclara que las palabras clave de arma actúan sobre el lote colectivo y no se multiplican por cada miniatura; los lotes de SPILLOVER son independientes del principal.',
    ],
    en: [
      'Models using one weapon profile combine their Rate of Attack into a batch aimed at a single enemy unit. Different weapon profiles and each SIDEARM are resolved as separate batches.',
      'Choose one batch’s target and resolve it fully before declaring the next. The FAQ confirms that targets for all weapons need not be fixed in advance.',
      'Each batch proceeds through Hit, Surge, Armour, eligible Evade and Damage. Dice with different modifiers may be rolled separately while remaining in the same batch.',
      'The FAQ clarifies that weapon keywords act on the collective batch rather than multiplying per model; SPILLOVER batches are separate from the main one.',
    ],
  },
  surge: {
    es: [
      'Si el arma tiene dado Surge, lanza uno para el lote junto a los dados de Ataque. Sin característica de dado Surge, su resultado es cero.',
      'Solo se aplica si el Tipo de Surge del arma coincide con una Etiqueta de Combate de la unidad objetivo. Entonces pasa a la Reserva de Daño tantos impactos exitosos de la Reserva de Armadura como indique el dado, sin superar los dados disponibles; esos impactos omiten la Tirada de Armadura.',
      'Si no hay coincidencia, ignora el resultado. La FAQ confirma que los impactos pasados por Surge siguen formando parte de la Reserva de Daño final y pueden ser evitados si el defensor tiene derecho a una Tirada de Evasión.',
    ],
    en: [
      'If the weapon has a Surge Die characteristic, roll one die for the batch alongside its Attack Dice. With no Surge Die characteristic, the Surge result is zero.',
      'It applies only when the weapon’s Surge Type matches a Combat Tag on the target. Move that many successful hits from the Armour Pool directly to the Damage Pool, capped by the dice actually present; those hits skip the Armour Roll.',
      'Without a tag match, ignore the result. The FAQ confirms that Surge dice remain in the final Damage Pool and may still be removed by an eligible defender’s Evade Roll.',
    ],
  },
  'evade-roll': {
    es: [
      'Se realiza una Tirada de Evasión si una habilidad o palabra clave la concede, o si una unidad Trabada recibe Daño de un Ataque a Distancia.',
      'Tras Surge y Armadura, el defensor tira todos los dados que queden en la Reserva de Daño. Cada resultado igual o superior a su valor de Evasión retira ese dado; los restantes causan Daño.',
      'La FAQ confirma que también se tiran los dados que llegaron a Daño mediante Surge: este solo evita Armadura, no Evasión.',
      'Los modificadores como ANTI-EVADE pueden empeorar el valor objetivo, pero nunca más allá de 6+; no anulan por completo el derecho a tirar.',
    ],
    en: [
      'An Evade Roll is made when an ability or keyword grants it, or when an Engaged unit suffers damage from a Ranged Attack.',
      'After Surge and Armour, the defender rolls every die left in the Damage Pool. Each result meeting or beating its Evade value removes that die; the rest cause damage.',
      'The FAQ confirms that dice moved into Damage by Surge are also rolled: Surge skips Armour, not Evade.',
      'Modifiers such as ANTI-EVADE can worsen the target number but never above 6+; they cannot entirely cancel the right to roll.',
    ],
  },
  'victory-points': {
    es: [
      'Al puntuar, aplica las condiciones de la Carta de Misión a los Marcadores de Misión y otros objetivos que correspondan. Los puntos también pueden proceder de pérdidas de Suministro o de otras reglas expresas.',
      'La FAQ aclara que una bajada del Suministro Actual, incluso por MORPH, da al oponente tantos PV como puntos de Suministro se perdieron.',
      'Al inicio de la fase de puntuación final, las unidades que continúen en Reservas se consideran Destruidas y se puntúan según la Carta de Misión. Ambos jugadores suman simultáneamente los PV de los objetivos y demás fuentes aplicables.',
      'Si una condición especial de victoria se cumple, su jugador gana de inmediato. Si un jugador se queda sin miniaturas en mesa y sin unidades en Reservas, la partida acaba y el superviviente recibe 10 PV adicionales.',
      'Al llegar al límite de rondas, gana el total de PV más alto. En empate se aplica el desempate de la Carta de Misión y, si no existe, el resultado es tablas.',
    ],
    en: [
      'During scoring, apply the Mission Card’s conditions to controlled Mission Markers and any other relevant objectives. Points may also arise from lost Supply or other explicit rules.',
      'The FAQ clarifies that a fall in Current Supply, including from MORPH, gives the opponent VP equal to the Supply lost.',
      'At the start of the final Scoring Phase, units still in Reserves count as Destroyed and score according to the Mission Card. Both players tally VP from objectives and other applicable sources simultaneously.',
      'A fulfilled Special Winning Condition gives its player an immediate win. If a player has neither models on the table nor units in Reserves, the game ends and the survivor gains 10 additional VP.',
      'At the round limit, the higher VP total wins; a tie uses the Mission Card’s tiebreaker, or remains a draw if none exists.',
    ],
  },
};
