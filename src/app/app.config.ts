// src/app/app.config.ts

import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';

import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideStorage, getStorage } from '@angular/fire/storage';


const firebaseConfig = {
  apiKey: "AIzaSyAnZleA8i_rc_zGVybCA7tkb5uh2e9scSo",
  authDomain: "studyhub-6b7d9.firebaseapp.com",
  projectId: "studyhub-6b7d9",
  storageBucket: "studyhub-6b7d9.firebasestorage.app",
  messagingSenderId: "698769138557",
  appId: "1:698769138557:web:15bb7b1efad5ec1e63e214"
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),

    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage())
  ]
};
