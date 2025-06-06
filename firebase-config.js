// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getFirestore, collection, getDocs, doc, setDoc, addDoc, query, where, updateDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyClsguOyxbDChVRgLIh3XJXU5qhHem2iZ4",
  authDomain: "sbs-test-407c5.firebaseapp.com",
  projectId: "sbs-test-407c5",
  storageBucket: "sbs-test-407c5.appspot.com",
  messagingSenderId: "500401138673",
  appId: "1:500401138673:web:c14bcc850c3e35e3edf250"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Export firestore functions for use in other scripts
export { db, collection, getDocs, doc, setDoc, addDoc, query, where, updateDoc, deleteDoc }; 