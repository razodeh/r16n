import { describe, expect, it } from 'vitest';
import { SET_LOCALE, createR16nReducer, isSetLocaleAction, setLocale } from '../src';
import { locales } from './fixtures';

const init = { type: '@@INIT' };

describe('setLocale', () => {
  it('creates a SET_LOCALE action', () => {
    expect(setLocale('ar')).toEqual({ type: SET_LOCALE, payload: { locale: 'ar' } });
    expect(SET_LOCALE).toBe('@@r16n/SET_LOCALE');
  });

  it('is recognised by isSetLocaleAction', () => {
    expect(isSetLocaleAction(setLocale('ar'))).toBe(true);
    expect(isSetLocaleAction(init)).toBe(false);
    expect(isSetLocaleAction(null)).toBe(false);
  });
});

describe('createR16nReducer', () => {
  it('builds the initial state from the given locale', () => {
    const reducer = createR16nReducer(locales, 'ar');
    expect(reducer(undefined, init)).toEqual({
      locales,
      locale: 'ar',
      translations: locales.ar,
    });
  });

  it("defaults to 'en'", () => {
    expect(createR16nReducer(locales)(undefined, init).locale).toBe('en');
  });

  it('switches locale and translations on setLocale', () => {
    const reducer = createR16nReducer(locales, 'en');
    const before = reducer(undefined, init);
    const after = reducer(before, setLocale('ar'));
    expect(after).toEqual({ locales, locale: 'ar', translations: locales.ar });
    // Does not mutate the previous state.
    expect(before.locale).toBe('en');
  });

  it('returns the same state for unrelated actions', () => {
    const reducer = createR16nReducer(locales, 'en');
    const state = reducer(undefined, init);
    expect(reducer(state, { type: 'other' })).toBe(state);
  });

  it('throws when the initial locale is unknown', () => {
    expect(() => createR16nReducer(locales, 'fr')).toThrow(/`fr` is not added to `R16N`/);
  });

  it('throws when switching to an unknown locale', () => {
    const reducer = createR16nReducer(locales, 'en');
    expect(() => reducer(undefined, setLocale('fr'))).toThrow(/You only have these locales: \[en, ar\]/);
  });

  it('rejects non-object locales', () => {
    // @ts-expect-error testing invalid input from JavaScript callers
    expect(() => createR16nReducer(null)).toThrow(/received `null`/);
    // @ts-expect-error testing invalid input from JavaScript callers
    expect(() => createR16nReducer('en')).toThrow(/received `string`/);
  });

  it('rejects translations that are not strings, listing every bad key', () => {
    const bad = { en: { ok: 'ok', n: 1, nested: { flag: true, nil: null } }, ar: 'oops' };
    // @ts-expect-error testing invalid input from JavaScript callers
    expect(() => createR16nReducer(bad)).toThrow(
      /locales\.en\.n\n\tlocales\.en\.nested\.flag\n\tlocales\.en\.nested\.nil\n\tlocales\.ar\n/,
    );
  });
});
