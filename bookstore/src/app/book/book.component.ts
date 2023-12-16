import { Component, OnInit, ViewChild} from '@angular/core';
import { BookService } from '../services/book.service';
import { MatPaginator, MatPaginatorIntl,PageEvent } from '@angular/material/paginator';
import { BookModalComponent } from '../book-modal/book-modal.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.scss']
})
export class BookComponent implements OnInit {
  randomQuote: string = '';
  books: any[] = [];
  pageSize: number = 20;
  currentPage: number = 1;
  totalBooks: number = 0;
  searchTerm: string = '';
  selectedCategory: string | null = null;
  categories: string[] = [];
  selectedBook: any;
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;

  constructor(
    private bookService: BookService,
    private dialog: MatDialog,
    private customPaginatorIntl: MatPaginatorIntl 
  ) {
    this.customPaginatorIntl.itemsPerPageLabel = 'Books per  Page';
  }
  ngOnInit(): void {
    this.totalBooks = 0; 
    this.loadBooks();
    this.loadCategories();
  }
  
  loadCategories(): void {
    this.bookService.getCategories().subscribe(
      (response: any[]) => {
        console.log(response);
        this.categories = response.map(category => category.name);
      },
      (error) => {
        console.error('Error fetching categories:', error);
      }
    );
  }

  loadBooks(): void {
    this.bookService
      .getBooks(
        this.currentPage,
        this.pageSize,
        this.searchTerm,
        this.selectedCategory
      )
      .subscribe((response: any) => {
        console.log(response.results);
        this.books = response.results;
        this.totalBooks = response.count;
        console.log("total : "+response.count);
      });
  }
  
  onPageChange(event: PageEvent): void {
    console.log('Page changed to:', event.pageIndex + 1);
    this.currentPage = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.loadBooks();
  }
  

  onSearch(): void {
    this.currentPage = 1;
    this.loadBooks();
  }

  onCategoryChange(event: Event): void {
    const category = (event.target as HTMLSelectElement)?.value;
    this.currentPage = 1;
    this.selectedCategory = category;
    this.loadBooks();
  }
  openModal(book: any): void {
    this.selectedBook = book;

    const dialogRef = this.dialog.open(BookModalComponent, {
      data: { book }
    });

    dialogRef.afterClosed().subscribe(() => {
    });
  }
  resetPage(): void {
    window.location.reload();
  }
}
