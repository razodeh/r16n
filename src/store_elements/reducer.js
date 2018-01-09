/**
 * @module reducer
 * @author razodeh <https://github.com/razodeh>
 */

import { SET_LOCALE } from './actions';
import { validateLocales, validateLocaleExists } from '../utils/index';
/**
 * @description This method generates a reducer for R16N's actions.
 * @param {object} locales - All locales your app supports, it is structured as follows
 *  {
 *      <lang_code>: {
 *          translationKey: 'value',
 *      },
 *      <locale_code>: {
 *          translationKey: 'translated value',
 *      }
 *  }
 * @param {string} currentLocale - the initial locale of the app.
 */
export const createR16nReducer = (locales, currentLocale = 'en') => {
    // Validate locales translations.
    validateLocales(locales);
    // Validate if `currentLocale` exists in your passed `locales`.
    validateLocaleExists(currentLocale, locales);
    // Initialize R16N's state.
    let initialState = {
        locales,    // Your locales object.
        locale: currentLocale,  // Current locale in your app.
        translations: locales[currentLocale], // Current Translations of the app.
    };
    // Return R16N's Reducer.
    return (state = initialState, { type, payload = {} }) => {
        switch (type) {
            case SET_LOCALE:
                validateLocaleExists(payload.locale, state.locales);
                return {
                    ...state,
                    locale: payload.locale,
                    translations: state.locales[payload.locale],
                };
            default:
                return state;
        }
    };
};
