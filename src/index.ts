// Redux
export { createR16nReducer } from './core/reducer';
export { SET_LOCALE, setLocale, isSetLocaleAction } from './core/actions';
export type { SetLocaleAction } from './core/actions';
export { getR16nState, getLocale, getTranslations, getTranslation } from './core/selectors';

// Framework-agnostic helpers
export { translate, localizeNumber, localizeDate } from './core/utils';

// React
export {
  useLocale,
  useTranslations,
  useTranslation,
  useTranslator,
  useSetLocale,
  useLocalizedNumber,
  useLocalizedDate,
} from './react/hooks';
export { Translation, LocalizedNumber, LocalizedDate, ReactBindings } from './react/components';
export type { TranslationProps, LocalizedNumberProps, LocalizedDateProps } from './react/components';

export type {
  TranslationValue,
  TranslationTree,
  Locales,
  R16nState,
  R16nRootState,
  DateFormat,
  DateValue,
} from './core/types';
