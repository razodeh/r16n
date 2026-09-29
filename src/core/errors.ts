/**
 * Error and warning message creators used inside R16N.
 */

export const R16N_NAN = (value: unknown) =>
  `R16N Warning: ${String(value)} is NaN, can't localize.`;

export const R16N_INVALID_DATE = (date: unknown) =>
  `R16N Warning: ${String(date)} is not a valid date format, can't localize.`;

export const R16N_TRANSLATION_KEY_UNDEFINED = (translationKey: string, pathString: string) =>
  `R16N Warning: Key \`${translationKey}\` is not a defined key in the provided path string \`${pathString}\`.`;

export const R16N_TRANSLATION_NOT_A_STRING = (pathString: string) =>
  `R16N Warning: \`${pathString}\` points to a group of translations, not a single translation. Pass a \`count\` if it holds plural forms, or use \`getTranslations\` to read the whole group.`;

export const R16N_LOCALES_NOT_AN_OBJECT = (locales: unknown) =>
  `\nR16N Error: \`locales\` must be an object mapping locale codes to translations, received \`${
    locales === null ? 'null' : typeof locales
  }\`.\n`;

export const R16N_LOCALES_VALIDATION_ERROR = (invalidKeys: string[]) =>
  `\nR16N Error: The following keys are not strings:\n\n${invalidKeys.map((key) => `\t${key}\n`).join('')}`;

export const R16N_LOCALE_UNDEFINED = (locale: unknown, localeCodes: string[]) =>
  `\nR16N Error: The selected locale \`${String(locale)}\` is not added to \`R16N\`.\nYou only have these locales: [${localeCodes.join(', ')}].\n`;
