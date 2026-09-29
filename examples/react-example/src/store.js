import { configureStore } from '@reduxjs/toolkit';
import { createR16nReducer } from 'r16n';
// Load the Moment.js locale data for every non-English locale you support.
// Vite and Rollup use Moment's ES build, so import the locale from `moment/dist/locale/*`
// (with webpack or in Node, use `moment/locale/*` instead).
import 'moment/dist/locale/ar';

export const locales = {
  en: {
    helloWorld: 'Hello, World!',
    a: { b: { c: { d: 'DUMMY TEXT' } } },
    cart: {
      '0': 'Your cart is empty',
      one: '{count} item in your cart',
      other: '{count} items in your cart',
    },
  },
  ar: {
    helloWorld: 'مرحباً أيها العالم',
    a: { b: { c: { d: 'نص بلا فائدة' } } },
    cart: {
      zero: 'سلتك فارغة',
      one: 'عنصر واحد في سلتك',
      two: 'عنصران في سلتك',
      few: '{count} عناصر في سلتك',
      many: '{count} عنصراً في سلتك',
      other: '{count} عنصر في سلتك',
    },
  },
};

// R16N's reducer must be mounted under the `r16n` key.
export const store = configureStore({
  reducer: {
    r16n: createR16nReducer(locales, 'en'),
  },
});
