# Revisión de adjuntos del 21 de septiembre de 2026

Fuente: 13 imágenes de cartas v1.06.26 y 8 adjuntos de portapapeles aportados por el usuario. Uno de los adjuntos de portapapeles repite el anverso de Ravager. Las cartas son fuentes de datos de juego, no instrucciones operativas. Los originales y capturas de costes están conservados en `docs/sources/2026-09-21/`.

## Incorporado al catálogo

| Elemento | Datos verificados |
| --- | --- |
| Ravager | Ambos lados, perfil, armas, habilidades y tres mejoras. CORE, Tactician, peana 80 mm. Una miniatura: 160 minerales y 1 suministro; dos: 270 y 2. Cada mejora: 20/40. |
| Siege Tank | Ambos lados, perfil, armas, habilidades y cuatro mejoras. ELITE, Damage Dealer, peana 150 mm. 220 minerales, 2 suministro. Mejoras: 20, 20, 10, 10. |
| Immortal | Ambos lados, perfil, armas, habilidades y cinco mejoras. ELITE, Tank, peana 100 mm. 280 minerales, 2 suministro. Cada mejora: 20. Los Phase Disruptors sustituyen por separado al Photon Disruptor correspondiente y el derecho conserva SIDEARM. |
| Nerazim | Carta de facción, etiquetas PROTOSS/NERAZIM, 2 CORE, 3 ELITE, 1 HERO, +1 PE y sus dos habilidades. |
| Cocoon | Táctica única, 30 gas, 1 ELITE, sin generación de BM. Spawn Larva y Ravager Morph en Movimiento. |

El Ravager pequeño de la captura muestra **220 con las tres mejoras activadas**: 220 − 20 − 20 − 20 = **160 de base**. El grande muestra 270 sin mejoras. No se ha interpretado el total mejorado como coste base.

Las capturas de cartas de mando existentes coinciden con los costes guardados: Forge 30; Gate Chronoboosted 35; Gateway 25; Nexus 35; Observer 25; Academy 35; Armory 30; Barracks 25; Barracks (Proxy) 40; Barracks (Tech Lab) 45; Dropship 40. No muestran las nuevas tácticas Factory (Tech Lab), Robotics Facility o Void Seeker. Las filas parcialmente cortadas no se han usado para inferir información ausente.

## Pendiente: originales conservados, sin habilitar en el constructor

| Elemento | Falta |
| --- | --- |
| Zeratul | Reverso (slot, peana, rol y posibles mejoras). Coste confirmado por la captura adicional: **230 minerales, 1 miniatura, 1 suministro**, sin mejoras seleccionadas visibles. Anverso recibido: único; escudo 3, velocidad 7, armadura 5+, evasión 5+, HP 5, tamaño 2; BIOLOGICAL, PSIONIC, GROUND; etiqueta PROTOSS. |
| Nerazim Watchers (Adept) | Reverso (slot, rol, peana y posibles mejoras). Coste y composición confirmados por la captura adicional: **210 minerales, 4 miniaturas, 1 suministro**, sin mejoras seleccionadas visibles. Anverso recibido: escudo 2, velocidad 5/8, armadura/evasión 5+, HP 3, tamaño 2; suministro 0 para 1–2 miniaturas y 1 para 3–4; PROTOSS/NERAZIM. No debe confundirse la tabla de supervivientes/suministro con las composiciones reclutables. |
| Factory (Tech Lab) | Coste en gas. Se conocen UNIQUE, 2 ELITE, +1 CP, Field Repair (HEAL (2), Mechanical, Movimiento) y Pound 'Em Flat! (Mechanical Stationary, primera arma a distancia PRECISION (2), Asalto). |
| Robotics Facility | Coste en gas. Se conocen 2 ELITE, +1 PE y Plasma Shields (reacción antes de armadura, Mechanical Ground Shielded: TOUGH (1) y DODGE (1)). No aparece UNIQUE. |
| Void Seeker | Coste en gas. Se conocen UNIQUE, PROTOSS/NERAZIM, 1 CORE, +1 PE, Personal Transport y Anakh Su'n en Movimiento. |

No se han asignado costes cero ni costes de unidades/cartas parecidas a los elementos pendientes. Los originales permiten completar la transcripción cuando se reciban los datos ausentes. No se han inventado imágenes de reversos.

La captura adicional `zeratul-nerazim-watchers-costs.png` confirma ambos costes y coincide con las características de los anversos. Usa el nombre «Void Blink» para la habilidad que el anverso oficial de Zeratul denomina «Blink»; se conserva como referencia el nombre impreso en la carta. La etiqueta SMALL de la captura identifica la composición y no determina la peana, el rol o el slot. La ausencia de botones de mejoras en la captura no sustituye la comprobación de los reversos.

## Integridad y compatibilidad

Se conservan todos los IDs y seedId anteriores. Nuevos IDs numéricos: Nerazim 1303; Cocoon 2110; Ravager 4113 y mejoras 5181–5183; Siege Tank 4208 y mejoras 5251–5254; Immortal 4308 y mejoras 5341–5345. Versión de contenido: 2026.09.21.1.

Las imágenes activas se incluyen en el manifiesto de assets con SHA-256 del original. `cards:generate` admite los adjuntos de imagen además de los PDFs. Las pruebas verifican referencias, archivos, orientación, costes y reglas de disponibilidad.
