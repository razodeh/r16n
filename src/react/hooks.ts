import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setLocale } from '../core/actions';
import { getLocale, getTranslation, getTranslations } from '../core/selectors';
import type { DateFormat, DateValue, R16nRootState, TranslationTree } from '../core/types';
import { localizeDate, localizeNumber, translate } from '../core/utils';

/** Returns the current locale code. */
export const useLocale = (): string => useSelector((state: R16nRootState) => getLocale(state));

/** Returns all translations of the current locale. */
export const useTranslations = (): TranslationTree =>
  useSelector((state: R16nRootState) => getTranslations(state));

/**
 * Returns a single translation of the current locale.
 * @param key - Dot-separated path to the translation, e.g. `'navbar.home'`.
 * @param count - Optional count, used to pick a plural form and to fill `{count}` placeholders.
 */
export const useTranslation = (key: string, count?: number): string | undefined =>
  useSelector((state: R16nRootState) => getTranslation(state, key, count));

/**
 * Returns a `t(key, count?)` function bound to the current locale,
 * for components that need many translations.
 */
export const useTranslator = (): ((key: string, count?: number) => string | undefined) => {
  const translations = useTranslations();
  const locale = useLocale();
  return useCallback(
    (key: string, count?: number) => translate(translations, locale, key, count),
    [translations, locale],
  );
};

/** Returns a function that switches the app to another locale. */
export const useSetLocale = (): ((locale: string) => void) => {
  const dispatch = useDispatch();
  return useCallback((locale: string) => {
    dispatch(setLocale(locale));
  }, [dispatch]);
};

/**
 * Returns `value` localized as a number in the current locale.
 * @param options - Extra `Intl.NumberFormat` options.
 */
export const useLocalizedNumber = (
  value: string | number,
  options?: Intl.NumberFormatOptions,
): string => localizeNumber(value, useLocale(), options);

/**
 * Returns `value` localized as a date in the current locale.
 * @param format - A Moment.js format string, or a mapping from locale code to format string.
 */
export const useLocalizedDate = (value: DateValue, format?: DateFormat): string =>
  localizeDate(value, useLocale(), format);
