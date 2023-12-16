// category.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private apiUrl = 'http://127.0.0.1:8000/api/categories/';

  constructor(private http: HttpClient) {}

  getCategories(): Observable<any> {
    return this.http.get(this.apiUrl);
  }
}
