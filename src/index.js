// Packages:
import React from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';


// Imports:
import './index.css';


// Firebase Imports:
import * as firebase from "firebase/app";
import "firebase/analytics";
import "firebase/database";


// Components:
import App from './App';


// Initialize Firebase:
const firebaseConfig = {
  apiKey: "AIzaSyDASoUlqdSLf1u7mxD1WXuZNi5fCZFhYgE",
  authDomain: "darkboi-748ea.firebaseapp.com",
  databaseURL: "https://darkboi-748ea.firebaseio.com",
  projectId: "darkboi-748ea",
  storageBucket: "darkboi-748ea.appspot.com",
  messagingSenderId: "957406294719",
  appId: "1:957406294719:web:55717bb752b2145ea8cc0a"
};

firebase.initializeApp(firebaseConfig);


// Render:
ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
