// Packs r16n exactly as it would be published, installs the tarball into a
// throwaway project next to the peer dependencies, and renders with both the
// ESM and the CommonJS builds. Usage: npm run build && npm run test:smoke
import { execFileSync } from 'node:child_process';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const dir = mkdtempSync(join(tmpdir(), 'r16n-smoke-'));
const run = (cmd, args, cwd = dir) =>
  execFileSync(cmd, args, { cwd, stdio: ['ignore', 'pipe', 'inherit'], encoding: 'utf8' });

const scenario = (load) => `
${load}
const locales = { en: { hi: 'Hello', n: { one: '{count} item', other: '{count} items' } }, ar: { hi: 'مرحباً', n: { other: '{count} عنصر' } } };
const store = configureStore({ reducer: { r16n: createR16nReducer(locales, 'en') } });
const App = () => createElement('p', null,
  createElement(Translation, { tKey: 'hi' }), ' ',
  createElement(Translation, { tKey: 'n', count: 2 }), ' ',
  createElement(LocalizedNumber, { value: 1234, options: { numberingSystem: 'arab' } }), ' ',
  createElement(ReactBindings.Date, { value: Date.UTC(2018, 0, 2), format: 'MMMM' }));
// Drop the <!-- --> markers React puts between adjacent text nodes.
const html = () => renderToString(createElement(Provider, { store }, createElement(App))).replaceAll('<!-- -->', '');
const results = [html()];
store.dispatch(setLocale('ar'));
results.push(html());
const expected = ['<p>Hello 2 items ١٬٢٣٤ January</p>', '<p>مرحباً 2 عنصر ١٬٢٣٤ يناير</p>'];
if (JSON.stringify(results) !== JSON.stringify(expected)) {
  console.error('Unexpected output:', results, 'expected:', expected);
  process.exit(1);
}
console.log('ok', results.join(' | '));
`;

try {
  const tarball = run('npm', ['pack', '--silent', '--pack-destination', dir], root).trim().split('\n').pop();
  writeFileSync(join(dir, 'package.json'), JSON.stringify({ name: 'r16n-smoke', private: true }));
  run('npm', [
    'install', '--no-audit', '--no-fund', '--silent',
    join(dir, tarball),
    `react@${process.env.SMOKE_REACT_VERSION ?? 'latest'}`,
    `react-dom@${process.env.SMOKE_REACT_VERSION ?? 'latest'}`,
    'react-redux@latest', 'redux@latest', '@reduxjs/toolkit@latest',
  ]);

  writeFileSync(join(dir, 'esm.mjs'), scenario(`
import 'moment/locale/ar.js';
import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { createR16nReducer, setLocale, Translation, LocalizedNumber, ReactBindings } from 'r16n';
`));
  writeFileSync(join(dir, 'cjs.cjs'), scenario(`
require('moment/locale/ar');
const { createElement } = require('react');
const { renderToString } = require('react-dom/server');
const { Provider } = require('react-redux');
const { configureStore } = require('@reduxjs/toolkit');
const { createR16nReducer, setLocale, Translation, LocalizedNumber, ReactBindings } = require('r16n');
`));

  const react = JSON.parse(run('node', ['-p', "JSON.stringify(require('react/package.json').version)"]));
  console.log(`React ${react}`);
  process.stdout.write(`ESM: ${run('node', ['esm.mjs'])}`);
  process.stdout.write(`CJS: ${run('node', ['cjs.cjs'])}`);
} finally {
  rmSync(dir, { recursive: true, force: true });
}
