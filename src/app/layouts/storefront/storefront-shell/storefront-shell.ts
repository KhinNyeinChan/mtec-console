import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';
import { StorefrontHeader } from '../storefront-header/storefront-header';
import { StorefrontSidebar } from '../storefront-sidebar/storefront-sidebar';

@Component({
  selector: 'app-storefront-shell',
  standalone: true,
  imports: [RouterOutlet, StorefrontSidebar, StorefrontHeader],
  templateUrl: './storefront-shell.html',
  styleUrl: './storefront-shell.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StorefrontShell {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  onLogout(): void {
    this.auth.logout().subscribe({
      next: () => void this.router.navigateByUrl('/auth/login'),
      error: () => void this.router.navigateByUrl('/auth/login'),
    });
  }
}
