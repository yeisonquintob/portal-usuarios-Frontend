import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { User } from '../interfaces/user.interface';
import { ApiResponse } from '../interfaces/api-response';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = `${environment.apiUrl}/User`;

  constructor(private http: HttpClient) {}

  getProfile(userId: number): Observable<User> {
    return this.http.get<ApiResponse<User>>(`${this.apiUrl}/${userId}`).pipe(
      map(response => {
        if (!response.isSuccess || !response.data) {
          throw new Error(response.message || 'Error obteniendo perfil');
        }
        return response.data;
      }),
      catchError(this.handleError)
    );
  }

  updateProfile(userId: number, userData: Partial<User>): Observable<User> {
    return this.http.put<ApiResponse<User>>(`${this.apiUrl}/${userId}`, userData).pipe(
      map(response => {
        if (!response.isSuccess || !response.data) {
          throw new Error(response.message || 'Error actualizando perfil');
        }
        return response.data;
      }),
      catchError(this.handleError)
    );
  }

  updateProfilePicture(userId: number, file: File): Observable<{ profilePicture: string }> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.put<ApiResponse<{ profilePicture: string }>>(
      `${this.apiUrl}/${userId}/profile-picture`, 
      formData
    ).pipe(
      map(response => {
        if (!response.isSuccess || !response.data) {
          throw new Error(response.message || 'Error actualizando foto de perfil');
        }
        return response.data;
      }),
      catchError(this.handleError)
    );
  }

  getAllUsers(pageIndex: number = 0, pageSize: number = 10): Observable<{ items: User[], totalItems: number }> {
    const params = new HttpParams()
      .set('pageNumber', (pageIndex + 1).toString())
      .set('pageSize', pageSize.toString());

    return this.http.get<any>(this.apiUrl, { params }).pipe(
      map(response => {
        // Adaptamos la respuesta a un formato manejable por el componente
        return {
          items: response.data?.items || [],
          totalItems: response.data?.totalItems || 0
        };
      }),
      catchError(this.handleError)
    );
  }

  searchUsers(searchTerm: string, pageIndex: number = 0, pageSize: number = 10): Observable<{ items: User[], totalItems: number }> {
    const params = new HttpParams()
      .set('searchTerm', searchTerm)
      .set('pageNumber', (pageIndex + 1).toString())
      .set('pageSize', pageSize.toString());

    return this.http.get<any>(`${this.apiUrl}/search`, { params }).pipe(
      map(response => {
        // Adaptamos la respuesta a un formato manejable por el componente
        return {
          items: response.data?.items || [],
          totalItems: response.data?.totalItems || 0
        };
      }),
      catchError(this.handleError)
    );
  }

  toggleUserStatus(userId: number): Observable<void> {
    return this.http.post<ApiResponse<void>>(`${this.apiUrl}/${userId}/toggle-status`, {}).pipe(
      map(response => {
        if (!response.isSuccess) {
          throw new Error(response.message || 'Error actualizando estado');
        }
      }),
      catchError(this.handleError)
    );
  }

  deleteUser(userId: number): Observable<void> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${userId}`).pipe(
      map(response => {
        if (!response.isSuccess) {
          throw new Error(response.message || 'Error eliminando usuario');
        }
      }),
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Ocurrió un error en el servidor';
    
    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else if (error.error?.message) {
      errorMessage = error.error.message;
    }

    console.error('Error en UserService:', error);
    return throwError(() => new Error(errorMessage));
  }
}