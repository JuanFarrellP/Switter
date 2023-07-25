import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAobeDwAmXZhoiasslWFXoSih66hge_PKI",
  authDomain: "switter-bd70f.firebaseapp.com",
  projectId: "switter-bd70f",
  storageBucket: "switter-bd70f.appspot.com",
  messagingSenderId: "314922286792",
  appId: "1:314922286792:web:f9a1d7b6231530d2e7effd",
};

const app = initializeApp(firebaseConfig);

let db = getFirestore(app);

export default db;
