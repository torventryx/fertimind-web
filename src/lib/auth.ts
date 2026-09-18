'use client';

import { getAuth } from 'firebase/auth';
import { firebaseClientApp } from './client-firebase';

export const auth = getAuth(firebaseClientApp());
