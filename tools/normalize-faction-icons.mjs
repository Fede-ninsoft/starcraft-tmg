import sharp from 'sharp';
import path from 'node:path';

// Normalize transparent ImageGen exports without stretching the emblems.
const inputs = process.argv.slice(2);
if (inputs.length !== 3) throw new Error('Provide Zerg, Terran and Protoss transparent PNG paths.');
for (const [index, race] of ['zerg', 'terran', 'protoss'].entries()) {
  const metadata = await sharp(inputs[index]).metadata();
  if (!metadata.hasAlpha) throw new Error(`${race}: transparent source required`);
  const output = path.resolve('public/factions', `${race}-transparent.png`);
  await sharp(inputs[index]).trim().resize(232, 232, { fit: 'contain', background: '#00000000' })
    .extend({ top: 12, bottom: 12, left: 12, right: 12, background: '#00000000' })
    .png().toFile(output);
  console.log(output);
}
