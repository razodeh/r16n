import moment from 'moment';
import {
  R16N_INVALID_DATE,
  R16N_LOCALE_UNDEFINED,
  R16N_LOCALES_NOT_AN_OBJECT,
  R16N_LOCALES_VALIDATION_ERROR,
  R16N_NAN,
  R16N_TRANSLATION_KEY_UNDEFINED,
  R16N_TRANSLATION_NOT_A_STRING,
} from './errors';
import type { DateFormat, DateValue, Locales, TranslationTree, TranslationValue } from './types';

const isTree = (value: unknown): value is TranslationTree =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

/**
 * Converts a locale code to a BCP 47 language tag that `Intl` accepts,
 * e.g. `zh_HK` -> `zh-HK`.
 */
export const toLanguageTag = (locale: string): string => locale.replace(/_/g, '-');

/**
 * Walks `translations` along a dot-separated `pathString` and returns the value found there.
 * @throws If any key along the path is not defined.
 */
export const extractTranslationWithStringPath = (
  pathString: string,
  translations: TranslationTree,
): TranslationValue => {
  let current: TranslationValue = translations;
  for (const key of pathString.split('.')) {
    if (!isTree(current) || !Object.prototype.hasOwnProperty.call(current, key)) {
      throw new Error(R16N_TRANSLATION_KEY_UNDEFINED(key, pathString));
    }
    current = current[key];
  }
  return current;
};

/**
 * Picks the plural form of `forms` that matches `count` in `locale`.
 * An exact count key (e.g. `"0"`) wins over the `Intl.PluralRules` category,
 * which falls back to `other`.
 */
const selectPluralForm = (
  forms: TranslationTree,
  locale: string,
  count: number,
): TranslationValue | undefined => {
  const exact = forms[String(count)];
  if (exact !== undefined) {
    return exact;
  }
  let category: string = 'other';
  try {
    category = new Intl.PluralRules(toLanguageTag(locale)).select(count);
  } catch {
    // Unknown locale tag: keep the `other` category.
  }
  return forms[category] ?? forms.other;
};

/**
 * Resolves the translation at `key` for `locale`, choosing a plural form and
 * replacing `{count}` placeholders when `count` is given.
 * Logs a warning and returns `undefined` when the translation cannot be resolved.
 */
export const translate = (
  translations: TranslationTree,
  locale: string,
  key: string,
  count?: number,
): string | undefined => {
  let value: TranslationValue | undefined;
  try {
    value = extractTranslationWithStringPath(key, translations);
  } catch (error) {
    console.warn((error as Error).message);
    return undefined;
  }
  if (isTree(value) && count !== undefined) {
    value = selectPluralForm(value, locale, count);
  }
  if (typeof value !== 'string') {
    console.warn(R16N_TRANSLATION_NOT_A_STRING(key));
    return undefined;
  }
  return count === undefined ? value : value.replace(/\{count\}/g, String(count));
};

/**
 * Recursively collects the paths of translations that are neither strings nor nested objects.
 */
const collectInvalidKeys = (value: unknown, path: string, invalidKeys: string[]): void => {
  if (typeof value === 'string') {
    return;
  }
  if (!isTree(value)) {
    invalidKeys.push(path);
    return;
  }
  for (const childKey of Object.keys(value)) {
    collectInvalidKeys(value[childKey], `${path}.${childKey}`, invalidKeys);
  }
};

/**
 * Validates that `locales` is an object of locales whose translations are all strings.
 * @throws If `locales` is not an object, or holds non-string translations.
 */
export function validateLocales(locales: unknown): asserts locales is Locales {
  if (!isTree(locales)) {
    throw new Error(R16N_LOCALES_NOT_AN_OBJECT(locales));
  }
  const invalidKeys: string[] = [];
  for (const locale of Object.keys(locales)) {
    const translations = locales[locale];
    if (isTree(translations)) {
      collectInvalidKeys(translations, `locales.${locale}`, invalidKeys);
    } else {
      invalidKeys.push(`locales.${locale}`);
    }
  }
  if (invalidKeys.length) {
    throw new Error(R16N_LOCALES_VALIDATION_ERROR(invalidKeys));
  }
}

/**
 * Validates that `locale` is one of the keys of `locales`.
 * @throws If it is not.
 */
export const validateLocaleExists = (locale: unknown, locales: Locales): void => {
  const localeCodes = Object.keys(locales);
  if (typeof locale !== 'string' || !localeCodes.includes(locale)) {
    throw new Error(R16N_LOCALE_UNDEFINED(locale, localeCodes));
  }
};

const isNotANumber = (value: string | number): boolean =>
  (typeof value === 'string' && value.trim() === '') || Number.isNaN(Number(value));

/**
 * Localizes a number with the ECMAScript Internationalization API (`Intl.NumberFormat`).
 *
 * @param value - The number, or numeric string, to localize.
 * @param locale - The locale to localize `value` with.
 * @param options - Extra `Intl.NumberFormat` options, e.g. `{ numberingSystem: 'arab' }`
 *   for Eastern Arabic digits, or `{ style: 'currency', currency: 'USD' }`.
 * @returns The localized number, or `value` as a string (with a console warning) if it is not a number.
 */
export const localizeNumber = (
  value: string | number,
  locale: string,
  options?: Intl.NumberFormatOptions,
): string => {
  if (isNotANumber(value)) {
    console.warn(R16N_NAN(value));
    return String(value);
  }
  const number = Number(value);
  try {
    return new Intl.NumberFormat(toLanguageTag(locale), options).format(number);
  } catch {
    // Unknown locale tag: fall back to the runtime's default locale.
    return new Intl.NumberFormat(undefined, options).format(number);
  }
};

/**
 * Localizes a date with Moment.js, without touching Moment's global locale.
 *
 * The Moment.js locale data for `locale` must be loaded, e.g. `import 'moment/locale/ar'`.
 *
 * @param value - The date to localize: epoch milliseconds, a date string, or a `Date`.
 * @param locale - The locale to localize `value` with.
 * @param format - A Moment.js format string, or a mapping from locale code to format string.
 *   See https://momentjs.com/docs/#/displaying/.
 * @returns The localized date, or `value` as a string (with a console warning) if it is not a valid date.
 */
export const localizeDate = (value: DateValue, locale: string, format?: DateFormat): string => {
  const date = moment(new Date(value));
  if (!date.isValid()) {
    console.warn(R16N_INVALID_DATE(value));
    return String(value);
  }
  const specificFormat = typeof format === 'object' ? format[locale] : format;
  return date.locale(locale).format(specificFormat);
};
