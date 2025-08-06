import { Component, computed, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { TaskService } from '../../core/services/task.service';
import { AuthService, User } from '../../core/services/auth.service';
import { ErrorService } from '../../core/services/error.service';
import { Task } from '../../models/task.model';
import { TaskItem } from './task-item/task-item';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, TaskItem],
  templateUrl: './tasks.html',
  styleUrl: './tasks.css'
})
export class Tasks {
  private taskService = inject(TaskService);
  private authService = inject(AuthService);
  private errorService = inject(ErrorService);
  private router = inject(Router);

  tasks = signal<Task[]>([]);
  users = signal<User[]>([]);
  visibleCount = signal(5);
  isLoggedIn = this.authService.isLoggedIn;
  errorMessage = this.errorService.message;

  private _searchQuery = signal('');
  private _selectedSubject = signal('All Subjects');
  private _selectedPriority = signal('All Priorities');

  searchQueryValue = '';
  selectedSubjectValue = 'All Subjects';
  selectedPriorityValue = 'All Priorities';

  constructor() {
    effect(() => {
      const user = this.authService.currentUser();
      if (!user) return;

      this.taskService.getUserTasks(user.id).subscribe({
        next: taskList => this.tasks.set(taskList),
        error: () => this.errorService.show('Failed to load tasks')
      });
    });


    this.authService.getAllUsers().subscribe({
      next: userList => this.users.set(userList),
      error: () => this.errorService.show('Failed to load users')
    });

    effect(() => this.searchQueryValue = this._searchQuery());
    effect(() => this.selectedSubjectValue = this._selectedSubject());
    effect(() => this.selectedPriorityValue = this._selectedPriority());
  }

  updateSearchQuery(value: string) {
    this._searchQuery.set(value);
  }

  updateSelectedSubject(value: string) {
    this._selectedSubject.set(value);
  }

  updateSelectedPriority(value: string) {
    this._selectedPriority.set(value);
  }

  getAuthorName(ownerId: string): string {
    const user = this.users().find(u => u.id === ownerId);
    return user?.username ?? 'Anonymous';
  }

  getSubjects(): string[] {
    const subjects = new Set(this.tasks().map(t => t.subject));
    return ['All Subjects', ...Array.from(subjects)];
  }

  getPriorities(): string[] {
    return ['All Priorities', 'low', 'medium', 'high'];
  }

  loadMore() {
    this.visibleCount.update(count => count + 5);
  }

  handleToggleSubtask(event: { taskId: string; subtaskIndex: number }) {
    const currentUserId = this.authService.getCurrentUserId();
    const currentTasks = this.tasks();
    const taskIndex = currentTasks.findIndex(t => t.id === event.taskId);
    if (taskIndex === -1) return;

    const task = currentTasks[taskIndex];
    if (task.ownerId !== currentUserId) {
      this.errorService.show('You are not authorized to update this task.');
      return;
    }

    const currentStatus = task.subtasks[event.subtaskIndex]?.done ?? false;

    this.taskService
      .updateSubtaskStatus(event.taskId, event.subtaskIndex, !currentStatus)
      .then(({ updatedSubtasks, completed, progress }) => {
        const updatedTasks = [...currentTasks];
        updatedTasks[taskIndex] = {
          ...task,
          subtasks: updatedSubtasks,
          completed,
          progress
        };
        this.tasks.set(updatedTasks);
      });
  }


  onDeleteTask(taskId: string) {
    const currentUserId = this.authService.getCurrentUserId();
    const task = this.tasks().find(t => t.id === taskId);

    if (!task || task.ownerId !== currentUserId) {
      this.errorService.show('You are not authorized to delete this task.');
      return;
    }

    if (confirm('Are you sure you want to delete this task?')) {
      this.taskService.deleteTask(taskId)
        .then(() => {
          this.tasks.update(tasks => tasks.filter(t => t.id !== taskId));
        })
        .catch(() => {
          this.errorService.show('Failed to delete task');
        });
    }
  }


  onEditTask(taskId: string) {
    const currentUserId = this.authService.getCurrentUserId();
    const task = this.tasks().find(t => t.id === taskId);

    if (!task || task.ownerId !== currentUserId) {
      this.errorService.show('You are not authorized to edit this task.');
      return;
    }

    this.router.navigate([`/tasks/edit/${taskId}`]);
  }


  onAddSubtask(event: { taskId: string; text: string }) {
    const currentUserId = this.authService.getCurrentUserId();
    const task = this.tasks().find(t => t.id === event.taskId);

    if (!task || task.ownerId !== currentUserId) {
      this.errorService.show('You are not authorized to modify this task.');
      return;
    }

    this.taskService.addSubtask(event.taskId, event.text);
  }


  onCreateNewTask() {
    this.router.navigate(['/tasks/new']);
  }

  filteredTasks = computed(() => {
    return this.tasks()
      .filter(task =>
        this._selectedSubject() === 'All Subjects' || task.subject === this._selectedSubject())
      .filter(task =>
        this._selectedPriority() === 'All Priorities' || task.priority === this._selectedPriority())
      .filter(task =>
        task.title.toLowerCase().includes(this._searchQuery().toLowerCase()))
      .slice(0, this.visibleCount());
  });

  showLoadMore = computed(() => {
    const filtered = this.tasks()
      .filter(task =>
        this._selectedSubject() === 'All Subjects' || task.subject === this._selectedSubject())
      .filter(task =>
        this._selectedPriority() === 'All Priorities' || task.priority === this._selectedPriority())
      .filter(task =>
        task.title.toLowerCase().includes(this._searchQuery().toLowerCase()));

    return filtered.length > 4 && filtered.length > this.visibleCount();
  });
}
