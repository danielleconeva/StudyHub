import { Injectable } from '@angular/core';
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
} from '@angular/fire/firestore';

import { toSignal } from '@angular/core/rxjs-interop';
import { StudyPage } from '../../models/study-page.model';
import { Like } from '../../models/like.model';
import { Comment } from '../../models/comment.model';

@Injectable({ providedIn: 'root' })
export class StudyPagesService {
    constructor(private firestore: Firestore) { }

    getStudyPages() {
        const ref = collection(this.firestore, 'pages') as CollectionReference<StudyPage>;
        return toSignal(collectionData(ref, { idField: 'id' }));
    }

    getLikes() {
        const ref = collection(this.firestore, 'likes') as CollectionReference<Like>;
        return toSignal(collectionData(ref));
    }

    getComments() {
        const ref = collection(this.firestore, 'comments') as CollectionReference<Comment>;
        return toSignal(collectionData(ref));
    }

    /**
     * 🔁 Toggle like: if already liked by user, unlike it; else, like it
     * Returns a Promise that resolves to either `'liked'` or `'unliked'`
     */
    toggleLike(pageId: string, userId: string): Promise<'liked' | 'unliked'> {
        const likeId = `${pageId}_${userId}`;
        const likeRef = doc(this.firestore, 'likes', likeId);
        const pageRef = doc(this.firestore, 'pages', pageId);

        return getDoc(likeRef).then(snapshot => {
            if (snapshot.exists()) {
                // 👎 Unlike
                return deleteDoc(likeRef).then(() =>
                    updateDoc(pageRef, { likesCount: increment(-1) }).then(() => 'unliked')
                );
            } else {
                // 👍 Like
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
}
