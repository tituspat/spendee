// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyAInpVU-Epd1WccXjlcf60d0PNCpG1x_Ss',
  authDomain: 'spendy-ec233.firebaseapp.com',
  databaseURL: 'https://spendy-ec233-default-rtdb.asia-southeast1.firebasedatabase.app',
  projectId: 'spendy-ec233',
  storageBucket: 'spendy-ec233.appspot.com',
  messagingSenderId: '783153538695',
  appId: '1:783153538695:web:6c6ab459513019f82cfa22',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { app, db, auth };
