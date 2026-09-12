import { writeFile } from 'node:fs/promises';

/*
 * The declaration files emitted by tsc are CJS (the package is "type": "commonjs"), so the
 * "import" condition needs an ESM counterpart to avoid ambiguous interop. The package only has
 * named exports, so re-exporting the generated declarations from a .d.mts entry is enough.
 */
const entry = new URL('../dist/index.d.mts', import.meta.url);

await writeFile(entry, "export * from './index.js';\n");
