import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { TokenService } from '../../../services/token.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
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