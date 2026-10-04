import type { R16nRootState, R16nState, TranslationTree } from './types';
import { translate } from './utils';

/** Selects the `r16n` state. */
export const getR16nState = (state: R16nRootState): R16nState => state.r16n;

/** Selects the current locale code. */
export const getLocale = (state: R16nRootState): string => getR16nState(state).locale;

/** Selects all translations of the current locale. */
export const getTranslations = (state: R16nRootState): TranslationTree =>
  getR16nState(state).translations;

/**
 * Selects a single translation of the current locale.
 *
 * @param state - Redux root state.
 * @param key - Dot-separated path to the translation, e.g. `'navbar.home'`.
 * @param count - Optional count, used to pick a plural form and to fill `{count}` placeholders.
 * @returns The translated string, or `undefined` (with a console warning) if it is missing.
 */
export const getTranslation = (
  state: R16nRootState,
  key: string,
  count?: number,
): string | undefined => translate(getTranslations(state), getLocale(state), key, count);
