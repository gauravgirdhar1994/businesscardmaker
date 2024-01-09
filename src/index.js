import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { BrowserRouter } from "react-router-dom"
import { Provider } from "react-redux"
import reducer from "./Reducers"
import { createStore, applyMiddleware, compose } from "redux"
import { thunk } from "redux-thunk"
import 'bootstrap/dist/css/bootstrap.css';
import WebFont from 'webfontloader';

let store = createStore(reducer, compose(applyMiddleware(thunk)))

WebFont.load({
  google: {
    families: ['Arial :300,400,700', 'Lato:300, 400, 500', 'Lemon:300, 400, 500', 'Roboto', 'Open Sans:300, 400, 500', 'Montserrat:300, 400, 500', 'Pacifico:300, 400, 500', 'Lobster:300, 400, 500', 'sans-serif'],
  }
});

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

