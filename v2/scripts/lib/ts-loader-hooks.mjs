/**
 * Node module hooks so a plain `node` script can import the app's TypeScript.
 * Resolves the `@/` alias to v2/src, adds .ts/.tsx extensions, and transpiles
 * with the SWC that ships inside Next, so nothing new is installed.
 *
 * Use: node --import ./scripts/lib/register-ts.mjs scripts/whatever.mjs
 */

import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, resolve as resolvePath } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const V2 = resolvePath(here, '..', '..');
const SRC = resolvePath(V2, 'src');
const require = createRequire(pathToFileURL(resolvePath(V2, 'package.json')));
const swc = require('next/dist/build/swc');

const EXTS = ['.ts', '.tsx', '/index.ts', '/index.tsx'];

function withExtension(path) {
  if (/\.(m?[jt]sx?|json)$/.test(path) && existsSync(path)) return path;
  for (const e of EXTS) if (existsSync(path + e)) return path + e;
  return null;
}

export async function resolve(specifier, context, next) {
  if (specifier.startsWith('@/')) {
    const p = withExtension(resolvePath(SRC, specifier.slice(2)));
    if (p) return { url: pathToFileURL(p).href, shortCircuit: true };
  }
  if ((specifier.startsWith('./') || specifier.startsWith('../')) && context.parentURL?.startsWith('file:')) {
    const base = dirname(fileURLToPath(context.parentURL));
    const p = withExtension(resolvePath(base, specifier));
    if (p && /\.tsx?$/.test(p)) return { url: pathToFileURL(p).href, shortCircuit: true };
  }
  return next(specifier, context);
}

export async function load(url, context, next) {
  if (url.startsWith('file:') && /\.tsx?$/.test(url)) {
    const filename = fileURLToPath(url);
    const source = await readFile(filename, 'utf8');
    const out = swc.transformSync(source, {
      filename,
      jsc: {
        parser: { syntax: 'typescript', tsx: filename.endsWith('.tsx') },
        transform: { react: { runtime: 'automatic' } },
        target: 'es2022',
      },
      module: { type: 'es6' },
    });
    return { format: 'module', source: out.code, shortCircuit: true };
  }
  return next(url, context);
}
