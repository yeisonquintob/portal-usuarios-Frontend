// components/shared/navbar/navbar.component.ts
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service'; // Corregir ruta
import { TokenService } from '../../../services/token.service'; // Corregir ruta


@Component({
  selector: 'app-navbar',
  template: `
    <mat-toolbar color="primary" class="navbar">
      <div class="container">
        <span>Portal del usuario</span>
        <span class="spacer"></span>
        <ng-container *ngIf="isLoggedIn">
          <button mat-button (click)="logout()" class="logout-button">
            <mat-icon>exit_to_app</mat-icon>
            Cerrar sesión
          </button>
        </ng-container>
      </div>
    </mat-toolbar>
  `,
  styles: [`
    .navbar {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 1000;
      background-color: #3f51b5; /* Color Indigo de Material */
    }

    .container {
      display: flex;
      align-items: center;
      width: 100%;
      padding: 0 16px;
    }

    .spacer {
      flex: 1 1 auto;
    }

    .logout-button {
      display: flex;
      align-items: center;
      gap: 8px;
      color: white;
    }
  `]
})
export class NavbarComponent {
  constructor(
    private authService: AuthService,
    private tokenService: TokenService,
    private router: Router
  ) {}

  get isLoggedIn(): boolean {
    return this.authService.isAuthenticated();
  }

  get isAdmin(): boolean {
    const user = this.tokenService.getUser();
    return user?.role === 'Admin';
  }

  get userFullName(): string {
    const user = this.tokenService.getUser();
    return user ? `${user.firstName} ${user.lastName}` : '';
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}