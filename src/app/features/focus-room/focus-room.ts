import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { quotes } from '../../data/quotes';

@Component({
  selector: 'app-focus-room',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './focus-room.html',
  styleUrls: ['./focus-room.css']
})
export class FocusRoom {
  // Timer States
  timeLeft = signal(25 * 60);
  timerRunning = signal(false);
  intervalId: any = null;

  // Session Modes
  modes = [
    { label: 'Focus Time', minutes: 25 },
    { label: 'Short Break', minutes: 5 },
    { label: 'Long Break', minutes: 15 }
  ];
  selectedMode = signal(this.modes[0]);

  // Ambient Sounds
  sounds = ['Rain', 'Forest', 'Jazz Café', 'Ocean'];
  selectedSound = signal('');
  volume = signal(50);
  private audioPlayer: HTMLAudioElement | null = null;

  // Daily quote based on day of year
  get dailyQuote(): string {
    const today = new Date();
    const dayOfYear = this.getDayOfYear(today);
    return quotes[dayOfYear % quotes.length];
  }

  private getDayOfYear(date: Date): number {
    const start = new Date(date.getFullYear(), 0, 0);
    const diff =
      date.getTime() -
      start.getTime() +
      (start.getTimezoneOffset() - date.getTimezoneOffset()) * 60 * 1000;
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  }

  get formattedTime(): string {
    const minutes = Math.floor(this.timeLeft() / 60);
    const seconds = this.timeLeft() % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds
      .toString()
      .padStart(2, '0')}`;
  }

  selectMode(mode: any) {
    this.selectedMode.set(mode);
    this.resetTimer();
  }

  toggleTimer() {
    if (this.timerRunning()) {
      this.pauseTimer();
    } else {
      this.startTimer();
    }
  }

  startTimer() {
    this.timerRunning.set(true);
    this.intervalId = setInterval(() => {
      if (this.timeLeft() > 0) {
        this.timeLeft.update((time) => time - 1);
      } else {
        this.pauseTimer();
      }
    }, 1000);
  }

  pauseTimer() {
    this.timerRunning.set(false);
    clearInterval(this.intervalId);
  }

  resetTimer() {
    this.pauseTimer();
    this.timeLeft.set(this.selectedMode().minutes * 60);
  }

  selectSound(sound: string) {
    const currentlyPlaying = this.selectedSound();

    if (currentlyPlaying === sound) {
      this.stopSound();
      return;
    }

    this.selectedSound.set(sound);

    const filename = sound.toLowerCase().replace('é', 'e').replace(/\s+/g, '-');
    const path = `assets/sounds/${filename}.mp3`;

    if (this.audioPlayer) {
      this.audioPlayer.pause();
      this.audioPlayer.currentTime = 0;
    }

    this.audioPlayer = new Audio(path);
    this.audioPlayer.loop = true;
    this.audioPlayer.volume = this.volume() / 100;

    this.audioPlayer.play().catch((err) => {
      console.error('Audio play error:', err);
    });
  }

  stopSound() {
    if (this.audioPlayer) {
      this.audioPlayer.pause();
      this.audioPlayer.currentTime = 0;
      this.audioPlayer = null;
    }
    this.selectedSound.set('');
  }

  setVolume(event: Event) {
    const input = event.target as HTMLInputElement;
    const vol = +input.value;
    this.volume.set(vol);

    if (this.audioPlayer) {
      this.audioPlayer.volume = vol / 100;
    }
  }
}
