import { UserService } from 'src/app/Services/Shared/user.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.css']
})
export class SideBarComponent implements OnInit {

  constructor(private UserService: UserService) { }

  ngOnInit(): void {
  }

  isAdmin(): boolean {
    const userRole = this.UserService.getUserRole();
    return userRole === 'Administrator';
  }

}