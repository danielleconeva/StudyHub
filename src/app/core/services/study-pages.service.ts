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
} from '@angular/fire/firestore';

import { toSignal } from '@angular/core/rxjs-interop';

import { StudyPage } from '../../models/study-page.model';
import { Like } from '../../models/like.model';
import { Comment } from '../../models/comment.model';

@Injectable({ providedIn: 'root' })
export class StudyPagesService {
    private firestore = inject(Firestore);

    private pagesRef = collection(this.firestore, 'pages') as CollectionReference<StudyPage>;
    private likesRef = collection(this.firestore, 'likes') as CollectionReference<Like>;
    private commentsRef = collection(this.firestore, 'comments') as CollectionReference<Comment>;

    private _pagesSignal = toSignal(collectionData(this.pagesRef, { idField: 'id' }));
    private _likesSignal = toSignal(collectionData(this.likesRef));
    private _commentsSignal = toSignal(collectionData(this.commentsRef, { idField: 'id' })); // ✅ Add idField to comments

    getStudyPages() {
        return this._pagesSignal;
    }

    getLikes() {
        return this._likesSignal;
    }

    getComments() {
        return this._commentsSignal;
    }

    toggleLike(pageId: string, userId: string): Promise<'liked' | 'unliked'> {
        const likeId = `${pageId}_${userId}`;
        const likeRef = doc(this.firestore, 'likes', likeId);
        const pageRef = doc(this.firestore, 'pages', pageId);

        return getDoc(likeRef).then((snapshot) => {
            if (snapshot.exists()) {
                return deleteDoc(likeRef).then(() =>
                    updateDoc(pageRef, { likesCount: increment(-1) }).then(() => 'unliked')
                );
            } else {
                return setDoc(likeRef, {
                    pageId,
                    userId,
                    likedAt: new Date().toISOString(),
                }).then(() =>
                    updateDoc(pageRef, { likesCount: increment(1) }).then(() => 'liked')
                );
            }
        });
    }

    addComment(comment: Comment) {
        return addDoc(this.commentsRef, comment);
    }

    deleteComment(comment: Comment): Promise<void> {
        if (!comment.id) {
            return Promise.reject(new Error('Cannot delete comment: missing comment ID.'));
        }

        const commentRef = doc(this.firestore, 'comments', comment.id);
        return deleteDoc(commentRef);
    }
}
