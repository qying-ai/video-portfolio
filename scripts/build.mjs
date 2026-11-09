import { copyFile, mkdir, rm, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
const root = new URL('../', import.meta.url);
const output = new URL('dist/', root);
await rm(output, { recursive: true, force: true });
await mkdir(new URL('assets/', output), { recursive: true });
// Only publish files needed by the site. Internal docs, scripts and .env stay outside dist.
const files = ['index.html', 'styles.css', 'app.js', 'videos.js', 'assets/logo.png'];
for (const file of files) await copyFile(new URL(file, root), new URL(file, output));
await writeFile(new URL('.nojekyll', output), '');
console.log(`Static site built: ${fileURLToPath(output)} (${files.length + 1} files)`);
