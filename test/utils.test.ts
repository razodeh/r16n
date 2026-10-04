import 'moment/locale/ar';
import 'moment/locale/zh-hk';
import moment from 'moment';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { localizeDate, localizeNumber, translate } from '../src';
import { locales } from './fixtures';

describe('localizeNumber', () => {
  let warn: ReturnType<typeof vi.spyOn>;
  beforeEach(() => {
    warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
  });

  it('formats numbers and numeric strings', () => {
    expect(localizeNumber(1234567.5, 'en')).toBe('1,234,567.5');
    expect(localizeNumber('1234567', 'en')).toBe('1,234,567');
    expect(localizeNumber(1234567, 'de')).toBe('1.234.567');
  });

  it('uses Eastern Arabic digits when asked', () => {
    expect(localizeNumber(100000, 'ar', { numberingSystem: 'arab' })).toBe('١٠٠٬٠٠٠');
    expect(localizeNumber(100000, 'ar-EG')).toBe('١٠٠٬٠٠٠');
  });

  it('passes Intl.NumberFormat options through', () => {
    expect(localizeNumber(9.5, 'en', { style: 'currency', currency: 'USD' })).toBe('$9.50');
  });

  it('accepts underscore locale codes such as zh_HK', () => {
    expect(localizeNumber(1234, 'zh_HK')).toBe('1,234');
  });

  it('falls back to the default locale for invalid locale tags', () => {
    expect(() => localizeNumber(1234, 'not a tag!')).not.toThrow();
  });

  it('warns and returns the input for non-numbers', () => {
    expect(localizeNumber('abc', 'en')).toBe('abc');
    expect(localizeNumber('', 'en')).toBe('');
    expect(localizeNumber(NaN, 'en')).toBe('NaN');
    expect(warn).toHaveBeenCalledTimes(3);
  });
});

describe('localizeDate', () => {
  // Tests run with TZ=UTC (see vitest.config.ts), so these dates don't depend on the machine.
  const epoch = Date.UTC(2018, 0, 2, 15, 49);

  it('formats numbers, strings and Date objects', () => {
    expect(localizeDate(epoch, 'en', 'YYYY-MM-DD')).toBe('2018-01-02');
    expect(localizeDate('2018-01-02T15:49:00Z', 'en', 'YYYY-MM-DD')).toBe('2018-01-02');
    expect(localizeDate(new Date(epoch), 'en', 'YYYY-MM-DD')).toBe('2018-01-02');
  });

  it('localizes month names and digits', () => {
    expect(localizeDate(epoch, 'en', 'MMMM YYYY')).toBe('January 2018');
    expect(localizeDate(epoch, 'ar', 'MMMM YYYY')).toBe('يناير ٢٠١٨');
  });

  it('accepts a per-locale format mapping', () => {
    const format = { en: 'MMM YYYY', ar: 'YYYY' };
    expect(localizeDate(epoch, 'en', format)).toBe('Jan 2018');
    expect(localizeDate(epoch, 'ar', format)).toBe('٢٠١٨');
  });

  it('normalizes underscore locale codes such as zh_HK', () => {
    expect(localizeDate(epoch, 'zh_HK', 'MMMM')).toBe('一月');
  });

  it('does not change the global Moment.js locale', () => {
    const before = moment.locale();
    localizeDate(epoch, 'ar', 'MMMM');
    expect(moment.locale()).toBe(before);
  });

  it('warns and returns the input for invalid dates', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    expect(localizeDate('not a date', 'en', 'YYYY')).toBe('not a date');
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('not a valid date'));
  });
});

describe('translate', () => {
  it('translates without a Redux store', () => {
    expect(translate(locales.en, 'en', 'navbar.home')).toBe('Home');
    expect(translate(locales.en, 'en', 'cart.items', 2)).toBe('2 items');
  });
});
