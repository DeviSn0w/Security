import { UserService } from 'src/app/Services/Shared/user.service';
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';


@Injectable({
  providedIn: 'root'
})
export class authGuard implements CanActivate {

  constructor(private UserService: UserService, private router: Router) {}

  canActivate(): boolean {
    if (this.UserService.isLoggedIn()) {
      return true;
    } else {
      this.router.navigate(['/Login']);
      return false;
    }
  }

}