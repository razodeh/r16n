<img src="https://cdn.rawgit.com/razodeh/r16n/ab1ec653/logo/logo-title.png" height="50px" alt="R16N Logo" /> 

# Reduxtionalization (Redux I18N) [![Build Status](https://travis-ci.org/razodeh/r16n.svg?branch=master)](https://travis-ci.org/razodeh/r16n) 

[Installation](#installation) | [Usage](#usage) | [Bindings](#bindings)

## Installation
Using npm:
```
npm install r16n
```
Using yarn:
```
yarn add r16n
```

## Usage

### 1. Create R16N Reducer
Create R16N reducer with your own locales, and the current locale.

```javascript
import {createR16nReducer} from 'r16n';
// ...
const locales = {
    en: {
        helloWorld: 'Hello, World!',
        navbar: {
	            home: 'Home'
        }
    },
    ar: {
        helloWorld: 'مرحباً أيها العالم',
        navbar: {
            home: "الرئيسية"
        }
    },
    zh_HK: {
		helloWorld: "你好世界",
		navbar: {
			home: "主页",
		}
	}
};
// Your default locale, whether it is fixed, or imported from a cookie or an API.
const currentLocale = 'en';
const reducers = combineReducers({
	// ...
    r16n: createR16nReducer(locales, currentLocale),
});
```
> R16N's reducer name has to be `r16n`, otherwise it won't work.

### 2. Select Your Translations

#### `getTranslation(state, key)`:
Returns the translation state of the requested key, and count.
**args** :

 - `state` : Redux store state.
 - `key` : dot-separated string indicating your translation path.

If your locales object was the following:
```javascript
{
	en:{
		dummyKey: 'Dummy Translation',
		nestedKey: {
			anotherKey: 'Another Translation'
		}
	},
	// ... other locales.
}
```
`dummyKey`, and `nestedKey.anotherKey` are valid translation keys.

**example** :
```javascript
import {getTranslation} from 'r16n';
// ...
const mapStateToProps = (state) => ({
	// ...
    appleText: getTranslation(state, 'navbar.home'), // en-> Home, ar-> الرئيسية
});
export default connect(mapStateToProps, ...)(/*Your Component*/);
```
> The same works on every locale you provide.

#### `getTranslations(state)`:
Returns the current translations object, just in case you needed it.

**args** :

 - `state` : Redux store state.

**example** :
```javascript
import {getTranslations} from 'r16n';
const mapStateToProps = (state) => ({
	// ...
    translations: getTranslations(state), // all of translations
    appleText: getTranslation(state).text.apple // single translation
});
export default connect(mapStateToProps, ...)(/*Your Component*/);
```

#### `getLocale(state)`:
Returns the current locale state of the app.

**args**:

 - `state` : Redux store state

**example** :

```javascript
import {getLocale} from 'r16n';
// ...
const mapStateToProps = (state) => ({
	// ...
    locale: getLocale(state),
});
export default connect(mapStateToProps, ...)(/*Your Component*/);
```

### 3. Change Your App's locale
####  `setLocale(locale)`:
Sets the locale code you've passed and its translations as the current translations and locale of your app.

**example** :

```javascript
// Your Component
const SomeComponent = (props) => 
	<div>
		<button onClick={()=> props.setLocale('ar')}>ع</button>
		<button onClick={()=> props.setLocale('en')}>En</button>
	</div>
const mapDispatchToProps = (dispatch) => ({
	// ...
    setLocale: (locale) => dispatch(setLocale(locale)),
});
export default connect(..., mapDispatchToProps)(/*Your Component*/);
```

## Bindings
### React
The following are React Components that are already connected to with **R16N**.
> Whenever `setLocale(...)` action is called with new locale, they re-render with the localized value.

#### Translation
A binding for `getTranslation(state, key)`

**Props** :

 - `tKey` : it is like the `key` attribute for [`getTranslation(...)`](#getTranslation)

**example**: 
```javascript
import {Translation} from 'r16n/React';
// ... Inside your component.
	<Translation tKey='text.apple'/>
// ...
```
#### Date
A binding for localizing dates, it uses [`Moment.js`](https://momentjs.com/) for formatting and translating dates.

Whenever `setLocale(...)` action is called with new locale, it re-renders with the localized date.

**Props** :

 - `value` : Date value whether it is (epoch `number`, `string`, or `Date` object).
 - `format` : format `string`, or a locale-format mapping object. check [Moment.js Displaying reference](https://momentjs.com/docs/#/displaying/).

**example** :
```javascript
import {Date} from 'r16n/React'
// ... Inside your component
	<Date value={1514908177545} format="gggg-MM-ddd hh:mmA"/> // en-> 2018-01-Tue 05:49PM, ar-> ٢٠١٨-٠١-ثلاثاء ٠٥:٤٩م
	// Different Formats for each locale.
	<Date value="2018-01-09T19:09:33+02:00" format={{en:"gggg-MM-d hh:mmA", ar: "gggg-MM-d ddd hh:mmA"}}/> // en-> 2018-01-2 07:09PM, ar-> ٢٠١٨-٠١-٢ ثلاثاء ٠٧:٠٩م
// ...
```
#### Number
A binding for localizing numbers. 

**Props** :

 - `value` : the `number` or number `string` you want to localize. 

**example** :
```javascript
import {Number} from 'r16n/React'
// ... Inside your component
	<Number value="1"/> // en-> 1, ar-> ١
	<Number value={23232}/>	// en-> 23,232 ar-> ٢٣٬٢٣٢
// ...
```

#### [React Example](./examples/react-example)
## License
MIT
