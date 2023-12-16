// cart.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AuthService } from '../services/authentification.service';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private apiUrl = 'your_backend_api_url';

  constructor(private http: HttpClient, private authService: AuthService) { }

  getCart(): Observable<any> {
    return this.authService.getUserId().pipe(
      switchMap((userData) => {
        if (!userData || !userData.user_profile) {
          console.error('User profile data is missing.');
          return throwError('User profile data is missing.');
        }

        const userId = userData.user_profile;

        return this.http.get<any>(`${this.apiUrl}/cart/?user=${userId}`).pipe(
          catchError((error: any) => {
            console.error('Error fetching cart:', error);
            return throwError('Error fetching cart. Please check the details.');
          })
        );
      })
    );
  }
  addToCart(bookIds: number[]): Observable<any> {
    return this.authService.getUserId().pipe(
      switchMap((userData) => {
        if (!userData || !userData.user_profile) {
          console.error('User profile data is missing.', userData);
          return of({ success: false, message: 'User profile data is missing.' });
        }

        const userProfile = userData.user_profile;

        const payload = { user_profile: userProfile, books: bookIds };
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

        return this.http.post<any>(`${this.apiUrl}/create-cart/`, payload, { headers }).pipe(
          catchError((error: any) => {
            console.error('Error adding to cart:', error);
            return throwError('Error adding to cart. Please check the details.');
          })
        );
      })
    );
  }
}
