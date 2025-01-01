import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { TokenService } from './token.service';
import { ApiResponse } from '../interfaces/api-response';
import { AuthResponse } from '../interfaces/auth-response.interface';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/Auth`;

  constructor(
    private http: HttpClient,
    private tokenService: TokenService
  ) {}

  login(credentials: { username: string; password: string }): Observable<ApiResponse<AuthResponse>> {
    return this.http.post<ApiResponse<AuthResponse>>(`${this.apiUrl}/login`, credentials)
      .pipe(
        tap(response => {
          if (response.isSuccess && response.data) {
            this.tokenService.saveToken(response.data.accessToken);
            this.tokenService.saveUser(response.data.user);
          }
        }),
        catchError(this.handleError)
      );
  }

  register(registerData: {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
    firstName: string;
    lastName: string;
  }): Observable<ApiResponse<AuthResponse>> {
    return this.http.post<ApiResponse<AuthResponse>>(
      `${this.apiUrl}/register`,
      registerData
    ).pipe(
      catchError(this.handleError)
    );
  }

  logout(): void {
    this.tokenService.clearStorage();
  }

  isAuthenticated(): boolean {
    return this.tokenService.isValidToken();
  }

  refreshToken(token: string): Observable<ApiResponse<AuthResponse>> {
    return this.http.post<ApiResponse<AuthResponse>>(
      `${this.apiUrl}/refresh-token`,
      { token }
    ).pipe(
      tap(response => {
        if (response.isSuccess && response.data) {
          this.tokenService.saveToken(response.data.accessToken);
        }
      }),
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Ocurrió un error en el servidor';
    
    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente
      errorMessage = error.error.message;
    } else if (error.error?.message) {
      // Error del lado del servidor con mensaje
      errorMessage = error.error.message;
    } else if (error.status === 401) {
      errorMessage = 'Usuario o contraseña incorrectos';
    }

    console.error('Error en AuthService:', error);
    return throwError(() => new Error(errorMessage));
  }
}