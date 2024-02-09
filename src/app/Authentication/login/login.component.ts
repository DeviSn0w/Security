import { jwtDecode } from 'jwt-decode';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/Services/Shared/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  submitted = false;
  showSuccessAlert: boolean = false;
  showErrorAlert: boolean = false;
  jwtToken: string | null = null;
  username!: string;
  role!: string;

  constructor(private formBuilder: FormBuilder, private userService: UserService, private router: Router) {
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required]],
      password: ['', Validators.required]
    });
  }

  // Convenience getter for easy access to form fields
  get f() { return this.loginForm.controls; }

  loginUser() {
    this.submitted = true;

    // Stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }
     // Submit login form
     this.userService.loginUser(this.loginForm.value)
     .subscribe(
       response => {
         // Handle success
         this.showSuccessAlert = true;
         this.showErrorAlert = false;
         const token = response.token;
         // Decode the JWT token
         const decodedToken: any = jwtDecode(token);
         //console.log('Decoded token:', decodedToken);
         // Assign username and role
         this.username = decodedToken.username;
         this.role = decodedToken.role;
         // Save token in local storage
         localStorage.setItem('jwtToken', token);

        // Update the variable to reflect the token
        this.jwtToken = token;


        // Route to Dashboard page after 3 seconds
        setTimeout(() => {
          this.router.navigate(['/MainDashboard']);
        }, 1000);
      },
       error => { 
         // Handle error
         this.showErrorAlert = true;
         this.showSuccessAlert = false;
       }
     );
 }
 // Method to dismiss the alerts
 dismissAlert() {
  this.showSuccessAlert = false;
  this.showErrorAlert = false;
}

// Method to handle logout
logout() {
  // Remove the token from local storage
  localStorage.removeItem('jwtToken');
  // Update the variable to reflect the token removal
  this.jwtToken = null;
}

 ngOnInit(): void {
     
 }
}