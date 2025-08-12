import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { StudyPagesService } from '../../../core/services/study-pages.service';
import { AuthService } from '../../../core/services/auth.service';
import { StudyPage, SyllabusItem } from '../../../models/study-page.model';
import { LoaderService } from '../../../core/services/loader.service';

@Component({
  selector: 'app-edit-study-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-study-page.html',
  styleUrl: './edit-study-page.css'
})
export class EditStudyPage implements OnInit {
  private studyPagesService = inject(StudyPagesService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private authService = inject(AuthService);
  private loader = inject(LoaderService);

  pageId = signal<string | null>(null);

  title = signal('');
  subject = signal('');
  visibility = signal<'public' | 'private'>('private');
  notes = signal('');
  syllabus = signal<SyllabusItem[]>([]);
  newSyllabusItem = signal('');
  resources = signal<string[]>([]);
  newResource = signal('');
  successMessage = signal<string | null>(null);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      alert('Invalid page ID');
      this.router.navigate(['/my-study-pages']);
      return;
    }

    this.pageId.set(id);

    this.studyPagesService.getPageById(id).then((page) => {
      if (!page) {
        alert('Page not found');
        this.router.navigate(['/my-study-pages']);
        return;
      }

      const currentUserId = this.authService.getCurrentUserId();

      if (!currentUserId || page.ownerId !== currentUserId) {
        alert('You are not authorized to edit this page.');
        this.router.navigate(['/not-found']);
        return;
      }

      this.title.set(page.title);
      this.subject.set(page.subject);
      this.visibility.set(page.isPublic ? 'public' : 'private');
      this.notes.set(page.notes);
      this.syllabus.set(page.syllabus || []);
      this.resources.set((page.resources || []).map(r => r.toString()));
    });
  }

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

  async updateStudyPage() {
    const title = this.title().trim();
    const subject = this.subject().trim();
    const notes = this.notes().trim();
    const id = this.pageId();

    if (!title || !subject || !notes || !id) {
      alert('Please fill in all required fields.');
      return;
    }

    const updatedPage: Partial<StudyPage> = {
      title,
      subject,
      syllabus: this.syllabus(),
      isPublic: this.visibility() === 'public',
      notes,
      resources: this.resources(),
    };

    this.loader.show();

    try {
      await this.studyPagesService.updateStudyPage(id, updatedPage);
      this.router.navigate(['/my-study-pages']);
    } catch (err) {
      console.error('Update error:', err);
      alert('Something went wrong while updating the study page.');
    } finally {
      this.loader.hide();
    }
  }

  goBackToMyPages() {
    this.router.navigate(['/my-study-pages']);
  }
}
