import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { initializeFirestore, persistentLocalCache } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyA8lHudEkL1-xQin_iYm8KV9t8W4MQZHLM",
  authDomain: "magic-shop-online.firebaseapp.com",
  projectId: "magic-shop-online",
  storageBucket: "magic-shop-online.firebasestorage.app",
  messagingSenderId: "816918415815",
  appId: "1:816918415815:web:1df47b1edcd2bd315871e2",
  measurementId: "G-3JJZ7B9PYL"
};


// Initialize Firebase
const appfirebase = initializeApp(firebaseConfig);

let db;
try {
  db = initializeFirestore(appfirebase, {
    localCache: persistentLocalCache({
      cacheSizeBytes: 100 * 1024 * 1024, // 100 MB (opcional, para limitar tamaño)
    }),
  });
  console.log("Firestore inicializado con persistencia offline.");
} catch (error) {
  console.error("Error al inicializar Firestore con persistencia:", error);
  // Fallback: inicializar sin persistencia si falla
  db = initializeFirestore(appfirebase, {});
}

//Inicializa autenticación 
const auth = getAuth(appfirebase);

// Inicializa Storage
const storage = getStorage(appfirebase);

export { appfirebase, db, auth, storage };