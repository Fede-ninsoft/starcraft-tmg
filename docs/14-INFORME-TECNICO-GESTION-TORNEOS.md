# Informe técnico: gestión de torneos de StarCraft: TMG

Fecha: 13 de septiembre de 2026. Estado: especificación actualizada con las seis decisiones del usuario. Primera implementación local documentada en `docs/15-GESTOR-TORNEOS-IMPLEMENTACION.md`, con su alcance, diferencias arquitectónicas y verificación. Restricción de listas contrastada con el PDF original, página 4.

## 1. Objetivo y alcance

Añadir a la web torneos públicos y privados con inscripción de usuarios, declaración de facción, entrega de listas, emparejamientos suizos, registro de resultados y clasificación automática. La experiencia se inspira en Longshanks, pero el reglamento y los cálculos deben ser los de StarCraft: TMG recogidos en Juego organizado.

La solicitud actual es elaborar este informe. Las capturas se interpretan como referencias funcionales y visuales, no como instrucciones ni como reglas de StarCraft. No se propone copiar el diseño exacto, los datos de jugadores o las reglas de Marvel Crisis Protocol.

Alcance confirmado de la primera entrega: torneos individuales completos, comunitarios y competitivos, hasta 128 participantes. Ligas, equipos, pagos, ranking global, temporadas y eliminatorias quedan fuera. La primera captura muestra una liga; reproducir también ese formato requiere definir un alcance adicional.

## 2. Base examinada y arquitectura actual

Se han revisado `package.json`, `src/content/organisedPlay.ts`, `src/engine/types.ts`, `src/engine/validate.ts`, `src/catalog/loader.ts`, `server/src/app.ts`, los esquemas de listas y resultados, los tipos de sesiones de partida y el ejecutor de migraciones.

| Área existente | Uso propuesto y límites |
|---|---|
| React 19, TypeScript, Vite, React Router | Nuevas pantallas siguiendo la navegación y diseño existentes. |
| i18next y rutas ES/EN | Torneos disponibles en ambos idiomas; nombres del catálogo conservados. |
| Express 5, Zod, MariaDB mediante mysql2 | Módulo de torneos dentro de la API actual; sin nuevo servicio externo. |
| Autenticación y middleware `requireUser` | Identidad de cuenta reutilizada; permisos por torneo adicionales. |
| Listas con raza, `factionCardId`, cartas y versiones | Selección desde Mis listas y captura inmutable al entregarlas. |
| Motor puro de costes y validación | Reutilizar en servidor; Zod valida estructura, no garantiza legalidad. |
| Sesiones de partida con revisión y misión capturada | Integración opcional futura; no equivalen a una partida oficial entre dos cuentas. |
| Historial de listas con WIN/LOSS/DRAW | Insuficiente como almacenamiento de torneo: faltan MP, TP, rondas, dos participantes y trazabilidad oficial. |
| PWA y persistencia local | Lectura auxiliar; inscripciones, resultados y emparejamientos requieren servidor. |
| Migraciones SQL existentes | Añadir migraciones idempotentes compatibles con el ejecutor actual. |

No aparece un módulo de torneos conectado a la API examinada. El catálogo se carga actualmente desde JSON; conservar versiones históricas utilizables en servidor es trabajo nuevo. No se ha ejecutado la aplicación ni auditado su seguridad completa para este informe.

## 3. Qué tomar de Longshanks

La portada pública confirma descubrimiento de eventos, organización, emparejamientos, clasificación y desempates automáticos, y envío de resultados por jugadores: [Longshanks](https://longshanks.org/) (consulta: 13/09/2026). La página de ayuda no pudo recuperarse; no se atribuyen a Longshanks mecanismos internos de permisos, confirmación o algoritmos concretos.

| Referencia aportada | Adaptación propuesta |
|---|---|
| Captura 1: ficha y herramientas | Nombre, organizador, lugar, fechas, plazas, formato, estado y acciones según permisos. |
| Capturas 2 y 4: clasificación | Posición, jugador, raza/facción, listas, MP, TP, V/E/D, SoS y oTP. |
| Captura 3: partidas por ronda y mesa | Selector de ronda, mesa, rivales, resultado, listas elegidas, misión y despliegue si se registran. |
| Captura 5: visor de lista | Visor de la lista entregada, unidades, mejoras, costes, suministro y cartas; impresión. |

La web conservaría su identidad visual. En móvil se priorizan «Mi mesa», «Enviar resultado» y «Mi inscripción». Los estados deben tener texto además de color y los modales deben funcionar con teclado. Compartir evento puede entrar en la primera entrega; calendario, seguimiento y mensajería son mejoras posteriores.

## 4. Reglas que debe representar el sistema

Fuente funcional: `src/content/organisedPlay.ts`, especialmente `roles-requirements`, `event-size-format`, `army-rosters`, `pairings`, `scoring-standings` y `judging-conduct`. Es la guía publicada en el proyecto, no una nueva certificación de la edición oficial vigente. Se ha localizado el documento de origen en `public/documents/StarCraft-TMG-Organised-Play_EN.pdf` y comprobado su página 4; conservar su huella y versión al implementar el perfil competitivo.

### Formato y organización

- Comunitario: Skirmish o Standard; adaptaciones publicadas antes del cierre de inscripción. Recomendaciones: 4–8 jugadores, 2–3 rondas; 9–16, 3 rondas; 17–32, 4 Skirmish o 3 Standard.
- Competitivo: Standard; 12–32 jugadores, 3 rondas en un día; 33–128, 5 rondas en dos días. Fuera de esas franjas no presentar automáticamente una configuración como reglada.
- No hay top cut: todos los jugadores activos juegan todas las rondas.
- Standard: 2000 minerales y 200 gas. Skirmish: 1000 y 100. Grand Offensive existe en el constructor, pero no está definido para estos perfiles.
- Publicar rondas, horario, fecha límite de reglas, plazo y publicación de listas, mapas, plataforma, contacto de conducta y condiciones de accesibilidad. Mesa de 36 × 54 pulgadas; registrar mapas y requisitos de terreno como documentación del evento.
- Fecha límite de reglas recomendada: dos semanas antes. El PDF indica entrega de listas una semana antes; por decisión del usuario, la aplicación ofrece ese valor inicial y permite al creador fijar, ampliar o reabrir el plazo. El organizador determina su publicación y anuncia posibles sanciones por retraso.
- TO y árbitro principal no compiten en competitivo. En comunitario el TO puede competir; las sanciones de todo el evento pasan al árbitro principal. El árbitro que juega es suplente, sin clasificación ni premios, con exclusiones específicas de SoS/oTP.
- Cambios de rondas: anunciados antes de la primera; reducción por caída de asistencia como máximo al inicio de la segunda. Registrar motivo y anuncio, sin un bloqueo absoluto que impida esta excepción.
- Miniaturas, WYSIWYG y accesibilidad física requieren comprobación humana; la aplicación recoge requisitos y revisión, no certifica su cumplimiento.

### Listas

Formato por defecto propuesto: Dual List, una o dos listas de la misma facción, cada una con sus cartas; Single List permitido si se anuncia. Incluir jugador, unidades, equipo, mejoras, suministro y minerales por unidad y totales, gas de tácticas, dos misiones y dos despliegues.

La app distingue `race` (ZERG/TERRAN/PROTOSS) de `factionCardId`. El PDF original, página 4, define «faction» como Terran, Protoss o Zerg y exige que ambas listas sean de la misma. Por tanto, exigir igualdad de `race`, pero permitir diferentes `factionCardId`, siempre que cada lista sea legal. Mostrar raza en la inscripción y carta de facción en cada lista; no imponer una única carta de facción a la inscripción.

Validar propiedad, escala, contenido, legalidad y versión en servidor. Guardar una copia completa y versionada independiente de la lista original, con huella de integridad e informe de validación. Editar o borrar la lista personal no cambia la entregada. El catálogo histórico permite reconstruir costes sin convertir los totales enviados por el cliente en autoridad.

Estados de entrega: borrador, presentada, requiere corrección, aprobada y bloqueada. Antes de empezar, ampliar o reabrir el plazo permite al participante entregar y actualizar listas, que vuelven a revisión. Las listas utilizadas en partidas permanecen bloqueadas; sus correcciones requieren control arbitral, motivo y nueva versión, conservando la versión usada en partidas previas. Las listas entregadas se muestran al oponente antes de jugar. En Dual List la elección para la partida se revela simultáneamente: primera entrega mediante procedimiento físico o árbitro y posterior registro; una selección digital secreta exigiría endpoints que oculten la elección hasta que ambos confirmen.

### Puntuación automática

Usar el valor absoluto de la diferencia de PV; una ventaja de 1 o 2 PV sigue siendo estancamiento a efectos de torneo.

| Resultado | Diferencia Standard | Diferencia Skirmish | Lado ganador MP/TP | Otro lado MP/TP |
|---|---:|---:|---:|---:|
| Aniquilación | ≥10 | ≥8 | 3 / 5 | 0 / 0 |
| Victoria decisiva | 7–9 | 6–7 | 3 / 4 | 0 / 1 |
| Avance | 3–6 | 3–5 | 3 / 3 | 0 / 2 |
| Estancamiento | 0–2 | 0–2 | 1 / 2 | 1 / 2 |
| Concesión | No aplica | No aplica | 3 / 5 | 0 / 0 |
| Bye | No aplica | No aplica | 3 / 4 | Sin oponente |
| Incomparecencia / walkover | No aplica | No aplica | 3 / 4 | 0 / 0 |
| Game Loss arbitral | No aplica | No aplica | 3 / 5 | 0 / 0 |

Agotar el tiempo usa los PV reales y la tabla normal. No inventar PV para un bye o sanción. V/E/D se deriva del resultado de torneo, no de un WIN del historial personal. Las victorias especiales del gestor de partida necesitan una correspondencia reglamentaria explícita antes de importarse automáticamente.

Orden descendente: **MP → TP → SoS → oTP**. SoS = media de MP finales de los rivales elegibles; oTP = media de sus TP finales. Excluir bye, walkover e incomparecencia tanto del numerador como del denominador. Incluir concesiones. Conservar las aportaciones finales de retirados a sus anteriores rivales y excluir los enfrentamientos con árbitro suplente según la guía. Muestra vacía: cero.

Mostrar cuatro decimales y comparar fracciones sin redondear, mediante productos cruzados. Empate en las cuatro métricas: puesto compartido, sin desempate oculto por nombre, PV o identificador. Durante el evento mostrar clasificación provisional con los totales disponibles; al finalizar, recalcular con los totales finales. Las reglas de inclusión de Game Loss y el alcance exacto de la exclusión del suplente deben fijarse en pruebas de referencia antes de cerrar el motor.

### Tiempos y arbitraje

Ronda de 150 minutos con draft incluido; avisos a 0, 15, 45, 75, 120, 135 y 145 minutos. Posible ampliación de 15 minutos en la primera para principiantes, anunciada. Al quedar 15 minutos se avisa de no iniciar otra ronda de batalla. Guardar inicio y duración en servidor; el reloj visual no confirma ni modifica resultados por sí solo. Menos de dos rondas de batalla completadas requiere revisión arbitral.

Registrar Caution, Warning, Game Loss y descalificación, con acumulación durante el evento, autor y motivo. Game Loss corresponde al árbitro principal; descalificación al árbitro principal y TO, ajustando autoridad cuando el TO juega. Una descalificación elimina la elegibilidad para premios y futuras rondas, pero conserva resultados terminados. Las notas privadas de conducta no forman parte de la clasificación pública. Facilitar exportación para comunicaciones externas, sin enviar automáticamente datos al editor.

## 5. Inscripción, privacidad y permisos

Todos los torneos publicados son visibles en la sección Torneos, incluidos los privados. `registrationMode: OPEN | INVITE_ONLY` distingue inscripción pública y privada; no es una restricción de visibilidad. Separar este campo del estado del torneo y de inscripción. Los borradores no se publican.

| Actor | Permisos propuestos |
|---|---|
| Visitante | Consultar todos los torneos publicados y sus datos públicos, incluidos los de inscripción privada. |
| Usuario con sesión | Inscribirse en públicos antes del comienzo, con plaza y requisitos; en privados tras canjear invitación. |
| Participante | Gestionar su inscripción y listas dentro de plazo, ver sus emparejamientos, registrar su resultado sin confirmación del rival o comunicar una discrepancia. |
| TO | Crear/configurar su evento, gestionar invitaciones, participantes, rondas, publicación y correcciones justificadas. |
| Árbitro principal / de mesa | Revisiones y sanciones según competencias de la guía, dentro del torneo asignado. |

Cualquier cuenta verificada puede crear torneos, por decisión del usuario. Los roles son locales al torneo; no convertir al TO en administrador global. Cuando un organizador juega, sus propios resultados controvertidos deben resolverse por otro árbitro autorizado.

Los torneos públicos y privados publicados aparecen en el mismo directorio y permiten consultar ficha, participantes, emparejamientos y resultados publicados. En los privados, el enlace solo habilita la inscripción con cuenta; conocer el ID o ver su ficha no permite unirse. Contactos personales, tokens y notas arbitrales siguen restringidos. Las listas respetan su fecha de publicación y el acceso previo del oponente; publicar una copia de torneo no publica la lista personal en el directorio global.

Invitaciones con token criptográfico de al menos 128 bits, hash almacenado, caducidad y revocación. El enlace concede inscripción, nunca administración. Puede compartirse entre varias personas: no equivale a invitación nominal. Permitir rotación; revocarlo no expulsa a quienes ya se inscribieron. Evitar tokens en analítica, logs, referrers y caché de la PWA; canjear y limpiar la URL. Comprobar permisos también en exportaciones y accesos por ID.

Condición de inscripción evaluada atómicamente con hora del servidor: evento publicado, inscripción abierta, `now < startsAt`, sin inicio efectivo, plaza disponible, sin inscripción duplicada y, si es privado, invitación válida. Cerrar aunque el TO se retrase en pulsar «Iniciar». Al iniciar antes de la hora prevista también cerrar. Guardar fechas UTC y zona IANA del evento.

**Plazo de listas decidido:** el creador fija `rosterDeadlineAt` y puede modificarlo, incluso reabrirlo tras vencer, para permitir entregas tardías. La semana anterior que indica el PDF será un valor inicial editable, no un bloqueo obligatorio. Publicar el plazo vigente y registrar cada cambio, autor y fecha; si difiere del PDF, mostrarlo como condición específica del evento. La inscripción sigue permitida antes del inicio aunque el plazo de listas haya vencido: queda pendiente de entrega hasta que el TO lo amplíe. Ampliar el plazo no reabre inscripciones de un torneo iniciado ni desbloquea listas usadas en partidas; las correcciones de estas siguen bajo control arbitral. Comprobar el plazo vigente en servidor al guardar y serializar su edición con la entrega para evitar carreras.

Retirada antes del inicio: liberar plaza según política anunciada. Tras comenzar: drop irreversible, sin reentrada, conservar historial. Ausencia sin aviso: retirada y walkover después de confirmación del organizador, no por un temporizador del navegador. Lista de espera opcional posterior; en la primera entrega mostrar aforo completo.

## 6. Ciclo de vida y emparejamientos

Torneo: `DRAFT → PUBLISHED → IN_PROGRESS → COMPLETED`, con `CANCELLED` y cierre de inscripción independiente. Iniciar exige participantes elegibles, configuración válida y listas aprobadas o excepción autorizada. Finalizar exige todas las rondas previstas cerradas y ninguna disputa pendiente.

Ronda: `DRAFT → PUBLISHED → ACTIVE → CLOSED`. Generar sobre una instantánea de participantes y clasificación; revisar antes de publicar. No generar la siguiente mientras haya resultados sin registrar o disputas sin resolver. El algoritmo debe:

1. Excluir retirados/descalificados y gestionar al suplente comunitario de forma explícita.
2. Asignar bye en la franja inferior a alguien sin bye; nunca repetirlo mientras otro elegible no tenga ninguno.
3. Emparejar primera ronda al azar reproducible o con siembra anunciada.
4. En posteriores agrupar por historial/MP y minimizar distancias, evitando rivales repetidos donde sea posible.
5. Usar búsqueda con retroceso o emparejamiento de coste mínimo; una selección voraz puede crear repeticiones evitables.
6. Guardar semilla, versión de algoritmo, entrada, flotaciones entre grupos y excepciones. Si las restricciones no se pueden satisfacer, devolver propuesta y conflicto para resolución explícita del TO.

La prioridad exacta entre distancia de puntuación y evitar repeticiones es política propuesta que debe publicarse. Las preferencias de club o mesa no pueden alterar silenciosamente el criterio competitivo. Un jugador ocupa una sola plaza por ronda, también cuando recibe bye; una mesa tiene como máximo un encuentro activo.

Editar emparejamientos de borrador es reversible. Una vez iniciados los encuentros no regenerar la ronda: gestionar incidencias individualmente. Corregir un resultado de una ronda cerrada recalcula clasificación y marca borradores posteriores como obsoletos; si la siguiente ya se publicó o comenzó, conserva los encuentros y exige resolución arbitral registrada. Reabrir un torneo terminado crea revisión y nueva publicación de clasificación, conservando la anterior.

## 7. Resultados y trazabilidad

Formulario: PV de ambos lados, tipo de final, listas elegidas, y opcionalmente misión, despliegue y rondas de batalla completadas. Exigir la información necesaria para decidir revisión arbitral si se registra una partida acortada. El servidor deriva MP/TP; no acepta puntuaciones de torneo arbitrarias del jugador.

Flujo decidido: `PENDING → RECORDED`, sin confirmación del rival. Cualquiera de los dos jugadores puede registrar el resultado de su encuentro; al guardarse es válido y actualiza la clasificación. El primer envío aceptado impide que otro envío lo sobrescriba: una discrepancia abre `DISPUTED` y un árbitro autorizado la resuelve mediante `RESOLVED`. Las disputas son excepcionales, no un paso obligatorio para cada resultado. El organizador también puede introducir resultados de una hoja física con autor y motivo. Byes los genera el sistema; sanciones solo los roles autorizados.

Guardar revisiones inmutables, resultado registrado, actor, hora y motivo. Una corrección posterior no sobrescribe el historial. Usar `revision` e `If-Match` para evitar que dos dispositivos pisen resultados; conflictos devuelven 409 con estado actual. Doble pulsación o reintento no debe duplicar resultados ni rondas.

La vinculación con `game-sessions` es opcional: precarga el formulario y requiere que un jugador o el TO guarde el resultado oficial; no requiere confirmación del rival. Verificar ambas identidades y listas antes de asociar. Una partida de torneo no debe duplicarse en estadísticas si se proyecta después al historial de listas; usar una clave de origen única y actualizar por revisión.

## 8. Modelo de datos propuesto

| Tabla | Datos principales |
|---|---|
| `tournaments` | ID, slug, TO, modo de inscripción OPEN/INVITE_ONLY, estado, nombre, descripción, lugar, zona horaria, inicio/fin, aforo, plazos, escala, formato de listas, rondas, perfil de reglas y revisión. |
| `tournament_rulesets` | Versión inmutable de reglas, puntuación, desempates, política suiza, calendario y referencia al catálogo histórico. |
| `tournament_staff` | Torneo, usuario y rol arbitral/organizativo; permisos acotados. |
| `tournament_invitations` | Torneo, hash de token, caducidad, revocación y usos si se limitan. |
| `tournament_registrations` | Torneo, usuario, raza, estado, check-in, fecha, elegibilidad para clasificación y premios. |
| `tournament_rosters` | Inscripción, slot 1/2, versión, carta de facción propia, lista de origen opcional, snapshot, catálogo, huella, revisión y aprobación. |
| `tournament_rounds` | Torneo, número, estado, horarios, semilla, versión y huella de entrada del emparejamiento. |
| `tournament_matches` | Ronda, mesa, tipo normal/bye, estado, vínculo opcional a sesión y revisión. |
| `tournament_match_players` | Encuentro, ronda, inscripción, lado y versión de lista elegida. |
| `tournament_result_revisions` | Encuentro, revisión, PV, final, MP/TP derivados, política de cómputo, remitente, fecha de registro y resolución si hubo disputa. |
| `tournament_penalties` | Inscripción, encuentro opcional, tipo, motivo, responsables y fecha. |
| `tournament_audit_events` | Acciones administrativas, transición, actor, motivo y referencias a revisiones. |
| `tournament_standing_snapshots` | Publicación/revisión, clasificación calculada y huella de resultados; reconstruible. |

Claves únicas: inscripción `(tournament_id, user_id)`, ronda `(tournament_id, number)`, presencia `(round_id, registration_id)`, lado `(match_id, slot)` y revisión `(match_id, revision)`. Claves foráneas y validación transaccional impiden mezclar participantes, listas o rondas de torneos distintos. Los byes tienen un solo participante, no un usuario ficticio.

Inscripción/aforo e inicio comparten bloqueo de la fila del torneo para evitar carreras. Generación/publicación de ronda bloquea su transición y verifica revisión; los resultados se registran y recalculan dentro de una transacción coherente. Guardar resultados derivados con versión para auditoría, pero reconstruirlos desde datos originales; no sumar incrementalmente sin posibilidad de recálculo.

## 9. API e interfaz

Nuevo módulo `server/src/modules/tournaments/` con rutas, schemas, servicios de dominio y repositorios. Motor puro propuesto en `src/engine/tournaments/`: `scoring`, `standings`, `pairings` y `ruleset`. Adaptar la compilación para compartirlo con Node sin dependencias de navegador ni aliases sin resolver. La guía seguirá siendo contenido editorial; no analizar sus cadenas traducidas para calcular reglas.

| Endpoint propuesto | Función |
|---|---|
| `GET /api/tournaments` | Directorio público paginado y filtrado. |
| `POST /api/tournaments` | Crear borrador con cuenta autorizada. |
| `GET /api/tournaments/:id` | Vista con campos y autorización según actor. |
| `PUT /api/tournaments/:id` | Editar configuración con revisión y límites de estado. |
| `POST /api/tournaments/:id/publish` | Validar y publicar. |
| `POST /api/tournaments/:id/invitations` | Crear/rotar enlace privado como TO. |
| `POST /api/tournament-invitations/redeem` | Canjear token enviado en el cuerpo. |
| `POST /api/tournaments/:id/registrations` | Inscripción transaccional. |
| `PUT /api/tournaments/:id/registration` | Editar raza/check-in dentro de permisos y plazo; la carta de facción pertenece a cada lista. |
| `POST /api/tournaments/:id/withdraw` | Baja o drop según estado. |
| `PUT /api/tournaments/:id/rosters/:slot` | Entrega de copia versionada. |
| `POST /api/tournaments/:id/start` | Congelar configuración operativa e iniciar. |
| `POST /api/tournaments/:id/rounds/generate` | Generar borrador reproducible. |
| `POST /api/tournaments/:id/rounds/:number/publish` | Publicar tras comprobar vigencia del borrador. |
| `POST /api/tournaments/:id/rounds/:number/start` | Iniciar reloj y ronda. |
| `POST /api/tournament-matches/:id/results` | Registrar resultado válido inmediatamente, sin confirmación del rival. |
| `POST /api/tournament-matches/:id/dispute` | Abrir disputa. |
| `POST /api/tournament-matches/:id/resolve` | Resolver/corregir con permiso arbitral. |
| `POST /api/tournaments/:id/penalties` | Registrar sanción con autoridad adecuada. |
| `POST /api/tournaments/:id/rounds/:number/close` | Cerrar solo si todos los encuentros están resueltos. |
| `GET /api/tournaments/:id/standings` | Clasificación provisional o final. |
| `POST /api/tournaments/:id/complete` | Validar cierre y publicar resultado final. |

Añadir endpoints de lectura de participantes, listas y rondas, y operaciones de cancelación/reapertura con las mismas políticas. Validación de origen/CSRF en operaciones autenticadas con cookies, consultas parametrizadas, limitación de intentos de token y DTO distintos para vistas públicas y privadas. Autorización en cada operación, no solo al cargar la página.

Pantallas: directorio «Torneos» y «Mis torneos»; creación guiada; ficha con pestañas Información, Participantes, Rondas, Clasificación y Reglamento; Mi inscripción con listas; panel organizador con pendientes; detalle de mesa y visor de lista. Rutas propuestas `/es/torneos` y `/en/tournaments` con detalle por ID/slug. Actualización inicial mediante polling condicionado por revisión y refresco al recuperar foco; evaluar SSE después. Sin confirmar acciones offline ni cachear respuestas privadas de forma persistente.

## 10. Entregas y validación

1. **Cerrar decisiones y reglas:** aplicar las decisiones de la sección 11, versionar el PDF de origen y resolver los detalles reglamentarios restantes, definir casos numéricos de referencia y esquema de permisos.
2. **Eventos e inscripciones:** migraciones, directorio, privados, roles, plazos y snapshots de listas con validación en servidor.
3. **Competición completa:** motor, emparejamientos, byes, resultados directos, disputas, sanciones, reloj y clasificación. No presentar la fase 2 como gestor de torneos completo.
4. **Piloto y publicación:** torneo simulado comunitario y competitivo, móvil, permisos, concurrencia y recuperación; documentación del organizador y exportación de resultados.
5. **Mejoras posteriores:** integración avanzada del gestor de partida, calendario, seguimiento, estadísticas agregadas y ligas si se solicitan.

Migraciones aditivas, funcionalidad tras bandera y ensayo con copia de datos. Una reversión desactiva la función y conserva el historial; no elimina torneos para deshacer un despliegue. El alcance requiere motor competitivo, persistencia e interfaz; no es solo una pantalla. Estimar calendario tras resolver reglas y tamaño del equipo, sin prometer una fecha sin esas dependencias.

Pruebas de aceptación mínimas:

- Inscripción pública antes del inicio aceptada; a la hora exacta rechazada. Dos usuarios disputando última plaza producen una sola alta.
- Torneo privado publicado visible en el directorio y con resultados consultables; inscripción sin enlace o con token revocado rechazada. Ver su ID no concede inscripción ni permisos de gestión.
- Cualquier cuenta verificada crea un torneo; una no verificada no puede.
- Plazo de listas fijado, vencido y reabierto por el TO: entregas se aceptan según el plazo vigente, con cambio auditado; listas ya usadas siguen bloqueadas.
- Tercera lista o raza distinta rechazada; misma raza con distintas cartas de facción legales aceptada; catálogo posterior no altera un torneo empezado; borrar original no borra snapshot.
- Fronteras de PV 0, 2, 3, 5, 6, 7, 8, 9 y 10 para ambas escalas; diferencias negativas simétricas; 12–10 da 1 MP/2 TP a cada uno.
- Bye, concesión, walkover, Game Loss, retirada, descalificación y suplente; revisión de todas las exclusiones de métricas.
- Ejemplo SoS/oTP: rivales elegibles con MP finales 6 y 3, TP 9 y 5, más un bye: SoS 4,5000 y oTP 7,0000. No dividir entre tres.
- Empates compartidos, valores que parecen iguales a cuatro decimales y recálculo tras corrección de un rival.
- Suizo con pares/impares, 12, 32, 33 y 128 inscritos, byes no repetidos y casos donde un algoritmo voraz fallaría; misma semilla y entrada producen idéntico resultado.
- Doble generación y envíos simultáneos no duplican ni pisan datos; un solo envío válido actualiza clasificación sin acción del rival. Correcciones posteriores pasan por arbitraje.
- Ronda no cerrable con disputa; corrección posterior conserva emparejamientos activos y actualiza clasificación.
- Usuario retirado no vuelve; TO/árbitro competitivo no entra en emparejamientos; notas arbitrales no se publican.
- Flujos completos en español/inglés y móvil; recuperación tras recarga y pérdida de conexión sin mostrar falsos éxitos.

Usar Vitest y fast-check ya disponibles para el motor; integración contra MariaDB para transacciones y restricciones; pruebas de API para permisos y recorrido completo de torneo. Para la implementación ejecutar typecheck, tests, build frontend y build servidor. Este informe solo modifica documentación, por lo que no se han ejecutado builds ni pruebas funcionales.

## 11. Decisiones confirmadas

| Área | Decisión |
|---|---|
| Creación | Cualquier cuenta verificada puede crear torneos. |
| Listas tardías | El creador fija y puede ampliar o reabrir el plazo de entrega. |
| Dual List | Aplicar el PDF: misma raza Terran/Protoss/Zerg; las cartas de facción pueden diferir. |
| Públicos y privados | Todos los publicados se ven en Torneos; privados requieren enlace para inscribirse. |
| Resultados | Válidos al guardarlos, sin confirmación del rival. |
| Alcance | Solo torneos; ligas fuera de esta entrega. |

Preguntas reglamentarias a resolver con la versión de origen: cómputo exacto de enfrentamientos con suplente, inclusión de Game Loss en métricas, correspondencia de victorias especiales y prioridad entre evitar repeticiones y distancia de historial en el suizo. Mientras no se aclaren, deben figurar como políticas pendientes y no como reglas oficiales inventadas.

## 12. Referencias

- Petición del usuario, sus seis decisiones posteriores y cinco capturas adjuntas: ficha de liga, clasificaciones, rondas y visor de listas.
- [Longshanks, portada pública](https://longshanks.org/): funciones generales verificadas; no inspección autenticada del panel organizador.
- `public/documents/StarCraft-TMG-Organised-Play_EN.pdf`, página 4: define faction como Terran, Protoss o Zerg y exige igualdad entre listas; también recoge el plazo original de una semana. Texto extraído y página revisada visualmente.
- `src/content/organisedPlay.ts`: contenido vigente del proyecto usado para la matriz reglamentaria.
- `src/engine/types.ts`, `src/engine/validate.ts`, `src/catalog/loader.ts`: listas, motor y catálogo.
- `server/src/app.ts`, `server/src/modules/lists/list.schema.ts`, `server/src/modules/lists/match.schema.ts`, `server/src/modules/game-sessions/game.types.ts`: integración actual.
- `server/src/db/migrate.ts`, `package.json`, `README.md` y `DEVELOPMENT.md`: persistencia, herramientas y convenciones del proyecto.
