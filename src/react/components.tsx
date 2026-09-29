import type { DateFormat, DateValue } from '../core/types';
import { useLocalizedDate, useLocalizedNumber, useTranslation } from './hooks';

export interface TranslationProps {
  /** Dot-separated path to the translation, e.g. `'navbar.home'`. */
  tKey: string;
  /** Optional count, used to pick a plural form and to fill `{count}` placeholders. */
  count?: number;
}

/**
 * Renders the translation at `tKey` in the current locale.
 *
 * @example
 * <Translation tKey="titles.hello" />            // en -> Hello, World!  ar -> مرحباً أيها العالم!
 * <Translation tKey="cart.items" count={3} />    // en -> 3 items
 */
export const Translation = ({ tKey, count }: TranslationProps) => useTranslation(tKey, count) ?? null;

export interface LocalizedNumberProps {
  /** The number, or numeric string, to localize. */
  value: string | number;
  /** Extra `Intl.NumberFormat` options, e.g. `{ numberingSystem: 'arab' }`. */
  options?: Intl.NumberFormatOptions;
}

/**
 * Renders `value` localized as a number in the current locale.
 *
 * @example
 * <LocalizedNumber value={100000} />                                   // en -> 100,000
 * <LocalizedNumber value={100000} options={{ numberingSystem: 'arab' }} /> // ar -> ١٠٠٬٠٠٠
 */
export const LocalizedNumber = ({ value, options }: LocalizedNumberProps) =>
  useLocalizedNumber(value, options);

export interface LocalizedDateProps {
  /** The date to localize: epoch milliseconds, a date string, or a `Date`. */
  value: DateValue;
  /** A Moment.js format string, or a mapping from locale code to format string. */
  format?: DateFormat;
}

/**
 * Renders `value` localized as a date in the current locale.
 *
 * @example
 * <LocalizedDate value={0} format="ddd, MMM YYYY" />                    // en -> Thu, Jan 1970
 * <LocalizedDate value={0} format={{ en: 'MMM YYYY', ar: 'MMMM YYYY' }} />
 */
export const LocalizedDate = ({ value, format }: LocalizedDateProps) =>
  useLocalizedDate(value, format);

/**
 * The React components under the names R16N 1.x exported them with.
 * Prefer the named exports `Translation`, `LocalizedNumber` and `LocalizedDate`,
 * which don't shadow the global `Number` and `Date` when destructured.
 */
export const ReactBindings = {
  Translation,
  Number: LocalizedNumber,
  Date: LocalizedDate,
};
