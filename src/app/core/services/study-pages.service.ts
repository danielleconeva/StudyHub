import { Injectable, inject } from '@angular/core';
import {
    Firestore,
    collection,
    collectionData,
    CollectionReference,
    doc,
    getDoc,
    setDoc,
    deleteDoc,
    updateDoc,
    increment,
    addDoc,
    Timestamp,
} from '@angular/fire/firestore';
import { AuthService } from './auth.service';

import { toSignal } from '@angular/core/rxjs-interop';
import { StudyPage } from '../../models/study-page.model';
import { Like } from '../../models/like.model';
import { Comment } from '../../models/comment.model';

@Injectable({ providedIn: 'root' })
export class StudyPagesService {
    private firestore = inject(Firestore);
    private authService = inject(AuthService);

    private pagesRef = collection(this.firestore, 'pages') as CollectionReference<StudyPage>;
    private likesRef = collection(this.firestore, 'likes') as CollectionReference<Like>;
    private commentsRef = collection(this.firestore, 'comments') as CollectionReference<Comment>;

    private _pagesSignal = toSignal(collectionData(this.pagesRef, { idField: 'id' }));
    private _likesSignal = toSignal(collectionData(this.likesRef, { idField: 'id' }));
    private _commentsSignal = toSignal(collectionData(this.commentsRef, { idField: 'id' }));

    getStudyPages() {
        return this._pagesSignal;
    }

    getLikes() {
        return this._likesSignal;
    }

    getComments() {
        return this._commentsSignal;
    }

    getPageById(pageId: string): Promise<StudyPage | null> {
        const pageRef = doc(this.firestore, 'pages', pageId);
        return getDoc(pageRef).then(snapshot => {
            return snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } as StudyPage : null;
        });
    }

    addPage(page: Omit<StudyPage, 'id' | 'ownerId'>): Promise<void> {
        const pageId = doc(this.pagesRef).id;
        const currentUser = this.authService.currentUser();

        if (!currentUser) {
            return Promise.reject(new Error('No authenticated user found.'));
        }

        const newPage: StudyPage = {
            id: pageId,
            ownerId: currentUser.id,
            title: page.title,
            subject: page.subject,
            notes: page.notes,
            syllabus: page.syllabus ?? [],
            resources: page.resources ?? [],
            isPublic: page.isPublic,
            createdAt: Timestamp.now(),
            likesCount: 0
        };

        const pageRef = doc(this.firestore, 'pages', pageId);
        return setDoc(pageRef, newPage);
    }

    updateStudyPage(pageId: string, data: Partial<StudyPage>): Promise<void> {
        const pageRef = doc(this.firestore, 'pages', pageId);
        return updateDoc(pageRef, data);
    }

    deleteStudyPage(pageId: string): Promise<void> {
        const pageRef = doc(this.firestore, 'pages', pageId);
        return deleteDoc(pageRef);
    }

    toggleLike(pageId: string, userId: string): Promise<'liked' | 'unliked'> {
        const likeId = `${pageId}_${userId}`;
        const likeRef = doc(this.firestore, 'likes', likeId);
        const pageRef = doc(this.firestore, 'pages', pageId);

        return getDoc(likeRef).then(snapshot => {
            if (snapshot.exists()) {
                return deleteDoc(likeRef).then(() =>
                    updateDoc(pageRef, { likesCount: increment(-1) }).then(() => 'unliked')
                );
            } else {
                return setDoc(likeRef, {
                    pageId,
                    userId,
                    likedAt: Timestamp.now()
                }).then(() =>
                    updateDoc(pageRef, { likesCount: increment(1) }).then(() => 'liked')
                );
            }
        });
    }

    addComment(comment: Omit<Comment, 'id'>): Promise<void> {
        return addDoc(this.commentsRef, {
            ...comment,
            createdAt: Timestamp.now()
        }).then(() => void 0);
    }

    deleteComment(comment: Comment): Promise<void> {
        if (!comment.id) {
            return Promise.reject(new Error('Cannot delete comment: missing comment ID.'));
        }

        const commentRef = doc(this.firestore, 'comments', comment.id);
        return deleteDoc(commentRef);
    }
}
