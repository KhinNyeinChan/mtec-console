import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';
import { AdminHeader } from '../admin-header/admin-header';
import { AdminSidebar } from '../admin-sidebar/admin-sidebar';

@Component({
  selector: 'app-admin-shell',
  standalone: true,
  imports: [RouterOutlet, AdminSidebar, AdminHeader],
  templateUrl: './admin-shell.html',
  styleUrl: './admin-shell.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminShell {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  onLogout(): void {
    this.auth.logout().subscribe({
      next: () => void this.router.navigateByUrl('/auth/login'),
      error: () => void this.router.navigateByUrl('/auth/login'),
    });
  }
}
