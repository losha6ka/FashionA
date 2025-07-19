import { initializeApp } from "firebase/app";
// import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth"; // ✅ Добавляем

const firebaseConfig = {
    apiKey: "AIzaSyAcLnH4JPza-ZPLGYR6f3WMRBmm8GZKVYU",
    authDomain: "vany-dd0bb.firebaseapp.com",
    projectId: "vany-dd0bb",
    storageBucket: "vany-dd0bb.appspot.com",
    messagingSenderId: "212929494522",
    appId: "1:212929494522:web:510690c4dfbd127141f843",
    measurementId: "G-LHLV38GHCX"
};

const app = initializeApp(firebaseConfig);
// export const db = getFirestore(app);
export const auth = getAuth(app); // ✅ Экспортируем auth
