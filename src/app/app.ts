import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

import { Header } from './shared/header/header';
import { Footer } from './shared/footer/footer';
import { LoaderService } from './core/services/loader.service';
import { Modal } from './shared/modal/modal';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, Header, Footer, Modal],
  templateUrl: './app.html',
  styleUrls: ['./app.css'],
})
export class App {
  constructor(public loader: LoaderService) { }
}
