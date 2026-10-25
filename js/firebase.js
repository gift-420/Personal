// js/firebase.js
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import {
  getFirestore, collection, addDoc, serverTimestamp,
  getDocs, query, orderBy, where, doc, getDoc, setDoc,
  updateDoc, deleteDoc, onSnapshot, deleteField
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';
import {
  getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword,
  signOut, onAuthStateChanged, updateProfile
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';

const firebaseConfig = {
  apiKey: "AIzaSyC5yPcFGwfQwJFlneiVM-lyJy6UW7iTBag",
  authDomain: "naim-store-a961d.firebaseapp.com",
  projectId: "naim-store-a961d",
  storageBucket: "naim-store-a961d.firebasestorage.app",
  messagingSenderId: "1018491734368",
  appId: "1:1018491734368:web:feb40c723753e18ce17605"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

export {
  collection, addDoc, serverTimestamp, getDocs, query, orderBy, where,
  doc, getDoc, setDoc, updateDoc, deleteDoc, onSnapshot, deleteField,
  signInWithEmailAndPassword, createUserWithEmailAndPassword,
  signOut, onAuthStateChanged, updateProfile
};

export const ADMIN_EMAIL = 'naimeboss999@gmail.com';
