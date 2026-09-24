import { spawnSync } from 'node:child_process';
import { closeSync, existsSync, mkdirSync, openSync, utimesSync } from 'node:fs';
import { join } from 'node:path';

const pleskBin = '/opt/plesk/node/22/bin';
const pleskNpm = `${pleskBin}/npm`;
const deploymentEnvironment = existsSync(pleskNpm)
  ? { ...process.env, PATH: `${pleskBin}:${process.env.PATH ?? ''}` }
  : process.env;

if (existsSync(pleskNpm)) {
  const install = spawnSync(pleskNpm, ['ci', '--include=dev', '--include=optional'], {
    cwd: process.cwd(),
    env: deploymentEnvironment,
    stdio: 'inherit',
  });
  if (install.error) throw install.error;
  if (install.status !== 0) process.exit(install.status ?? 1);
}

const tasks = [
  ['node_modules/typescript/bin/tsc', ['-b']],
  ['node_modules/vite/bin/vite.js', ['build']],
  ['node_modules/typescript/bin/tsc', ['-p', 'tsconfig.server.json']],
  ['tools/build-server.mjs', []],
  ['node_modules/tsx/dist/cli.mjs', ['server/src/db/migrate.ts']],
];

for (const [entrypoint, arguments_] of tasks) {
  const result = spawnSync(process.execPath, [entrypoint, ...arguments_], {
    cwd: process.cwd(),
    env: deploymentEnvironment,
    stdio: 'inherit',
  });
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status ?? 1);
}

// Plesk can deploy the new static bundle while Passenger keeps an older API
// process alive. Touch the restart marker after the server build succeeds.
if (existsSync(pleskNpm)) {
  const directory = join(process.cwd(), 'tmp');
  const restartMarker = join(directory, 'restart.txt');
  mkdirSync(directory, { recursive: true });
  closeSync(openSync(restartMarker, 'a'));
  const now = new Date();
  utimesSync(restartMarker, now, now);
}
