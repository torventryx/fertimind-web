// Config pública de Firebase para el cliente web (mismos valores que usa la
// app en lib/firebase_options.dart — son valores de cliente, no secretos).
// Solo se usa para autenticación (Firebase Auth); todo el contenido se
// sirve desde el servidor con Admin SDK.

import { initializeApp, getApps, getApp } from 'firebase/app';

export const firebaseConfig = {
  apiKey: 'AIzaSyA0LBu8iqz0B3BvCnxHTnHSYpRkdq19ef8',
  appId: '1:867237028045:web:e150ee14d94e101e8ac984',
  messagingSenderId: '867237028045',
  projectId: 'fivmind-c7897',
  storageBucket: 'fivmind-c7897.firebasestorage.app',
  authDomain: 'fivmind-c7897.firebaseapp.com',
};

export function firebaseClientApp() {
  return getApps().length ? getApp() : initializeApp(firebaseConfig);
}
