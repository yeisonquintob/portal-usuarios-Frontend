// components/shared/navbar/navbar.component.ts
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { TokenService } from '../../../services/token.service';

// components/shared/navbar/navbar.component.ts
@Component({
  selector: 'app-navbar',
  template: `
    <mat-toolbar color="primary" class="navbar">
      <div class="container">
        <span>Portal del usuario</span>
        <span class="spacer"></span>
        <ng-container *ngIf="isLoggedIn">
          <a mat-button class="nav-button" routerLink="/profile" routerLinkActive="active">
            <mat-icon>person</mat-icon>
            Mi perfil
          </a>
          <ng-container *ngIf="isAdmin">
            <a mat-button class="nav-button" routerLink="/admin/users" routerLinkActive="active">
              <mat-icon>group</mat-icon>
              Gestión Usuarios
            </a>
          </ng-container>
          <button mat-button class="nav-button" (click)="logout()">
            <mat-icon>exit_to_app</mat-icon>
            Cerrar sesión
          </button>
        </ng-container>
      </div>
    </mat-toolbar>
  `
})
export class NavbarComponent {
  constructor(
    private authService: AuthService,
    private tokenService: TokenService,
    private router: Router
  ) {}

  get isLoggedIn(): boolean {
    return this.tokenService.isAuthenticated();
  }

  get isAdmin(): boolean {
    const user = this.tokenService.getUser();
    return user ? user.role === 'Admin' : false;
  }

  logout(): void {
    this.tokenService.clearStorage();
    this.router.navigate(['/login']);
  }
}