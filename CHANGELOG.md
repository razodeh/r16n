# Changelog

## 2.0.0

A modernization release for current React and Redux. See the
[migration guide](./README.md#5-migrating-from-1x).

### Breaking changes

- `react`, `react-redux` and `redux` are now **peer dependencies**. Supported versions are React 18 and 19, react-redux 9 and Redux 5 (Redux Toolkit 2).
- The React components are built on react-redux hooks instead of `connect()`, and return their value directly instead of wrapping it in an array.
- `getTranslation` returns `undefined` (with a warning) when the key points to a group of translations instead of returning the nested object. Use `getTranslations` for groups.
- `propTypes` are replaced by TypeScript types, and the `prop-types` dependency is removed.
- The `intl` and `intl-locales-supported` dependencies are removed. R16N uses the runtime's built-in `Intl`.
- `dist/` layout changed: the package ships `dist/index.js` (ESM), `dist/index.cjs` (CommonJS) and type declarations through an `exports` map. Deep imports into `dist/` are no longer supported.

### Added

- Hooks: `useTranslation`, `useTranslator`, `useTranslations`, `useLocale`, `useSetLocale`, `useLocalizedNumber` and `useLocalizedDate`.
- Named components `Translation`, `LocalizedNumber` and `LocalizedDate`. `ReactBindings` keeps the 1.x names (`Translation`, `Number`, `Date`).
- Plurals: `count` picks a plural form by `Intl.PluralRules` category or exact count, and fills `{count}` placeholders.
- `options` for `LocalizedNumber` / `localizeNumber`, passed to `Intl.NumberFormat` (e.g. `{ numberingSystem: 'arab' }`).
- `translate`, `localizeNumber` and `localizeDate` are exported for use without React.
- `getR16nState` selector, `isSetLocaleAction` type guard and TypeScript types for the state and locales.

### Fixed

- `<Number>` crashed with `areIntlLocalesSupported is not a function` with current versions of `intl-locales-supported`.
- Empty-string translations were treated as missing keys.
- The `count` prop of `<Translation>` was ignored.
- Rendering a date changed Moment.js's global locale.
- Locale codes with underscores (e.g. `zh_HK`) threw in `Intl.NumberFormat`.
- The `Date` component's `value` prop type checked against the component itself instead of the global `Date`.
- Validating `null` translations threw a `TypeError` instead of the R16N validation error, and passing non-object `locales` threw an empty error.

### Tooling

- TypeScript source, built with tsdown. Babel 6 removed.
- Vitest and React Testing Library tests (Enzyme removed), plus a smoke test of the packed tarball on React 18 and 19.
- ESLint 10 flat config, `publint` and `attw` package checks.
- GitHub Actions CI replaces Travis CI.
- The React example uses Vite, React 19 `createRoot`, Redux Toolkit `configureStore` and the new hooks.
