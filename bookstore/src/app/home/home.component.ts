import { Component, OnInit } from '@angular/core';
import { QuoteService } from '../services/quote.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  randomQuote: string=' ' ;

  constructor(private quoteService: QuoteService) {}

  ngOnInit(): void {
    this.getAndDisplayRandomQuote();
  }

  getAndDisplayRandomQuote(): void {
    this.quoteService.getRandomQuote().subscribe(
      (response: any) => {
        this.randomQuote = response.quote;
      },
      (error) => {
        console.error('Error fetching random quote:', error);
      }
    );
  }
}
