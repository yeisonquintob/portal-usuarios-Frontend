// services/user.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:5223/api/user';

  constructor(private http: HttpClient) {}

  getProfile(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }

  updateProfile(id: number, userData: any): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${id}`, userData);
  }

  updateProfilePicture(id: number, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.put(`${this.apiUrl}/${id}/profile-picture`, formData);
  }

  getUsers(page: number = 1, pageSize: number = 10): Observable<any> {
    return this.http.get(`${this.apiUrl}?pageNumber=${page}&pageSize=${pageSize}`);
  }
}