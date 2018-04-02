import React from 'react';
import ReactDOM from 'react-dom';
import { unregister } from './registerServiceWorker';
import App from './components/App'; //import our component

//load our CSS file
import './components/index.css';

//unregister service worker (conflicts with firebase)
unregister();

//render the Application view
ReactDOM.render((
 <App />),
  document.getElementById('root')
);

