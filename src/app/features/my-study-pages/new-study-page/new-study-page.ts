import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { StudyPagesService } from '../../../core/services/study-pages.service';
import { StudyPage, SyllabusItem } from '../../../models/study-page.model';

@Component({
  selector: 'app-new-study-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './new-study-page.html',
  styleUrl: './new-study-page.css'
})
export class NewStudyPage {
  title = signal('');
  subject = signal('');
  visibility = signal<'public' | 'private'>('private');
  notes = signal('');
  syllabus = signal<SyllabusItem[]>([]);
  newSyllabusItem = signal('');
  resources = signal<string[]>([]);
  newResource = signal('');
  successMessage = signal<string | null>(null);

  constructor(
    private router: Router,
    private studyPagesService: StudyPagesService
  ) { }

  addSyllabusItem() {
    const text = this.newSyllabusItem().trim();
    if (text) {
      const item: SyllabusItem = { text, done: false };
      this.syllabus.update(list => [...list, item]);
      this.newSyllabusItem.set('');
    }
  }

  removeSyllabusItem(index: number) {
    this.syllabus.update(list => list.filter((_, i) => i !== index));
  }

  toggleSyllabusItem(index: number) {
    this.syllabus.update(list =>
      list.map((item, i) =>
        i === index ? { ...item, done: !item.done } : item
      )
    );
  }

  addResource() {
    const res = this.newResource().trim();
    if (res) {
      this.resources.update(r => [...r, res]);
      this.newResource.set('');
    }
  }

  removeResource(index: number) {
    this.resources.update(r => r.filter((_, i) => i !== index));
  }

  clearForm() {
    this.title.set('');
    this.subject.set('');
    this.visibility.set('private');
    this.notes.set('');
    this.syllabus.set([]);
    this.newSyllabusItem.set('');
    this.resources.set([]);
    this.newResource.set('');
  }

  createStudyPage() {
    const title = this.title().trim();
    const subject = this.subject().trim();
    const notes = this.notes().trim();

    if (!title || !subject || !notes) {
      alert('Please fill in all required fields: Title, Subject, and Study Notes.');
      return;
    }

    const newPage: Omit<StudyPage, 'id' | 'ownerId'> = {
      title,
      subject,
      syllabus: this.syllabus(),
      isPublic: this.visibility() === 'public',
      createdAt: new Date().toISOString(),
      resources: this.resources(),
      notes,
      likesCount: 0
    };

    this.studyPagesService.addPage(newPage).then(() => {
      this.successMessage.set('✅ Study page created successfully!');
      setTimeout(() => this.successMessage.set(null), 3000);
      setTimeout(() => this.router.navigate(['/my-study-pages']), 3100);
    }).catch((err) => {
      console.error('Error creating page:', err);
      alert('Something went wrong while creating the study page.');
    });
  }

  goBackToMyPages() {
    this.router.navigate(['/my-study-pages']);
  }
}
