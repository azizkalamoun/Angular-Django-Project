import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/authentification.service';
import { ContactService } from '../services/contact.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
})
export class ContactComponent implements OnInit {
  subject: string = '';
  message: string = '';

  constructor(
    private contactService: ContactService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.authService.isLoggedIn()) {
      const userId = +this.authService.getUserId(); 
      this.contactService
        .submitContactForm(userId, this.subject, this.message)
        .subscribe((response) => {
          console.log(response);
        });
    } else {
      console.log('User is not logged in');
    }
  }
}
