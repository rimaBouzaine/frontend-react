import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
        <BrowserRouter>
          <App />
        </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

reportWebVitals();


/////// 1  => templates  | 1 | 2 | 3 | (get)
//////  => update template 1  | get 1 | w put 1 ==> 2 request 

//|1    |
//|2 , 3 |