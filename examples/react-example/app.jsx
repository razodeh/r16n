import React from 'react';
import ReactDom from 'react-dom';
import { combineReducers, createStore, compose } from 'redux';
import { connect, Provider } from 'react-redux';
import {createR16nReducer, setLocale, getLocale, getTranslation} from 'r16n';
import {Number, Date} from 'r16n/React';
const Translation = require('r16n/React').Translation;

const locales = {
    en: {
        helloWorld: 'Hello, World!',
        a: {
            b: {
                c: {
                    d: 'DUMMY TEXT',
                }
            }
        }
    },
    ar: {
        helloWorld: 'مرحباً أيها العالم',
        a: {
            b: {
                c: {
                    d: 'نص بلا فائدة',
                }
            }
        }
    }
};

const reducers = combineReducers({
    r16n: createR16nReducer(locales, 'en'),
});

const enhancers = [
    window.devToolsExtension(),
];

const store = createStore(reducers, compose(...enhancers));

// Create App
const App = ({ text, locale, setLocale, r16nStore, dummyText }) =>
    <div>
        <button onClick={() => setLocale('ar')}>
            ع
        </button>
        <button onClick={() => setLocale('en')}>
            En
        </button>
        
        <h1>
            {locale} -> {text}
        </h1>
        <div>
            {dummyText}
        </div>
        <hr />
        <h4>Translation</h4>
        <Translation tKey="helloWorld" />
        <br/>
        <h4>Numbers</h4>
        <Number value="1" />
        <br/>
        <h4>Dates</h4>
        <Date value={1514908177545} format="gggg-MM-ddd hh:mmA"/><br/>
        <Date value="2018-01-09T19:09:33+02:00" format={{ar: "gggg-MM-d ddd hh:mmA"}}/>
        <br/>
        <div>
            <h4>Store Structure</h4>
            <pre>
                {JSON.stringify(r16nStore, null, 4)}
            </pre>
        </div>
    </div>;

const mapStateToProps = (state) => ({
    text: getTranslation(state, 'helloWorld'),
    locale: getLocale(state),
    r16nStore: state.r16n,
    dummyText: getTranslation(state, 'a.b.c.d'),
});
const mapDispatchToProps = (dispatch) => ({
    setLocale: (locale) => dispatch(setLocale(locale)),
});

// Connect it to store.
const AppContainer = connect(mapStateToProps, mapDispatchToProps)(App);

// Render it.
ReactDom.render(
    <Provider store={store}>
        <AppContainer />
    </Provider>,
    document.getElementById('app')
);
