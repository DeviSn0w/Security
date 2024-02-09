import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/Services/Shared/user.service';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.css']
})
export class UsersListComponent implements OnInit {
  users: any[] = [];

  constructor(private UserService: UserService) { }

  ngOnInit(): void {
    this.UserService.getAllUsers().subscribe(
      (response: any) => {
        if (response && response.users) {
          // Filter out the admin user
          this.users = response.users.filter((user: any) => user.role !== 'Administrator');
        } else {
          console.error('No users found in response:', response);
        }
      },
      (error: any) => {
        console.error('Error fetching users:', error);
      }
    );
  }
}