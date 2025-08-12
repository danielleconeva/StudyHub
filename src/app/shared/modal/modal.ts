import { Component, inject, HostListener } from '@angular/core';
import { NgIf, NgClass } from '@angular/common';
import { ModalService } from '../../core/services/modal.service';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [NgIf, NgClass],
  templateUrl: './modal.html',
  styleUrls: ['./modal.css']
})
export class Modal {
  modal = inject(ModalService);

  onBackdropClick() {
    if (!this.modal.state()?.autoClose) this.modal.close(false);
  }

  @HostListener('document:keydown.escape')
  onEsc() {
    if (!this.modal.state()?.autoClose) this.modal.close(false);
  }
}
