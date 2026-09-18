// Firebase Admin SDK para SSR. En Cloud Run (deploy de Firebase web
// frameworks) usa las credenciales por defecto del servicio; en desarrollo
// local, GOOGLE_APPLICATION_CREDENTIALS apunta a la service account.

import { initializeApp, getApps, cert, App } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';

let app: App | undefined;

function getApp(): App {
  if (!getApps().length) {
    // GOOGLE_APPLICATION_CREDENTIALS_JSON permite inyectar la clave como
    // variable de entorno (útil en despliegues sin archivo local).
    const credentialsJson = process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON;
    app = credentialsJson
      ? initializeApp({ credential: cert(JSON.parse(credentialsJson)) })
      : initializeApp();
  }
  return getApps()[0];
}

export function db(): Firestore {
  return getFirestore(getApp());
}
