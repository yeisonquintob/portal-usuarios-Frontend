// guards/admin.guard.ts
import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { TokenService } from '../services/token.service';

@Injectable({ providedIn: 'root' })
export class AdminGuard implements CanActivate {
  constructor(private tokenService: TokenService, private router: Router) {}

  canActivate(): boolean {
    const user = this.tokenService.getUser();
    if (user?.role === 'Admin') {
      return true;
    }
    
    this.router.navigate(['/profile']);
    return false;
  }
}