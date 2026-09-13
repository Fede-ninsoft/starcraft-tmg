import { build } from 'esbuild';
// Share the pure army/tournament engines and JSON catalogs with the API.
// Preserve the existing production entrypoint server/dist/index.js.
await build({ entryPoints: ['server/src/index.ts'], outfile: 'server/dist/index.js', bundle: true, platform: 'node', format: 'esm', target: 'node22', packages: 'external', sourcemap: true, tsconfig: 'tsconfig.json' });
