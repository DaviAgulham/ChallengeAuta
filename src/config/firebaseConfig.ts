import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyCrT93415aVlari5IIho7eKHmgfbkbFbjM",
    authDomain: "car-catalog-fb3e4.firebaseapp.com",
    projectId: "car-catalog-fb3e4",
    storageBucket: "car-catalog-fb3e4.appspot.com",
    messagingSenderId: "51248305111",
    appId: "1:51248305111:web:a08a7a576c817c518bb192"
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

const auth = getAuth(app);

const storage = getStorage(app);

export { db, auth , storage};