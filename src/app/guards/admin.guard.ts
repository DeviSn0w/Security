import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { UserService } from '../Services/Shared/user.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(private UserService: UserService, private router: Router) {}

  canActivate(): boolean {
    // Check if user is logged in and has 'admin' role
    if (this.UserService.isLoggedIn() && this.UserService.getUserRole() === 'Administrator') {
      return true; // Allow access to the route
    } else {
      // Redirect to login page or display an error message
      this.router.navigate(['/Login']); // Adjust the route based on your application's routing setup
      return false; // Prevent access to the route
    }
  }
}
