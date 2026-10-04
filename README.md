<img src="https://raw.githubusercontent.com/razodeh/r16n/master/logo/logo-title.png" height="50px" alt="R16N Logo" />

# Reduxtionalization (Redux I18N) [![CI](https://github.com/razodeh/r16n/actions/workflows/ci.yml/badge.svg)](https://github.com/razodeh/r16n/actions/workflows/ci.yml) [![npm](https://img.shields.io/npm/v/r16n.svg)](https://www.npmjs.com/package/r16n)

[About](#1-about) | [Installation](#2-installation) | [Usage](#3-usage) | [React](#4-react) | [Migrating from 1.x](#5-migrating-from-1x) | [Development](#6-development) | [License](#7-license)

## 1. About

R16N is a small Redux reducer, action and set of selectors for your translations, plus React
hooks and components that render translations, localized numbers and localized dates.

- Works with **React 18 and 19**, **react-redux 9** and **Redux 5 / Redux Toolkit 2**.
- Ships ES modules, CommonJS and TypeScript types.
- Plural forms based on `Intl.PluralRules`.
- Numbers are formatted with `Intl.NumberFormat`, dates with [Moment.js](https://momentjs.com/).

## 2. Installation

```sh
npm install r16n react-redux
# or
yarn add r16n react-redux
```

`react`, `react-redux` and `redux` are peer dependencies: R16N uses the copies your app already has.

## 3. Usage

### 3.1. Create the reducer

Create R16N's reducer with your locales and the initial locale, and mount it under the **`r16n`** key.

```js
import { configureStore } from '@reduxjs/toolkit';
import { createR16nReducer } from 'r16n';

const locales = {
  en: {
    helloWorld: 'Hello, World!',
    navbar: {
      home: 'Home',
    },
  },
  ar: {
    helloWorld: 'مرحباً أيها العالم',
    navbar: {
      home: 'الرئيسية',
    },
  },
  zh_HK: {
    helloWorld: '你好世界',
    navbar: {
      home: '主页',
    },
  },
};

// Your default locale, whether it is fixed, or read from a cookie or an API.
const currentLocale = 'en';

export const store = configureStore({
  reducer: {
    // ...your other reducers
    r16n: createR16nReducer(locales, currentLocale),
  },
});
```

> R16N's reducer has to be mounted under `r16n`, otherwise the selectors and hooks won't find it.
> Plain Redux (`combineReducers` + `legacy_createStore`) works too.

`createR16nReducer` throws if a translation is not a string, or if `currentLocale` is not one of the keys of `locales`.

### 3.2. Plurals

Give a translation a nested object of plural forms, keyed by the
[`Intl.PluralRules` categories](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Intl/PluralRules/select)
of the language (`zero`, `one`, `two`, `few`, `many`, `other`) or by exact counts (`"0"`, `"1"`, ...).
Pass a `count` to pick one. `{count}` is replaced by the count.

```js
const locales = {
  en: {
    cart: {
      '0': 'Your cart is empty',
      one: '{count} item',
      other: '{count} items',
    },
  },
  ar: {
    cart: {
      zero: 'سلتك فارغة',
      one: 'عنصر واحد',
      two: 'عنصران',
      few: '{count} عناصر',
      many: '{count} عنصراً',
      other: '{count} عنصر',
    },
  },
};

getTranslation(state, 'cart', 3); // en -> 3 items, ar -> 3 عناصر
```

### 3.3. Selectors

| Selector | Returns |
| --- | --- |
| `getTranslation(state, key, count?)` | The translation at the dot-separated `key`, e.g. `'navbar.home'`. Logs a warning and returns `undefined` if it is missing. |
| `getTranslations(state)` | Every translation of the current locale. |
| `getLocale(state)` | The current locale code. |
| `getR16nState(state)` | The whole `r16n` state: `{ locales, locale, translations }`. |

### 3.4. Change the locale

```js
import { setLocale } from 'r16n';

store.dispatch(setLocale('ar'));
```

Dispatching `setLocale` with a locale that is not in `locales` throws.

## 4. React

Wrap your app in react-redux's `<Provider store={store}>`. Every hook and component below re-renders when the locale changes.

### 4.1. Hooks

```jsx
import { useLocale, useSetLocale, useTranslation, useTranslator } from 'r16n';

const Navbar = () => {
  const locale = useLocale(); // 'en'
  const setLocale = useSetLocale();
  const home = useTranslation('navbar.home'); // 'Home'
  const t = useTranslator(); // for many translations

  return (
    <nav dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <a href="/">{home}</a>
      <span>{t('cart', 3)}</span>
      <button onClick={() => setLocale('ar')}>ع</button>
      <button onClick={() => setLocale('en')}>En</button>
    </nav>
  );
};
```

| Hook | Returns |
| --- | --- |
| `useTranslation(key, count?)` | A single translation. |
| `useTranslator()` | A `t(key, count?)` function for the current locale. |
| `useTranslations()` | Every translation of the current locale. |
| `useLocale()` | The current locale code. |
| `useSetLocale()` | A `setLocale(locale)` function. |
| `useLocalizedNumber(value, options?)` | `value` formatted as a number. |
| `useLocalizedDate(value, format?)` | `value` formatted as a date. |

### 4.2. Components

#### `<Translation tKey count? />`

```jsx
import { Translation } from 'r16n';

<Translation tKey="navbar.home" />      // en -> Home, ar -> الرئيسية
<Translation tKey="cart" count={2} />   // en -> 2 items, ar -> عنصران
```

#### `<LocalizedNumber value options? />`

Formats a number or numeric string with [`Intl.NumberFormat`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat).
`options` are passed to `Intl.NumberFormat`.

```jsx
import { LocalizedNumber } from 'r16n';

<LocalizedNumber value={23232} />                                          // en -> 23,232
<LocalizedNumber value={23232} options={{ numberingSystem: 'arab' }} />    // ar -> ٢٣٬٢٣٢
<LocalizedNumber value={9.5} options={{ style: 'currency', currency: 'USD' }} /> // en -> $9.50
```

> **Arabic digits:** current browsers and Node format plain `ar` with Western digits (`23,232`).
> Pass `options={{ numberingSystem: 'arab' }}`, or use a regional locale code such as `ar-EG`, to get `٢٣٬٢٣٢`.

#### `<LocalizedDate value format? />`

Formats a date (epoch milliseconds, a date string, or a `Date`) with Moment.js.
`format` is a [Moment.js format string](https://momentjs.com/docs/#/displaying/), or an object mapping locale codes to format strings.

```jsx
import { LocalizedDate } from 'r16n';

<LocalizedDate value={1514908177545} format="YYYY-MM-DD ddd hh:mmA" />
// en -> 2018-01-02 Tue 03:49PM, ar -> ٢٠١٨-٠١-٠٢ ثلاثاء ٠٣:٤٩م

<LocalizedDate value="2018-01-09T19:09:33+02:00" format={{ en: 'MMMM D, YYYY', ar: 'D MMMM YYYY' }} />
// en -> January 9, 2018, ar -> ٩ يناير ٢٠١٨
```

> **Load Moment's locale data** for every non-English locale, once, next to your store:
>
> ```js
> import 'moment/dist/locale/ar'; // Vite, Rollup
> import 'moment/locale/ar';      // webpack, Node
> ```
>
> Vite and Rollup bundle Moment's ES build, so the locale has to come from `moment/dist/locale/*` to be registered on the same copy of Moment.
> In TypeScript 6+, add `declare module 'moment/locale/*';` (or `moment/dist/locale/*`) to a `.d.ts` file, because Moment ships no types for these files.

### 4.3. Without React

`translate(translations, locale, key, count?)`, `localizeNumber(value, locale, options?)` and
`localizeDate(value, locale, format?)` do the same work without React or Redux.

### 4.4. [React example](./examples/react-example)

```sh
npm install && npm run build
cd examples/react-example
npm install && npm run dev
```

## 5. Migrating from 1.x

| 1.x | 2.0 |
| --- | --- |
| `react`, `react-redux`, `redux` were dependencies | They are **peer dependencies**. Install `react-redux` in your app if you haven't already. |
| React 16, react-redux 5, Redux 3 | React **18 or 19**, react-redux **9**, Redux **5** (or Redux Toolkit 2). |
| `const { Translation, Number, Date } = ReactBindings` | Still works. Prefer the named exports `Translation`, `LocalizedNumber` and `LocalizedDate`, which don't shadow the global `Number` and `Date`. |
| `connect(mapStateToProps)` with `getTranslation` | Still works. You can use `useTranslation`, `useLocale` and `useSetLocale` instead. |
| `getTranslation(state, 'group')` returned the nested object | Returns `undefined` with a warning. Use `getTranslations(state).group`. |
| An empty-string translation was treated as missing | `''` is returned as-is. |
| The `count` prop of `<Translation>` did nothing | `count` picks a plural form and fills `{count}`. |
| `<Number>` in Arabic rendered Eastern Arabic digits | Pass `options={{ numberingSystem: 'arab' }}` or use `ar-EG` (see [4.2](#42-components)). |
| Rendering `<Date>` changed Moment's global locale | Only the rendered date uses the locale. |
| Relied on the `intl` polyfill | Uses the built-in `Intl`, which every supported browser and Node version has. |
| `propTypes` | TypeScript types. React 19 ignores `propTypes` on function components. |

## 6. Development

```sh
npm install
npm run check        # lint, typecheck, unit tests, build, package lint and smoke test
npm run test:watch   # unit tests in watch mode
```

| Script | What it does |
| --- | --- |
| `npm run lint` | ESLint. |
| `npm run typecheck` | TypeScript, no emit. |
| `npm test` / `npm run test:coverage` | Vitest + React Testing Library. |
| `npm run build` | Builds `dist/` (ESM, CJS and types) with tsdown. |
| `npm run lint:package` | `publint` and `attw` check the `exports` map and types. |
| `npm run test:smoke` | Packs the library, installs the tarball in a fresh project and renders with the ESM and CJS builds. Set `SMOKE_REACT_VERSION=18` to try React 18. |

## 7. License

The MIT License (MIT) Copyright (c) 2018 Radwan Abu Odeh radwanizzat[at]gmail.com
