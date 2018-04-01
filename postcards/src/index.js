import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import firebase from 'firebase';
import {Route, HashRouter} from 'react-router-dom';
import SignUpForm from './SignUpForm';
import SignIn from './SignIn';

//load our CSS file
import './index.css';

  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyA5zj-oGT5jwoGY0booNAkiL-E1w1kJJTw",
    authDomain: "postcards-71b86.firebaseapp.com",
    databaseURL: "https://postcards-71b86.firebaseio.com",
    projectId: "postcards-71b86",
    storageBucket: "postcards-71b86.appspot.com",
    messagingSenderId: "317590344118"
  };
  firebase.initializeApp(config);

//render the application
ReactDOM.render((
    <HashRouter> 
      <App/>
    </HashRouter>),
    document.getElementById('root'))
  
registerServiceWorker();
