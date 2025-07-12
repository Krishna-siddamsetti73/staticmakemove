import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator, Firestore, CollectionReference, collection as firestoreCollection, DocumentData, addDoc as firestoreAddDoc } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';
import { getStorage } from 'firebase/storage';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
    apiKey: "AIzaSyDtpM4CUOzIdDw-93HnJIdTmOzsxkx01Gw",
    authDomain: "makeamovestatic.firebaseapp.com",
    projectId: "makeamovestatic",
    storageBucket: "makeamovestatic.firebasestorage.app",
    messagingSenderId: "1032539074081",
    appId: "1:1032539074081:web:a46d6d330726c70434fd60",
    measurementId: "G-9M27413DGH",
    databaseURL: 'https://makeamovestatic-default-rtdb.asia-southeast1.firebasedatabase.app', // ✅ use this
  };
// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const analytics = getAnalytics(app);
export const storage = getStorage(app);
export const database = getDatabase(app);

// function collection(db: Firestore, path: string): CollectionReference {
//     return firestoreCollection(db, path);
// }

// async function addDoc(colRef: CollectionReference<DocumentData, DocumentData>, item: any) {
//     return await firestoreAddDoc(colRef, item);
// }

// const uploadDataToFirestore = async () => {
//   const colRef = collection(db, "packages");

//   // Define your data array here
//   const data: Package[] = []; // TODO: Populate this array with your package data

//   for (const item of data) {
//     await addDoc(colRef, item);
//   }

//   console.log("✅ Data uploaded to Firestore");
// };
// uploadDataToFirestore();
// Export the app instance
export default app;

