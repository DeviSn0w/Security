import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  jwtToken: string | null = null;
  username: string | null = null;
  last_name: string | null = null;
  first_name: string | null = null;
  role: string | null = null;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.loadUserDetails();
  }

  loadUserDetails(): void {
    this.jwtToken = localStorage.getItem('jwtToken');
    if (this.jwtToken) {
      try {
        const decodedToken: any = jwtDecode(this.jwtToken);
        this.username = decodedToken.username;
        this.first_name = decodedToken.first_name;
        this.last_name = decodedToken.last_name;
        this.role = decodedToken.role;


      } catch (error) {
        console.error('Error decoding JWT token:', error);
        this.logout();
      }
    }
  }

  logout(): void {
    localStorage.removeItem('jwtToken');
    this.jwtToken = null;
    this.username = null;
    this.first_name = null;
    this.last_name = null;
    this.role = null;

    this.router.navigate(['/']);
  }

}
