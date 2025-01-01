import { Injectable } from '@angular/core';
import { 
  CanActivate, 
  Router, 
  ActivatedRouteSnapshot, 
  RouterStateSnapshot, 
  UrlTree 
} from '@angular/router';
import { Observable } from 'rxjs';
import { TokenService } from '../services/token.service';
import { NotificationService } from '../services/notification.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(
    private tokenService: TokenService,
    private router: Router,
    private notificationService: NotificationService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const user = this.tokenService.getUser();

    // Verificar si el usuario existe y tiene rol de administrador
    if (user?.role === 'Admin') {
      return true;
    }

    // Si el usuario no es administrador, mostrar mensaje y redirigir
    this.notificationService.error('Acceso denegado. Se requieren privilegios de administrador.');
    this.router.navigate(['/profile'], {
      queryParams: { returnUrl: state.url }
    });
    return false;
  }
}