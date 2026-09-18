'use client';

import { getFirestore } from 'firebase/firestore';
import { firebaseClientApp } from './client-firebase';

export { auth } from './auth';
export const db = getFirestore(firebaseClientApp());
