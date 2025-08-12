import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { from, map, Observable, tap } from 'rxjs';
import { Auth, createUserWithEmailAndPassword, updateProfile, signInWithEmailAndPassword, signOut, UserCredential, onAuthStateChanged } from '@angular/fire/auth';

import { Firestore, doc, setDoc, collection, collectionData, getDoc, getDocs, DocumentData } from '@angular/fire/firestore';

export interface User {
  id: string;
  username: string;
  email: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _isLoggedIn = signal<boolean>(false);
  private _currentUser = signal<User | null>(null);
  private _authResolved = signal<boolean>(false);

  public isLoggedIn = this._isLoggedIn.asReadonly();
  public currentUser = this._currentUser.asReadonly();
  public authResolved = this._authResolved.asReadonly();

  constructor(
    private auth: Auth,
    private firestore: Firestore,
    private router: Router
  ) {
    onAuthStateChanged(this.auth, async (firebaseUser) => {
      if (firebaseUser) {
        await this.syncUserFromFirestore(
          firebaseUser.uid,
          firebaseUser.displayName,
          firebaseUser.email
        );
      } else {
        this._currentUser.set(null);
        this._isLoggedIn.set(false);
        localStorage.removeItem('currentUser');
      }

      this._authResolved.set(true);
    });
  }

  private async syncUserFromFirestore(
    uid: string,
    fallbackName: string | null,
    email: string | null
  ) {
    try {
      const userDoc = await getDoc(doc(this.firestore, 'users', uid));
      const data = userDoc.exists() ? (userDoc.data() as DocumentData) : null;

      const user: User = {
        id: uid,
        username: data?.['username'] ?? fallbackName ?? 'Anonymous',
        email: email ?? '',
      };

      this._currentUser.set(user);
      this._isLoggedIn.set(true);
      localStorage.setItem('currentUser', JSON.stringify(user));
    } catch (err) {
      console.error('Failed to fetch user from Firestore:', err);
    }
  }
  registerUser(username: string, email: string, password: string): Promise<void> {
    return createUserWithEmailAndPassword(this.auth, email, password).then(
      async (cred: UserCredential) => {
        if (!cred.user) throw new Error('User creation failed');

        await updateProfile(cred.user, { displayName: username });

        const user: User = {
          id: cred.user.uid,
          username,
          email: cred.user.email ?? '',
        };

        await setDoc(doc(this.firestore, 'users', user.id), {
          username: user.username,
          email: user.email,
          createdAt: new Date(),
        });

        this._currentUser.set(user);
        this._isLoggedIn.set(true);
        localStorage.setItem('currentUser', JSON.stringify(user));
      }
    );
  }

  loginUser(email: string, password: string): Observable<User> {
    return from(signInWithEmailAndPassword(this.auth, email, password)).pipe(
      map((cred) => {
        return {
          id: cred.user.uid,
          username: cred.user.displayName ?? 'Anonymous',
          email: cred.user.email ?? '',
        };
      })
    );
  }

  logout(): Observable<void> {
    return from(signOut(this.auth)).pipe(
      tap(() => {
        this.router.navigateByUrl('/');
      })
    );
  }

  getCurrentUserId(): string | null {
    return this._currentUser()?.id ?? null;
  }

  getAllUsers(): Observable<User[]> {
    const usersRef = collection(this.firestore, 'users');
    return from(getDocs(usersRef)).pipe(
      map((snapshot) =>
        snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        } as User))
      )
    );
  }
}
