import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  private pending = 0;
  readonly loading = signal(false);

  show(): void {
    this.pending += 1;
    this.loading.set(true);
  }

  hide(): void {
    this.pending = Math.max(0, this.pending - 1);
    if (this.pending === 0) {
      this.loading.set(false);
    }
  }
}
