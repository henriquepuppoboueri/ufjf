import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAjF6lMKJjHtdjOL0vDL1zP64NcjOHpzKY",
  authDomain: "qweeter-e284b.firebaseapp.com",
  projectId: "qweeter-e284b",
  storageBucket: "qweeter-e284b.appspot.com",
  messagingSenderId: "648242989530",
  appId: "1:648242989530:web:0f2c79363b6c417d5298e3"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default db
