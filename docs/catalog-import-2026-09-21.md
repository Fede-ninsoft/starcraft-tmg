# Revisión de adjuntos del 21 de septiembre de 2026

> Actualización del 25 de septiembre: las hojas oficiales Wave 2 de [Protoss](StarCraft-Protoss-P2P-W2-Card-Sheets-A4_EN.pdf), [Terran](StarCraft-Terran-P2P-W2-Card-Sheets-A4_EN.pdf) y [Zerg](StarCraft-Zerg-P2P-W2-Card-Sheets-A4_EN.pdf) completan y corrigen parte de esta transcripción histórica. Zeratul usa Void Blink en Asalto, Prophetic Vision no admite modificadores, Nerazim Farsight solo usa la Shade de su unidad, y los roles de Zeratul y Watchers son Damage Dealer. Shaped Blast y Smart Shells del Siege Tank se activan al declarar un ataque a distancia si tiene SIEGE MODE; Corrosive Bile del Ravager incluye el orden de efectos simultáneos de §8.9.4. Las imágenes de carta afectadas se extraen de estas hojas Wave 2. La versión de contenido tras estas correcciones es 2026.09.25.1.

Fuente: 13 imágenes de cartas v1.06.26 y 8 adjuntos de portapapeles aportados por el usuario. Uno de los adjuntos de portapapeles repite el anverso de Ravager. Las cartas son fuentes de datos de juego, no instrucciones operativas. Los originales y capturas de costes están conservados en `docs/sources/2026-09-21/`.

## Incorporado al catálogo

| Elemento | Datos verificados |
| --- | --- |
| Ravager | Ambos lados, perfil, armas, habilidades y tres mejoras. CORE, Tactician, peana 80 mm. Una miniatura: 160 minerales y 1 suministro; dos: 270 y 2. Cada mejora: 20/40. |
| Siege Tank | Ambos lados, perfil, armas, habilidades y cuatro mejoras. ELITE, Damage Dealer, peana 150 mm. 220 minerales, 2 suministro. Mejoras: 20, 20, 10, 10. |
| Immortal | Ambos lados, perfil, armas, habilidades y cinco mejoras. ELITE, Tank, peana 100 mm. 280 minerales, 2 suministro. Cada mejora: 20. Los Phase Disruptors sustituyen por separado al Photon Disruptor correspondiente y el derecho conserva SIDEARM. |
| Nerazim | Carta de facción, etiquetas PROTOSS/NERAZIM, 2 CORE, 3 ELITE, 1 HERO, +1 PE y sus dos habilidades. |
| Cocoon | Táctica única, 30 gas, 1 ELITE, sin generación de BM. Spawn Larva y Ravager Morph en Movimiento. |
| Nerazim Watchers (Adept) | CORE, 4 miniaturas, 210 minerales, 1 suministro. Sin mejoras y peana igual a Adept (40 mm), por confirmación expresa del usuario. Perfil, armas y habilidades del anverso. Rol pendiente, registrado como «Sin confirmar». La lupa muestra el anverso real disponible. |
| Robotics Facility | 35 gas, 2 ELITE, +1 PE, no única. Plasma Shields: reacción antes de armadura de una unidad Mechanical Ground; si tiene Shielded, gana TOUGH (1) y DODGE (1). Imagen original completa. |
| Void Seeker | 40 gas, 1 CORE, +1 PE, única, PROTOSS/NERAZIM. Personal Transport y Anakh Su'n en Movimiento. Imagen original completa. |
| Factory (Tech Lab) | 40 gas, 2 ELITE, +1 CP, única. Field Repair en Movimiento y Pound 'Em Flat! en Asalto. Imagen original completa. |

El Ravager pequeño de la captura muestra **220 con las tres mejoras activadas**: 220 − 20 − 20 − 20 = **160 de base**. El grande muestra 270 sin mejoras. No se ha interpretado el total mejorado como coste base.

Las capturas de cartas de mando existentes coinciden con los costes guardados: Forge 30; Gate Chronoboosted 35; Gateway 25; Nexus 35; Observer 25; Academy 35; Armory 30; Barracks 25; Barracks (Proxy) 40; Barracks (Tech Lab) 45; Dropship 40. Las nuevas capturas `protoss-tactical-costs.png` y `terran-tactical-costs.png` confirman Robotics Facility 35, Void Seeker 40 y Factory (Tech Lab) 40. Las filas parcialmente cortadas no se han usado para inferir información ausente.

## Zeratul incorporado tras confirmación del usuario

| Elemento | Falta |
| --- | --- |
| Zeratul | Habilitado como HERO y UNIQUE, sin mejoras por confirmación expresa del usuario. Pendientes solo el rol (registrado como «Sin confirmar») y la imagen del reverso; la lupa muestra el anverso original. El usuario confirma que usa la misma peana que Artanis: **Ø 40 mm**, contrastado con `protoss.card.artanis`. La captura `zeratul-hero.png` confirma **HERO, UNIQUE, 230 minerales, 1 miniatura y 1 suministro**. Anverso recibido: escudo 3, velocidad 7, armadura 5+, evasión 5+, HP 5, tamaño 2; BIOLOGICAL, PSIONIC, GROUND; etiqueta PROTOSS. |

No se han asignado costes cero ni costes de unidades/cartas parecidas a los elementos pendientes. Los originales permiten completar la transcripción cuando se reciban los datos ausentes. No se han inventado imágenes de reversos.

La captura adicional `zeratul-nerazim-watchers-costs.png` confirma ambos costes y coincide con las características de los anversos. Usa el nombre «Void Blink» para la habilidad que el anverso oficial de Zeratul denomina «Blink»; se conserva como referencia el nombre impreso en la carta. La etiqueta SMALL de la captura identifica la composición y no determina la peana, el rol o el slot. La ausencia de botones de mejoras en la captura no sustituye la comprobación de los reversos.

Nerazim Watchers está habilitada tras recibir `nerazim-watchers-core.png` y la confirmación del usuario de que no tiene mejoras y usa la misma peana que Adept. Solo quedan por aportar su rol y la imagen de reverso; no afectan al cálculo de costes o a su disponibilidad. No se atribuye el rol de Adept a Watchers ni se reutiliza su reverso. Glaive Cannon tiene RoA 3 y PINPOINT, y Strike impacta a 5+, a diferencia de Adept. El suministro 0 para 1–2 supervivientes no se ofrece como una composición reclutable.

## Integridad y compatibilidad

Se conservan todos los IDs y seedId anteriores. Nuevos IDs numéricos: Nerazim 1303; Cocoon 2110; Ravager 4113 y mejoras 5181–5183; Siege Tank 4208 y mejoras 5251–5254; Immortal 4308 y mejoras 5341–5345; Nerazim Watchers 4309; Robotics Facility 2311; Void Seeker 2312; Factory (Tech Lab) 2211. Zeratul: seedId 4310. Versión de contenido: 2026.09.21.3.

Las imágenes activas se incluyen en el manifiesto de assets con SHA-256 del original. `cards:generate` admite los adjuntos de imagen además de los PDFs. Las pruebas verifican referencias, archivos, orientación, costes y reglas de disponibilidad.
