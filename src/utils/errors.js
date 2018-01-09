/**
 * @module errors
 * @desc This module contains all error messages creators which are used inside `R16N`.
 * @author razodeh <https://github.com/razodeh>
 */

/* General error messages */
export const R16N_NAN = (number) => `R16N Warning: ${number} is NaN, can't localize.`;
export const R16N_INVALID_DATE = (date) => `R16N Warning: ${date} is not a valid date format, can't localize.`;
export const R16N_TRANSLATION_KEY_UNDEFINED = (translationKey, pathString) => `R16N Warning: Key \`${translationKey}\` is not a defined key in the provided path string \`${pathString}\`.`;
export const R16N_LOCALES_VALIDATION_ERROR = (invalidKeys) => `\nR16N Error: The following keys are not strings:\n\n ${invalidKeys.map((key) => `\t${key}\n`)}`;
export const R16N_LOCALE_UNDEFINED = (locale, localeCodes) => `\nR16N Error: The selected locale \`${locale}\` is not added to \`R16N\`.\nYou only have these locales: [${localeCodes}].\n`;
