import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { TaskService } from '../../../core/services/task.service';
import { AuthService } from '../../../core/services/auth.service';
import { Task, Subtask } from '../../../models/task.model';
import { Timestamp } from '@angular/fire/firestore';
import { LoaderService } from '../../../core/services/loader.service';
import { ModalService } from '../../../core/services/modal.service';

@Component({
  selector: 'app-new-task',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './new-task.html',
  styleUrls: ['./new-task.css'],
})
export class NewTask {
  private taskService = inject(TaskService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private loader = inject(LoaderService);
  private modal = inject(ModalService);

  titleValue = '';
  subjectValue = '';
  priorityValue: 'low' | 'medium' | 'high' = 'medium';
  dueValue = this.getTodayDate();
  newSubtaskValue = '';
  subtasks: Subtask[] = [];

  getTodayDate(): string {
    return new Date().toISOString().split('T')[0];
  }

  addSubtask() {
    const text = this.newSubtaskValue.trim();
    if (!text) return;
    this.subtasks.push({ text, done: false });
    this.newSubtaskValue = '';
  }

  removeSubtask(index: number) {
    this.subtasks = this.subtasks.filter((_, i) => i !== index);
  }

  clearForm() {
    this.titleValue = '';
    this.subjectValue = '';
    this.priorityValue = 'medium';
    this.dueValue = this.getTodayDate();
    this.newSubtaskValue = '';
    this.subtasks = [];
  }

  async createTask() {
    const user = this.authService.currentUser?.();
    if (!user) {
      this.modal.error('You must be logged in to create a task.');
      return;
    }

    if (!this.titleValue.trim() || !this.subjectValue.trim()) {
      this.modal.error('Please fill in all required fields.');
      return;
    }

    const doneCount = this.subtasks.filter(s => s.done).length;
    const progress = this.subtasks.length
      ? Math.round((doneCount / this.subtasks.length) * 100)
      : 0;
    const completed = progress === 100;

    const task: Task = {
      id: crypto.randomUUID(),
      title: this.titleValue.trim(),
      subject: this.subjectValue.trim(),
      priority: this.priorityValue,
      due: Timestamp.fromDate(new Date(this.dueValue)),
      subtasks: [...this.subtasks],
      progress,
      completed,
      ownerId: user.id,
    };

    this.loader.show();

    try {
      await this.taskService.createTask(task);

      this.modal.success('Task created successfully!');

      await this.router.navigate(['/tasks']);
      this.loader.hide();
    } catch {
      this.loader.hide();
      this.modal.error('Failed to create task.');
    }
  }
}
