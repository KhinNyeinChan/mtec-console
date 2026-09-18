import { Injectable, signal } from '@angular/core';

export type NotificationLevel = 'success' | 'error' | 'info';

export interface AppNotification {
  level: NotificationLevel;
  message: string;
}

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private readonly _notification = signal<AppNotification | null>(null);

  readonly notification = this._notification.asReadonly();

  success(message: string): void {
    this._notification.set({ level: 'success', message });
  }

  error(message: string): void {
    this._notification.set({ level: 'error', message });
  }

  info(message: string): void {
    this._notification.set({ level: 'info', message });
  }

  clear(): void {
    this._notification.set(null);
  }
}
