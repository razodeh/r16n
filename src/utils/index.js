/**
 * @module utils
 * @desc This module is used internally for `R16N`.
 * @author razodeh <https://github.com/razodeh>
 */

import {
    R16N_TRANSLATION_KEY_UNDEFINED,
    R16N_LOCALES_VALIDATION_ERROR,
    R16N_NAN,
    R16N_INVALID_DATE,
    R16N_LOCALE_UNDEFINED,
} from "./errors";

const areIntlLocalesSupported = require('intl-locales-supported');
const moment = require('moment');

/**
 * @desc A function which retreives the exact state object, by passing its path string, and the count.
 * @param {string} pathString - Comma-separated string indicates the object heirarchy to requested translation.
 * @param {object} translations - Redux store `translations` state inside of `r16n` state.
 */
export const extractTranslationWithStringPath = (pathString, translations) => {
    let path = pathString.split('.');
    let prevState = translations;
    let exactState = null;

    // looping over each key in `pathString` and 
    for (let index = 0; index < path.length; index++) {
        exactState = prevState[path[index]];
        // Undefined path key.
        if (!exactState) {
            throw new Error(R16N_TRANSLATION_KEY_UNDEFINED(path[index], pathString));
        }
        prevState = exactState;
    }
    return exactState;
};

/**
 * @desc Recursive function that traverses over all translations in `localeObject` to check for
 * incorrect data.
 * @param {object} localeObject - Locales object.
 * @param {string} key - Current object's parent key.
 * @param {array} keysArray - Array which is going to be filled with incorrect translations key.
 */
const localesTypeCheckTraverse = (localeObject, key, keysArray) => {
    if (!['string', 'object'].includes(typeof localeObject)) {
        keysArray.push(key);
    } else if (typeof localeObject === 'object') {
        Object.keys(localeObject).map(
            (childKey) => localesTypeCheckTraverse(localeObject[childKey], `${key}.${childKey}`, keysArray)
        );
    }
};

/**
 * @desc This method validates whether locales states are all strings.
 * @param {object} locales - R16N's Locales state.
 */
export const validateLocales = (locales) => {
    if(typeof locales !== 'object') {
        throw new Error('');
    }

    let invalidKeys = [];
    // Traveses through the object heirarchy, and extracts invalid translations.
    localesTypeCheckTraverse(locales, 'locales', invalidKeys);
    if (invalidKeys.length) {
        throw new Error(R16N_LOCALES_VALIDATION_ERROR(invalidKeys));
    }
};

/**
 * @desc This method validates `locale` exists in `locales` state.
 * @param {object} locales - R16N's Locales state.
 */
export const validateLocaleExists = (locale, locales) => {
    let localesArray = Object.keys(locales);
    if(!localesArray.includes(locale)) {
        throw new Error(R16N_LOCALE_UNDEFINED(locale, localesArray));
    }
};

/**
 * @desc This method ensures that `Intl` supports the passed `locale`,
 * @param {string} locale - locale code to check with 
 */
const ensureIntlNumberFormat = (locale) => {
    if (global.Intl) {
        if (!areIntlLocalesSupported([locale])) {
            const IntlPolyfill = require('intl');
            Intl.NumberFormat = IntlPolyfill.NumberFormat;
        }
    } else {
        global.Intl = require('intl');
    }
};

/**
 * @desc This method localizes numbers with `ECMAScript Internationalization API`
 * @param {string, number} number - Number to localize.
 * @param {string} locale - The locale needed to localize the `number` with.
 * @see {@link https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Intl ECMAScript Internationalization API}
 */
export const localizeNumber = (number, locale) => {
    // Make sure that `Intl` object supports `locale`.
    ensureIntlNumberFormat(locale);
    // Check if `number` is a correct number format.
    if (isNaN(number)) {
        console.warn(R16N_NAN(number));
        return number;
    }
    number = new Intl.NumberFormat(locale).format(number);
    return number;
};

/**
 * @desc This method localizes dates using `Moment.js`.
 * @param {string, Date, number} date - The date needed to be localized.
 * @param {string} locale - The locale needed to localize `date` with.
 * @param {string, object} format - Format of the date with `Moment.js` formats, it can be a string
 *  or an object mapping locales to specific format. see {@link https://momentjs.com/docs/#/displaying/ Moment.js Display}.
 * @see {@link https://momentjs.com Moment.js}
 */
export const localizeDate = (date, locale, format) => {
    let localizedDate = new Date(date);
    // Check if it is a valid date.
    if (!isNaN(localizedDate.valueOf())) {
        moment.locale(locale);
        let specificFormat = format;
        if(typeof format === 'object') {
            specificFormat = format[locale];
        }
        localizedDate = moment(localizedDate).format(specificFormat);
        return localizedDate;
    }
    console.warn(R16N_INVALID_DATE(date));
    return date;
};
