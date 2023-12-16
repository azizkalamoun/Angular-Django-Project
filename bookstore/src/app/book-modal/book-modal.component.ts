// book-modal.component.ts
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CartService } from '../services/cart.service';

@Component({
  selector: 'app-book-modal',
  templateUrl: './book-modal.component.html',
  styleUrls: ['./book-modal.component.scss'],
})
export class BookModalComponent {
  constructor(
    public dialogRef: MatDialogRef<BookModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { book: any },
    private cartService: CartService
  ) {}

  addToCart(): void {
    const bookIds = [this.data.book.id];

    console.log('Adding to cart. Book IDs:', bookIds);

    // Update cart items in the frontend without making a request to the backend
    this.cartService.addToCart(bookIds);

    console.log(`Book with ID ${this.data.book.id} added to the cart!`);
  }

  onClose(): void {
    this.dialogRef.close();
  }
}
