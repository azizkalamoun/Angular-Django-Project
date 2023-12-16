import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BookService {
  private apiUrl = 'http://127.0.0.1:8000/api/books/';
  private categoriesUrl = 'http://127.0.0.1:8000/api/categories/';

  constructor(private http: HttpClient) {}

  getCategories(): Observable<string[]> {
    return this.http.get<string[]>(this.categoriesUrl);
  }

  getBooks(
    page: number,
    pageSize: number,
    searchTerm: string,
    selectedCategory: string | null
  ): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString()) 
      .set('pageSize', pageSize.toString());

    if (searchTerm) {
      params = params.set('searchTerm', searchTerm);
    }

    if (selectedCategory) {
      params = params.set('category', selectedCategory);
    }

    return this.http.get<any>(this.apiUrl, { params });
  }
}
