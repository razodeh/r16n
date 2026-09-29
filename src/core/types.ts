/**
 * A translation is either a string or a nested object of translations.
 * Plural forms are nested objects keyed by `Intl.PluralRules` categories
 * (`zero`, `one`, `two`, `few`, `many`, `other`) or by exact counts (`"0"`, `"1"`, ...).
 */
export type TranslationValue = string | TranslationTree;

export interface TranslationTree {
  [key: string]: TranslationValue;
}

/** All locales your app supports, keyed by locale code. */
export type Locales = Record<string, TranslationTree>;

/** Shape of the `r16n` slice of your Redux state. */
export interface R16nState {
  /** Every locale passed to `createR16nReducer`. */
  locales: Locales;
  /** The current locale code. */
  locale: string;
  /** The translations of the current locale. */
  translations: TranslationTree;
}

/** Any Redux root state that mounts R16N's reducer under the `r16n` key. */
export interface R16nRootState {
  r16n: R16nState;
}

/** A Moment.js format string, or a mapping from locale code to format string. */
export type DateFormat = string | Record<string, string>;

/** Anything `new Date(...)` accepts. */
export type DateValue = string | number | Date;
