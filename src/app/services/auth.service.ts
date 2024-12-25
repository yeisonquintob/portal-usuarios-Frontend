// services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuthResponse } from '../interfaces/auth-response';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:5223/api/auth';

  constructor(
    private http: HttpClient,
    private tokenService: TokenService
  ) {}

  login(credentials: {username: string, password: string}): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials)
      .pipe(tap(response => {
        this.tokenService.saveToken(response.accessToken);
        this.tokenService.saveUser(response.user);
      }));
  }

  register(userData: any): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, userData);
  }

  logout(): void {
    this.tokenService.clearStorage();
  }

  isAuthenticated(): boolean {
    return this.tokenService.isValidToken();
  }
}