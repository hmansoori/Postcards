import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App'; //import our component

//load our CSS file
import './components/index.css';

//render the Application view
ReactDOM.render((
 <App />),
  document.getElementById('root')
);

//registerServiceWorker();