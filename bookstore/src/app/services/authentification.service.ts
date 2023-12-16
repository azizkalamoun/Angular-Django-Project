import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';

interface AuthResponse {
  token: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://127.0.0.1:8000/api';

  constructor(private http: HttpClient) {}

  signup(username: string, email: string, password: string): Observable<any> {
    const body = { username, email, password };
    return this.http.post(`${this.apiUrl}/register/`, body).pipe(
      tap((response) => {
        console.log('Signup successful:', response);
      }),
      catchError(this.handleError('Signup', []))
    );
  }

  login(username: string, password: string): Observable<AuthResponse> {
    const body = { username, password };
    return this.http.post<AuthResponse>(`${this.apiUrl}/login/`, body).pipe(
      tap((response) => {
        this.handleLoginSuccess(response.token);
        console.log('Login successful:', response);
      }),
      catchError(this.handleError<AuthResponse>('Login'))
    );
  }

  private handleLoginSuccess(token: string): void {
    localStorage.setItem('token', token);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  logout(): void {
    localStorage.removeItem('token');
  }

  getUsername(): Observable<string | null> {
    return this.http.get<{ username: string }>(`${this.apiUrl}/get-username/`).pipe(
      map(response => response.username),
      catchError((error) => {
        console.error('Error fetching username:', error);
        return of(null);
      })
    );
  }
  
  getUserId(): Observable<{ user_profile: string } | null> {
    return this.http.get<{ user_profile: string }>(`${this.apiUrl}/get-user-id/`).pipe(
      tap((userData) => {
        console.log('User data fetched successfully:', userData);
      }),
      catchError((error) => {
        console.error('Error fetching user data:', error);
        return of(null);
      })
    );
  }
  

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
}
