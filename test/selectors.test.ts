import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  createR16nReducer,
  getLocale,
  getR16nState,
  getTranslation,
  getTranslations,
  setLocale,
  type R16nRootState,
} from '../src';
import { locales } from './fixtures';

const stateFor = (locale: string): R16nRootState => {
  const reducer = createR16nReducer(locales, 'en');
  return { r16n: reducer(undefined, setLocale(locale)) };
};

describe('selectors', () => {
  let warn: ReturnType<typeof vi.spyOn>;
  beforeEach(() => {
    warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
  });

  it('select the r16n state, locale and translations', () => {
    const state = stateFor('ar');
    expect(getR16nState(state)).toBe(state.r16n);
    expect(getLocale(state)).toBe('ar');
    expect(getTranslations(state)).toBe(locales.ar);
  });

  it('select top-level and nested translations', () => {
    expect(getTranslation(stateFor('en'), 'helloWorld')).toBe('Hello, World!');
    expect(getTranslation(stateFor('ar'), 'navbar.home')).toBe('الرئيسية');
  });

  it('return empty-string translations instead of treating them as missing', () => {
    expect(getTranslation(stateFor('en'), 'empty')).toBe('');
    expect(warn).not.toHaveBeenCalled();
  });

  it('warn and return undefined for missing keys', () => {
    expect(getTranslation(stateFor('en'), 'navbar.missing')).toBeUndefined();
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('Key `missing` is not a defined key'));
  });

  it('warn and return undefined when walking past a string', () => {
    expect(getTranslation(stateFor('en'), 'helloWorld.deeper')).toBeUndefined();
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('Key `deeper`'));
  });

  it('warn and return undefined for a group of translations without a count', () => {
    expect(getTranslation(stateFor('en'), 'navbar')).toBeUndefined();
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('points to a group of translations'));
  });

  it('do not resolve keys from the object prototype', () => {
    expect(getTranslation(stateFor('en'), 'toString')).toBeUndefined();
  });

  describe('plurals', () => {
    it('pick the English plural form and fill {count}', () => {
      const state = stateFor('en');
      expect(getTranslation(state, 'cart.items', 0)).toBe('Your cart is empty');
      expect(getTranslation(state, 'cart.items', 1)).toBe('1 item');
      expect(getTranslation(state, 'cart.items', 5)).toBe('5 items');
    });

    it('pick the Arabic plural categories', () => {
      const state = stateFor('ar');
      expect(getTranslation(state, 'cart.items', 0)).toBe('لا يوجد عناصر');
      expect(getTranslation(state, 'cart.items', 1)).toBe('عنصر واحد');
      expect(getTranslation(state, 'cart.items', 2)).toBe('عنصران');
      expect(getTranslation(state, 'cart.items', 3)).toBe('3 عناصر');
      expect(getTranslation(state, 'cart.items', 11)).toBe('11 عنصراً');
      expect(getTranslation(state, 'cart.items', 100)).toBe('100 عنصر');
    });

    it('fill {count} in plain string translations', () => {
      expect(getTranslation(stateFor('en'), 'greeting', 4)).toBe('You have 4 new messages');
    });

    it('fall back to `other` for unknown locale tags', () => {
      const reducer = createR16nReducer({ 'not a tag!': { n: { other: '{count} x' } } }, 'not a tag!');
      expect(getTranslation({ r16n: reducer(undefined, { type: 'init' }) }, 'n', 1)).toBe('1 x');
    });
  });
});
