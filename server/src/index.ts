import { createApp } from './app.js';
import { readEnvironment } from './config/env.js';
import { createPool } from './db/pool.js';
import { TournamentRepository } from './modules/tournaments/tournament.repository.js';

const env = readEnvironment();
const pool = createPool(env.DATABASE_URL);
const app = createApp(pool, env);
const tournaments = new TournamentRepository(pool);
const closeExpiredTournaments = () => {
  void tournaments.completeExpired().catch((error: unknown) => console.error('No se pudieron finalizar los torneos vencidos:', error));
};
closeExpiredTournaments();
const tournamentCloseTimer = setInterval(closeExpiredTournaments, 60_000);
tournamentCloseTimer.unref();

const server = app.listen(env.PORT, () => {
  console.info(`API disponible en http://localhost:${env.PORT}/api`);
});

async function shutdown(): Promise<void> {
  clearInterval(tournamentCloseTimer);
  server.close(async () => {
    await pool.end();
    process.exit(0);
  });
}

process.once('SIGINT', shutdown);
process.once('SIGTERM', shutdown);
