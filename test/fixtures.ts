import type { Locales } from '../src';

export const locales = {
  en: {
    helloWorld: 'Hello, World!',
    empty: '',
    navbar: {
      home: 'Home',
    },
    cart: {
      items: {
        '0': 'Your cart is empty',
        one: '{count} item',
        other: '{count} items',
      },
    },
    greeting: 'You have {count} new messages',
  },
  ar: {
    helloWorld: 'مرحباً أيها العالم',
    empty: '',
    navbar: {
      home: 'الرئيسية',
    },
    cart: {
      items: {
        zero: 'لا يوجد عناصر',
        one: 'عنصر واحد',
        two: 'عنصران',
        few: '{count} عناصر',
        many: '{count} عنصراً',
        other: '{count} عنصر',
      },
    },
    greeting: 'لديك {count} رسائل جديدة',
  },
} satisfies Locales;
