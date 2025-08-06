import {
  Component,
  Input,
  Output,
  EventEmitter
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Task, Subtask } from '../../../models/task.model';

@Component({
  selector: 'app-task-item',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './task-item.html',
  styleUrl: './task-item.css'
})
export class TaskItem {
  @Input() task!: Task;
  @Input() author: string = 'Anonymous';
  @Input() isLoggedIn: boolean = false;

  @Output() toggleSubtask = new EventEmitter<{ taskId: string; subtaskIndex: number }>();
  @Output() addSubtask = new EventEmitter<{ taskId: string; text: string }>();
  @Output() deleteTask = new EventEmitter<string>();
  @Output() edit = new EventEmitter<string>();

  newSubtaskText: string = '';

  getCalculatedProgress(): number {
    const total = this.task.subtasks.length;
    const done = this.task.subtasks.filter((s: Subtask) => s.done).length;
    return total === 0 ? 0 : Math.round((done / total) * 100);
  }

  onToggleSubtask(index: number) {
    this.toggleSubtask.emit({ taskId: this.task.id, subtaskIndex: index });
  }

  onAddSubtask() {
    const text = this.newSubtaskText.trim();
    if (text) {
      this.addSubtask.emit({ taskId: this.task.id, text });
      this.newSubtaskText = '';
    }
  }

  onDeleteTask() {
    this.deleteTask.emit(this.task.id);
  }

  onEditClick() {
    this.edit.emit(this.task.id);
  }
}
