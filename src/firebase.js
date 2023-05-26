import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyDgh6sFpRq3YmEJDW4Z-L4ReInFSkA6NSY",
    authDomain: "debate-center-dd720.firebaseapp.com",
    projectId: "debate-center-dd720",
    storageBucket: "debate-center-dd720.appspot.com",
    messagingSenderId: "524928099280",
    appId: "1:524928099280:web:9b24e083399f9bfae0cfd5"
};

const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

export default firestore; // Explicitly export default
// export { firestore }; // Also export as named export