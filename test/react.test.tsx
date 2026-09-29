import 'moment/locale/ar';
import { configureStore } from '@reduxjs/toolkit';
import { act, render, renderHook, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { Provider } from 'react-redux';
import { combineReducers, legacy_createStore as createStore } from 'redux';
import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  LocalizedDate,
  LocalizedNumber,
  ReactBindings,
  Translation,
  createR16nReducer,
  setLocale,
  useLocale,
  useLocalizedDate,
  useLocalizedNumber,
  useSetLocale,
  useTranslation,
  useTranslations,
  useTranslator,
} from '../src';
import { locales } from './fixtures';

const makeStore = (locale = 'en') =>
  configureStore({ reducer: { r16n: createR16nReducer(locales, locale) } });

type Store = ReturnType<typeof makeStore>;

const wrapperFor =
  (store: Store) =>
  ({ children }: { children: ReactNode }) => <Provider store={store}>{children}</Provider>;

const epoch = Date.UTC(2018, 0, 2, 15, 49);

afterEach(() => {
  vi.restoreAllMocks();
});

describe('hooks', () => {
  it('useLocale and useTranslations follow the store', () => {
    const store = makeStore();
    const { result } = renderHook(() => ({ locale: useLocale(), translations: useTranslations() }), {
      wrapper: wrapperFor(store),
    });
    expect(result.current).toEqual({ locale: 'en', translations: locales.en });
    act(() => {
      store.dispatch(setLocale('ar'));
    });
    expect(result.current).toEqual({ locale: 'ar', translations: locales.ar });
  });

  it('useTranslation returns the translation, with plurals', () => {
    const store = makeStore();
    const { result, rerender } = renderHook(({ count }) => useTranslation('cart.items', count), {
      wrapper: wrapperFor(store),
      initialProps: { count: 1 },
    });
    expect(result.current).toBe('1 item');
    rerender({ count: 3 });
    expect(result.current).toBe('3 items');
    act(() => {
      store.dispatch(setLocale('ar'));
    });
    expect(result.current).toBe('3 عناصر');
  });

  it('useTranslator returns a t function bound to the current locale', () => {
    const store = makeStore();
    const { result } = renderHook(() => useTranslator(), { wrapper: wrapperFor(store) });
    const tEnglish = result.current;
    expect(tEnglish('navbar.home')).toBe('Home');
    expect(tEnglish('cart.items', 0)).toBe('Your cart is empty');
    act(() => {
      store.dispatch(setLocale('ar'));
    });
    expect(result.current).not.toBe(tEnglish);
    expect(result.current('navbar.home')).toBe('الرئيسية');
  });

  it('useTranslator keeps the same function while the locale is unchanged', () => {
    const store = makeStore();
    const { result, rerender } = renderHook(() => useTranslator(), { wrapper: wrapperFor(store) });
    const first = result.current;
    rerender();
    expect(result.current).toBe(first);
  });

  it('useSetLocale dispatches setLocale', () => {
    const store = makeStore();
    const { result } = renderHook(() => useSetLocale(), { wrapper: wrapperFor(store) });
    act(() => {
      result.current('ar');
    });
    expect(store.getState().r16n.locale).toBe('ar');
  });

  it('useLocalizedNumber and useLocalizedDate use the current locale', () => {
    const store = makeStore('ar');
    const { result } = renderHook(
      () => ({
        number: useLocalizedNumber(1234, { numberingSystem: 'arab' }),
        date: useLocalizedDate(epoch, 'MMMM'),
      }),
      { wrapper: wrapperFor(store) },
    );
    expect(result.current).toEqual({ number: '١٬٢٣٤', date: 'يناير' });
  });
});

describe('components', () => {
  const App = () => (
    <>
      <p data-testid="hello">
        <Translation tKey="helloWorld" />
      </p>
      <p data-testid="items">
        <Translation tKey="cart.items" count={2} />
      </p>
      <p data-testid="number">
        <LocalizedNumber value={100000} />
      </p>
      <p data-testid="arab-number">
        <LocalizedNumber value="100000" options={{ numberingSystem: 'arab' }} />
      </p>
      <p data-testid="date">
        <LocalizedDate value={epoch} format={{ en: 'MMM YYYY', ar: 'MMMM YYYY' }} />
      </p>
    </>
  );

  const text = (id: string) => screen.getByTestId(id).textContent;

  it('render localized values and re-render on setLocale', () => {
    const store = makeStore();
    render(<App />, { wrapper: wrapperFor(store) });
    expect(text('hello')).toBe('Hello, World!');
    expect(text('items')).toBe('2 items');
    expect(text('number')).toBe('100,000');
    expect(text('arab-number')).toBe('١٠٠٬٠٠٠');
    expect(text('date')).toBe('Jan 2018');

    act(() => {
      store.dispatch(setLocale('ar'));
    });
    expect(text('hello')).toBe('مرحباً أيها العالم');
    expect(text('items')).toBe('عنصران');
    expect(text('arab-number')).toBe('١٠٠٬٠٠٠');
    expect(text('date')).toBe('يناير ٢٠١٨');
  });

  it('Translation renders nothing for a missing key', () => {
    vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    render(
      <p data-testid="missing">
        <Translation tKey="nope" />
      </p>,
      { wrapper: wrapperFor(makeStore()) },
    );
    expect(text('missing')).toBe('');
  });

  it('ReactBindings keeps the 1.x names', () => {
    expect(ReactBindings.Translation).toBe(Translation);
    expect(ReactBindings.Number).toBe(LocalizedNumber);
    expect(ReactBindings.Date).toBe(LocalizedDate);
  });

  it('work with a plain Redux store built with combineReducers', () => {
    const store = createStore(combineReducers({ r16n: createR16nReducer(locales, 'ar') }));
    const { Translation: T, Number: N } = ReactBindings;
    render(
      <Provider store={store}>
        <p data-testid="legacy">
          <T tKey="navbar.home" /> <N value={5} options={{ numberingSystem: 'arab' }} />
        </p>
      </Provider>,
    );
    expect(text('legacy')).toBe('الرئيسية ٥');
  });
});
