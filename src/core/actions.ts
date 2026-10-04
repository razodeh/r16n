/**
 * Action type for setting a new locale for your app.
 */
export const SET_LOCALE = '@@r16n/SET_LOCALE' as const;

export type SetLocaleAction = {
  type: typeof SET_LOCALE;
  payload: {
    locale: string;
  };
};

/**
 * Action creator for setting a new locale for your app.
 * @param locale - The locale to make your app switch to.
 */
export const setLocale = (locale: string): SetLocaleAction => ({
  type: SET_LOCALE,
  payload: {
    locale,
  },
});

/** Type guard for R16N's `setLocale` action. */
export const isSetLocaleAction = (action: unknown): action is SetLocaleAction =>
  typeof action === 'object' &&
  action !== null &&
  (action as { type?: unknown }).type === SET_LOCALE;
