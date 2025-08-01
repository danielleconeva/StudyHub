import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { from, map, Observable, tap } from 'rxjs';

import {
  Auth,
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithEmailAndPassword,
  signOut,
  UserCredential
} from '@angular/fire/auth';

import {
  Firestore,
  doc,
  setDoc
} from '@angular/fire/firestore';

export interface User {
  id: string;
  username: string;
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _isLoggedIn = signal<boolean>(false);
  private _currentUser = signal<User | null>(null);

  public isLoggedIn = this._isLoggedIn.asReadonly();
  public currentUser = this._currentUser.asReadonly();

  constructor(
    private auth: Auth,
    private firestore: Firestore,
    private router: Router
  ) {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      this._currentUser.set(JSON.parse(savedUser));
      this._isLoggedIn.set(true);
    }
  }


  registerUser(fullName: string, email: string, password: string): Promise<void> {
    return createUserWithEmailAndPassword(this.auth, email, password)
      .then(async (cred: UserCredential) => {
        if (!cred.user) throw new Error('User creation failed');

        await updateProfile(cred.user, { displayName: fullName });

        const user: User = {
          id: cred.user.uid,
          username: fullName,
          email: cred.user.email ?? ''
        };

        await setDoc(doc(this.firestore, 'users', user.id), {
          username: user.username,
          email: user.email,
          createdAt: new Date()
        });

        this._currentUser.set(user);
        this._isLoggedIn.set(true);
        localStorage.setItem('currentUser', JSON.stringify(user));
      });
  }


  loginUser(email: string, password: string): Observable<User> {
    return from(signInWithEmailAndPassword(this.auth, email, password)).pipe(
      map(cred => {
        const user: User = {
          id: cred.user.uid,
          username: cred.user.displayName ?? 'Anonymous',
          email: cred.user.email ?? ''
        };

        this._currentUser.set(user);
        this._isLoggedIn.set(true);
        localStorage.setItem('currentUser', JSON.stringify(user));

        return user;
      })
    );
  }


  logout(): Observable<void> {
    return from(signOut(this.auth)).pipe(
      tap(() => {
        this._currentUser.set(null);
        this._isLoggedIn.set(false);
        localStorage.removeItem('currentUser');
        this.router.navigateByUrl('/');
      })
    );
  }


  getCurrentUserId(): string | null {
    return this._currentUser()?.id ?? null;
  }
}
