import type { Reducer, UnknownAction } from 'redux';
import { isSetLocaleAction } from './actions';
import type { Locales, R16nState } from './types';
import { validateLocaleExists, validateLocales } from './utils';

/**
 * Creates the reducer for R16N's state. Mount it under the `r16n` key of your store.
 *
 * @param locales - All locales your app supports, e.g. `{ en: { hello: 'Hello' }, ar: { hello: 'مرحباً' } }`.
 * @param currentLocale - The initial locale of the app. Defaults to `'en'`.
 * @throws If `locales` holds non-string translations, or `currentLocale` is not one of its keys.
 */
export const createR16nReducer = (
  locales: Locales,
  currentLocale = 'en',
): Reducer<R16nState, UnknownAction, R16nState | undefined> => {
  validateLocales(locales);
  validateLocaleExists(currentLocale, locales);

  const initialState: R16nState = {
    locales,
    locale: currentLocale,
    translations: locales[currentLocale],
  };

  return (state = initialState, action) => {
    if (isSetLocaleAction(action)) {
      const { locale } = action.payload;
      validateLocaleExists(locale, state.locales);
      return {
        ...state,
        locale,
        translations: state.locales[locale],
      };
    }
    return state;
  };
};
