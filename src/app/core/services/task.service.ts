import { Injectable, inject, EnvironmentInjector, runInInjectionContext } from '@angular/core';
import {
    Firestore,
    collection,
    collectionData,
    doc,
    updateDoc,
    deleteDoc,
    getDoc,
    query,
    where,
    setDoc,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';

import { Task, Subtask } from '../../models/task.model';
import { AuthService } from './auth.service';
import { ModalService } from '../services/modal.service';

@Injectable({ providedIn: 'root' })
export class TaskService {
    private firestore = inject(Firestore);
    private authService = inject(AuthService);
    private modal = inject(ModalService);
    private envInjector = inject(EnvironmentInjector);

    private tasksRef = collection(this.firestore, 'tasks');

    getUserTasks(userId: string): Observable<Task[]> {
        const q = query(this.tasksRef, where('ownerId', '==', userId));
        return runInInjectionContext(this.envInjector, () =>
            collectionData(q, { idField: 'id' }) as Observable<Task[]>
        );
    }

    createTask(task: Task): Promise<void> {
        return runInInjectionContext(this.envInjector, () => {
            const taskDoc = doc(this.firestore, `tasks/${task.id}`);
            return setDoc(taskDoc, task).catch(error => {
                console.error('createTask error:', error);
                this.modal.error(error?.message || 'Failed to create task');
                throw error;
            });
        });
    }

    updateTask(taskId: string, data: Partial<Task>): Promise<void> {
        return runInInjectionContext(this.envInjector, () => {
            const taskDocRef = doc(this.firestore, `tasks/${taskId}`);
            return updateDoc(taskDocRef, data).catch(error => {
                console.error('updateTask error:', error);
                this.modal.error(error?.message || 'Failed to update task');
                throw error;
            });
        });
    }

    updateTaskTitle(taskId: string, newTitle: string): Promise<void> {
        return this.updateTask(taskId, { title: newTitle });
    }

    updateSubtaskStatus(
        taskId: string,
        subtaskIndex: number,
        done: boolean
    ): Promise<{
        updatedSubtasks: Subtask[];
        progress: number;
        completed: boolean;
    }> {
        return runInInjectionContext(this.envInjector, async () => {
            const taskDocRef = doc(this.firestore, `tasks/${taskId}`);
            const snapshot = await getDoc(taskDocRef);

            if (!snapshot.exists()) throw new Error('Task not found');

            const taskData = snapshot.data() as Task;
            const subtasks = [...taskData.subtasks];

            if (!subtasks[subtaskIndex]) throw new Error('Invalid subtask index');

            subtasks[subtaskIndex].done = done;

            const doneCount = subtasks.filter(s => s.done).length;
            const totalCount = subtasks.length;
            const progress = totalCount === 0 ? 0 : Math.round((doneCount / totalCount) * 100);
            const completed = doneCount === totalCount;

            await updateDoc(taskDocRef, { subtasks, progress, completed });

            return { updatedSubtasks: subtasks, progress, completed };
        });
    }

    addSubtask(taskId: string, text: string): Promise<void> {
        return runInInjectionContext(this.envInjector, async () => {
            const taskDocRef = doc(this.firestore, `tasks/${taskId}`);
            const snapshot = await getDoc(taskDocRef);

            if (!snapshot.exists()) throw new Error('Task not found');
            const task = snapshot.data() as Task;

            task.subtasks.push({ text, done: false });

            const progress = this.calculateProgress(task.subtasks);

            await updateDoc(taskDocRef, {
                subtasks: task.subtasks,
                progress,
            });
        });
    }

    deleteTask(taskId: string): Promise<void> {
        return runInInjectionContext(this.envInjector, () => {
            const taskDocRef = doc(this.firestore, `tasks/${taskId}`);
            return deleteDoc(taskDocRef).catch(err => {
                console.error('deleteTask error:', err);
                this.modal.error(err?.message || 'Failed to delete task');
                throw err;
            });
        });
    }

    private calculateProgress(subtasks: Subtask[]): number {
        const done = subtasks.filter(s => s.done).length;
        return subtasks.length === 0 ? 0 : Math.round((done / subtasks.length) * 100);
    }

    getTaskById(taskId: string): Promise<Task | null> {
        return runInInjectionContext(this.envInjector, async () => {
            const taskDocRef = doc(this.firestore, `tasks/${taskId}`);
            const snapshot = await getDoc(taskDocRef);
            if (!snapshot.exists()) return null;
            return snapshot.data() as Task;
        });
    }
}
