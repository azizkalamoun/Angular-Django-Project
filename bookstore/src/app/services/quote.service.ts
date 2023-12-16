import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class QuoteService {
  private apiUrl = 'http://127.0.0.1:8000/api/quotes/'; 
  constructor(private http: HttpClient) {}

  getRandomQuote(): Observable<string> {
    return this.http.get<string>(`${this.apiUrl}random/`);
  }
}
