import { computed, Injectable, signal } from '@angular/core';
import { UserRole } from '../constants/roles';
import { User } from './auth.model';

@Injectable({
  providedIn: 'root',
})
export class AuthStore {
  private readonly _user = signal<User | null>(null);

  readonly user = this._user.asReadonly();
  readonly isAuthenticated = computed(() => this._user() !== null);

  setUser(user: User): void {
    this._user.set(user);
  }

  clear(): void {
    this._user.set(null);
  }

  hasRole(...roles: string[]): boolean {
    const userRoles = this._user()?.roles ?? [];
    return roles.some((role) => userRoles.includes(role as UserRole));
  }
}
