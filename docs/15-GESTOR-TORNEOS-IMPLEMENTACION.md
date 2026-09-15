# Gestión de torneos: primera implementación

Implementada en el entorno local el 13 de septiembre de 2026. No desplegada en producción.

## Uso

1. Abre **Torneos** en el menú, o `/es/torneos` / `/en/tournaments`. El directorio y las fichas publicadas se consultan sin cuenta, también para torneos de inscripción privada.
2. Una cuenta verificada puede crear un borrador, configurar formato, fechas, plazas, mapas y contactos, y publicarlo desde **Organización**.
3. Para inscripción privada, genera el enlace en Organización. Renovarlo o revocarlo invalida el anterior; no elimina inscripciones existentes.
4. El jugador se inscribe indicando raza, confirma asistencia y entrega una o dos listas guardadas según formato. Las dos pueden usar cartas de facción distintas; deben compartir raza. El servidor vuelve a validar cada lista y guarda una copia.
5. El TO puede ampliar o reabrir el plazo de listas. Antes de iniciar, revisa y aprueba las listas de todos los participantes y asigna árbitro principal cuando corresponda, mediante el correo de su cuenta verificada.
6. Inicia el torneo, genera emparejamientos y revísalos en Rondas. Publicarlos y comenzar la ronda son acciones separadas. Una excepción del algoritmo se muestra antes de su publicación.
7. Un jugador registra PV, final y listas utilizadas para su encuentro; no necesita confirmación del rival. La clasificación se recalcula inmediatamente. Un resultado ya registrado requiere corrección arbitral, con motivo y control de revisión.
8. Cierra la ronda cuando todos los resultados estén resueltos. Genera la siguiente, o finaliza el torneo después de las rondas previstas.

Los empates completos comparten puesto. Los indicadores SoS/oTP son provisionales hasta finalizar. Un bye suma 3 MP/4 TP; incomparecencias y concesiones son tipos distintos. El árbitro principal comunitario inscrito juega como suplente solo si la asistencia regular es impar, sin clasificación.

El panel permite registrar sanciones, acordar descalificaciones entre árbitro principal y TO cuando son personas distintas y el TO no juega, ajustar rondas dentro de los plazos de la guía, y reabrir un torneo terminado para correcciones. Las correcciones de listas ya usadas requieren árbitro principal imparcial, entre partidas, y conservan su versión anterior.

## Persistencia y API implementadas

- Migración aditiva `server/src/db/migrations/015_tournaments.sql`.
- `tournaments`: agregado JSON de un torneo con configuración, participantes, listas, catálogo capturado, rondas y sanciones. Campos indexados para propietario, estado y fecha. Límite de 128 participantes.
- `tournament_audit`: historial de comandos por revisión, con datos previos para corregir resultados/listas/configuración sin perder evidencia. Los tokens de invitación no se guardan en el historial.
- Un bloqueo `SELECT … FOR UPDATE` y una revisión optimista protegen cada transición. Dos operaciones concurrentes sobre la misma revisión no se pisan: una recibe 409 y debe recargar.
- `GET /api/tournaments?offset=…`, `GET /api/tournaments/:id`, `POST /api/tournaments`, `POST /api/tournaments/:id/commands` y `GET /api/tournaments/:id/audit`.
- Los comandos se validan con Zod; la identidad procede de la sesión y los permisos se verifican en servidor. Las escrituras requieren cuenta verificada, origen permitido e `If-Match`. Las respuestas usan `Cache-Control: no-store`.
- Las listas y el catálogo completo nunca se incluyen en el directorio. En fichas, las listas respetan la fecha de publicación y el acceso de propietario, árbitros y oponente de la ronda publicada/activa. Los catálogos y hashes de invitaciones no se exponen.

**Diferencia respecto al informe 14:** para esta entrega se ha implementado un agregado transaccional por torneo y comandos tipados, en lugar de las múltiples tablas y endpoints de transición sugeridos. Esto concentra las invariantes del torneo y evita carreras entre aforo, fechas, rondas y resultados. No debe extrapolarse sin mediciones a torneos de más de 128 personas o rankings globales. La normalización posterior puede hacerse manteniendo el motor y el contrato de comandos.

El motor puro está en `src/engine/tournaments.ts`. El servidor reutiliza el catálogo y validador de listas de la web. `npm run build:server` valida TypeScript y empaqueta la API con esbuild, conservando `server/dist/index.js`; el script de despliegue de Plesk también ejecuta este paso. No hace falta un servicio adicional.

## Verificación

- Pruebas del motor: fronteras de PV en ambas escalas, simetría, resultados especiales, byes, empates compartidos, suplente y emparejamientos reproducibles de hasta 128 participantes.
- Pruebas de servicio: torneo completo sin confirmación rival, plazos, privacidad de entregas, invitaciones revocadas, facciones distintas de una misma raza, autoridad de sanciones.
- Prueba HTTP/MariaDB: autenticación, verificación, origen, acceso a borradores, dos inscripciones simultáneas, aforo, entregas, borrado del original, resultados simultáneos, clasificación final y acceso a auditoría. Crea y elimina solo sus UUIDs de prueba.
- Revisión en navegador: directorio y ficha anónimos, navegación autenticada, panel de organización, configuración, cambio ES/EN conservando ID y pantalla móvil de 390 px. Se corrigió un desbordamiento detectado en móvil.

Comandos:

```powershell
npm run db:migrate
npm run typecheck
npm test
npm run build
npm run build:server
$env:TEST_TOURNAMENT_DATABASE='1'
npm exec vitest run tests/server/tournament-database.test.ts
```

La prueba de base de datos se omite en la batería normal si no se activa expresamente. Usa la conexión local configurada en `.env`; no debe ejecutarse contra producción.

## Límites de esta entrega

- Solo torneos individuales; sin ligas, equipos, pagos ni ranking global.
- La selección simultánea de listas y el draft se resuelven en mesa. Después se registran las listas usadas; no se ha conectado automáticamente el gestor de partidas existente.
- El algoritmo genera emparejamientos revisables y avisa de repeticiones o límite de búsqueda. No hay todavía editor manual para intercambiar mesas/jugadores.
- El catálogo se captura al crear el torneo. No se ha construido un archivo externo de todas las ediciones oficiales por fecha; el organizador debe comprobar la correspondencia con el corte de reglas anunciado.
- El reloj muestra tiempo restante y aviso de los últimos 15 minutos; los anuncios verbales, supervisión de draft, terreno y conducta requieren organizador/árbitros.
- El directorio pagina de 25 en 25 y filtra los torneos cargados. No hay buscador global por ciudad ni notificaciones automáticas.
- No se ha realizado un ensayo de concurrencia con 128 navegadores ni un torneo competitivo presencial. La prueba de 128 participantes comprueba el algoritmo, no representa esa carga de uso.

## Ajustes de presentación y filtros

La gestión de árbitros se ha retirado. Solo el organizador administra el torneo, aprueba o corrige listas, resuelve resultados y aplica sanciones. No se exige designar árbitros para iniciar un evento, incluso si el organizador participa en un comunitario. Las asignaciones antiguas no conceden permisos. Los comunitarios admiten participantes y resultados sin listas; los competitivos mantienen listas aprobadas obligatorias. Una lista válida contra el catálogo fijado del torneo se acepta aunque su etiqueta de versión sea distinta.

El organizador puede añadir participantes invitados desde **Participantes y listas**, antes del comienzo y respetando el aforo, también en torneos privados. Basta con nombre y raza: no se crea ninguna cuenta ni se pide correo. Se identifican como «Invitado». Desde **Gestionar**, el organizador confirma asistencia, asigna listas guardadas en su propia cuenta y retira al participante. Las listas mantienen las mismas validaciones, plazo y aprobación que las de usuarios registrados. Los invitados participan en emparejamientos, resultados y clasificación con un identificador propio del torneo; las altas y entregas quedan registradas en el historial.

Fichas compactas, formularios agrupados por color y tablas de participantes/clasificación con emblemas de raza, listas, estados y resultados diferenciados. Mapas y contacto de conducta son opcionales al publicar. El campo de accesibilidad ya no se presenta ni se exige; se conserva compatibilidad con datos antiguos.

El directorio filtra antes de paginar: futuros hasta el cierre de listas, en curso desde ese cierre hasta 48 horas después de la fecha de fin (inclusive), y pasados después de ese límite. Los cancelados se incluyen en pasados. Reabrir el plazo devuelve el torneo a futuros mientras el nuevo plazo esté abierto y no haya superado el límite final. Los borradores permanecen visibles solo para su organizador. La fecha de fin se configura en el formulario; para torneos antiguos sin fecha de fin se estima con comienzo + rondas × minutos por ronda hasta que se edite.
