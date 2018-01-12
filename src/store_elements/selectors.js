/**
 * @module selectors
 * @author razodeh <https://github.com/razodeh>
 */

import { extractTranslationWithStringPath } from "../utils/index";

// Selects `r16n` state.
const getR16nStore = (state) => state.r16n;
// Selects `r16n.locale` state.
export const getLocale = (state) => getR16nStore(state).locale;
// Selects `r16n.translations` state.
export const getTranslations = (state) => getR16nStore(state).translations;
// Selects `r16n.translation.<your-translation-key>` state.
export const getTranslation = (state, stringPath, count=undefined) => {
    let translation = undefined;
    try {
        translation = extractTranslationWithStringPath(stringPath, getTranslations(state), count);
    } catch (r16nException) {
        console.warn(r16nException.message);
    }
    return translation;
}
