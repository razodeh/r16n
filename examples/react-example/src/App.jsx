import { useState } from 'react';
import { useSelector } from 'react-redux';
import {
  LocalizedDate,
  LocalizedNumber,
  Translation,
  useLocale,
  useSetLocale,
  useTranslation,
  useTranslator,
} from 'r16n';

export const App = () => {
  const locale = useLocale();
  const setLocale = useSetLocale();
  const hello = useTranslation('helloWorld');
  const t = useTranslator();
  const r16nState = useSelector((state) => state.r16n);
  const [count, setCount] = useState(0);

  return (
    <div dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <button onClick={() => setLocale('ar')}>ع</button>
      <button onClick={() => setLocale('en')}>En</button>

      <h1>
        {locale} → {hello}
      </h1>
      <p>{t('a.b.c.d')}</p>
      <hr />

      <h4>Translation</h4>
      <Translation tKey="helloWorld" />

      <h4>Plurals</h4>
      <button onClick={() => setCount((n) => Math.max(0, n - 1))}>−</button>
      <button onClick={() => setCount((n) => n + 1)}>+</button>{' '}
      <Translation tKey="cart" count={count} />

      <h4>Numbers</h4>
      <LocalizedNumber value={1234567.89} />
      <br />
      <LocalizedNumber value={1234567.89} options={{ numberingSystem: locale === 'ar' ? 'arab' : 'latn' }} />
      <br />
      <LocalizedNumber value={42} options={{ style: 'currency', currency: 'USD' }} />

      <h4>Dates</h4>
      <LocalizedDate value={1514908177545} format="YYYY-MM-DD ddd hh:mmA" />
      <br />
      <LocalizedDate value="2018-01-09T19:09:33+02:00" format={{ en: 'MMMM D, YYYY', ar: 'D MMMM YYYY' }} />

      <h4>Store structure</h4>
      <pre dir="ltr">{JSON.stringify(r16nState, null, 2)}</pre>
    </div>
  );
};
