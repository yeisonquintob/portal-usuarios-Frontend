// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { TokenService } from './token.service';
import { ApiResponse } from '../interfaces/api-response';
import { AuthResponse } from '../interfaces/auth-response.interface';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;

  constructor(
    private http: HttpClient,
    private tokenService: TokenService
  ) {}

  login(credentials: {username: string; password: string}): Observable<ApiResponse<AuthResponse>> {
    return this.http.post<ApiResponse<AuthResponse>>(`${this.apiUrl}/login`, credentials)
      .pipe(
        tap(response => {
          if (response.isSuccess && response.data) {
            this.tokenService.saveToken(response.data.accessToken);
            this.tokenService.saveUser(response.data.user);
          }
        })
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
    return this.http.post<ApiResponse<AuthResponse>>(`${this.apiUrl}/register`, registerData);
  }

  logout(): void {
    this.tokenService.clearStorage();
  }

  isAuthenticated(): boolean {
    return this.tokenService.isValidToken();
  }

  refreshToken(token: string): Observable<ApiResponse<AuthResponse>> {
    return this.http.post<ApiResponse<AuthResponse>>(`${this.apiUrl}/refresh-token`, { token })
      .pipe(
        tap(response => {
          if (response.isSuccess && response.data) {
            this.tokenService.saveToken(response.data.accessToken);
          }
        })
      );
  }
}
