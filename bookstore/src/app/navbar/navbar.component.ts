import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/authentification.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  username: string | null = null;

  constructor(public authService: AuthService) {
    this.authService.getUsername().subscribe((username) => {
      this.username = username;
      console.log(this.username);
    });
  }

  ngOnInit(): void {

  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }
}
