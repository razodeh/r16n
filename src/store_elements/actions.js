/**
 * @module actions
 * @author razodeh <https://github.com/razodeh>
 */

 /**
  * @description Action type for setting a new Locale for your app.
  */
export const SET_LOCALE = '@@r16n/SET_LOCALE';

/**
 * @description An action creator for setting a new locale for your app.
 * @param {string} locale - The locale to make your app switch to.
 */
export const setLocale = (locale) => ({
    type: SET_LOCALE,
    payload: {
        locale
    }
});
