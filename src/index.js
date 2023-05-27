import ReactDOM from 'react-dom/client';

//
import App from './App';
import * as serviceWorker from './serviceWorker';
import reportWebVitals from './reportWebVitals';
import { initializeApp } from "firebase/app";



// ----------------------------------------------------------------------

const firebaseConfig = {
    apiKey: "AIzaSyDgh6sFpRq3YmEJDW4Z-L4ReInFSkA6NSY",
    authDomain: "debate-center-dd720.firebaseapp.com",
    projectId: "debate-center-dd720",
    storageBucket: "debate-center-dd720.appspot.com",
    messagingSenderId: "524928099280",
    appId: "1:524928099280:web:9b24e083399f9bfae0cfd5"
  };
  
// Initialize Firebase
const app = initializeApp(firebaseConfig);

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(<App />);

// If you want to enable client cache, register instead.
serviceWorker.unregister();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();



