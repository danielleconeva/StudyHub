import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';

import { TaskService } from '../../../core/services/task.service';
import { AuthService } from '../../../core/services/auth.service';
import { ErrorService } from '../../../core/services/error.service';

import { Task, Subtask } from '../../../models/task.model';
import { Timestamp } from '@angular/fire/firestore';

@Component({
  selector: 'app-edit-task',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './edit-task.html',
  styleUrl: './edit-task.css'
})
export class EditTask implements OnInit {

  private taskService = inject(TaskService);
  private authService = inject(AuthService);
  private errorService = inject(ErrorService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);


  taskId = '';
  titleValue = '';
  subjectValue = '';
  priorityValue: 'low' | 'medium' | 'high' = 'medium';
  dueValue = this.getTodayDate();
  newSubtaskValue = '';
  subtasks: Subtask[] = [];


  successMessage = signal<string | null>(null);


  getTodayDate(): string {
    return new Date().toISOString().split('T')[0];
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.errorService.show?.('Invalid task ID.');
      this.router.navigate(['/tasks']);
      return;
    }

    this.taskId = id;

    this.taskService.getTaskById(id).then((task: Task | null) => {
      if (!task) {
        this.errorService.show?.('Task not found.');
        this.router.navigate(['/tasks']);
        return;
      }


      this.titleValue = task.title;
      this.subjectValue = task.subject;
      this.priorityValue = task.priority;
      this.dueValue = task.due.toDate().toISOString().split('T')[0];
      this.subtasks = [...task.subtasks];
    }).catch(() => {
      this.errorService.show?.('Failed to load task.');
      this.router.navigate(['/tasks']);
    });
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

  updateTask() {
    const user = this.authService.currentUser?.();
    if (!user) {
      this.errorService.show?.('You must be logged in to update a task.');
      return;
    }

    if (!this.titleValue.trim() || !this.subjectValue.trim()) {
      this.errorService.show?.('Please fill in all required fields.');
      return;
    }

    const doneCount = this.subtasks.filter(s => s.done).length;
    const progress = this.subtasks.length
      ? Math.round((doneCount / this.subtasks.length) * 100)
      : 0;
    const completed = progress === 100;

    const updatedTask: Partial<Task> = {
      title: this.titleValue.trim(),
      subject: this.subjectValue.trim(),
      priority: this.priorityValue,
      due: Timestamp.fromDate(new Date(this.dueValue)),
      subtasks: [...this.subtasks],
      progress,
      completed,
    };

    this.taskService.updateTask(this.taskId, updatedTask)
      .then(() => {
        this.successMessage.set('Task updated successfully!');
        setTimeout(() => this.successMessage.set(null), 3000);
        setTimeout(() => this.router.navigate(['/tasks']), 3100);
      })
      .catch(() => this.errorService.show?.('Failed to update task.'));
  }
  goBackToTasks() {
    this.router.navigate(['/tasks']);
  }

}
