import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";

const firebaseConfig = {
    apiKey: "AIzaSyDPCWvaLkMerC2k_RMivnhFlQ_WisO9nTE",
    authDomain: "burgerqui.firebaseapp.com",
    databaseURL: "https://burgerqui-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "burgerqui",
    storageBucket: "burgerqui.firebasestorage.app",
    messagingSenderId: "420019890117",
    appId: "1:420019890117:web:8ab686c161173b334f4dac",
};

const app = initializeApp(firebaseConfig);
console.log(app);
export { app };
