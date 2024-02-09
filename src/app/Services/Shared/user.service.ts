import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl = 'http://localhost:3000'; // Update with your backend base URL

  constructor(private http: HttpClient) { }

  // Method to register a new user
  registerUser(userData: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/register`, userData);
  }

  loginUser(credentials: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/login`, credentials);
  }

  isLoggedIn(): boolean {
    // Check if there is a token stored in local storage
    const token = localStorage.getItem('jwtToken');
    return !!token; // If token exists, user is logged in
  }

  getUserRole(): string | null {
    const token = localStorage.getItem('jwtToken');
    if (token) {
      const decodedToken: any = jwtDecode(token);
      return decodedToken.role;
    }
    return null;
  }

  getAllUsers(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/users`);
  }

}