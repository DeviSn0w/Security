import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/Services/Shared/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  registrationForm: FormGroup;
  submitted = false;
  showSuccessAlert: boolean = false;
  showErrorAlert: boolean = false;

  constructor(private router: Router, private formBuilder: FormBuilder, private userService: UserService) {
    this.registrationForm = this.formBuilder.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      phone_number: [''],
      department: [''],
      address: ['']
    }, {
      validators: this.passwordMatchValidator
    });
  }

  passwordMatchValidator(formGroup: FormGroup) {
    const password = formGroup.get('password');
    const confirmPassword = formGroup.get('confirmPassword');

    // Use non-null assertion operator (!) to inform TypeScript that these values won't be null
    if (confirmPassword!.errors && !confirmPassword!.errors['passwordMismatch']) {
      return;
    }

    if (password!.value !== confirmPassword!.value) {
      confirmPassword!.setErrors({ passwordMismatch: true });
    } else {
      confirmPassword!.setErrors(null);
    }
  }


  // Convenience getter for easy access to form fields
  get f() { return this.registrationForm.controls; }

  registerUser() {
    this.submitted = true;

    // Stop here if form is invalid
    if (this.registrationForm.invalid) {
      return;
    }

    // Submit registration form
    this.userService.registerUser(this.registrationForm.value)
      .subscribe(
        response => {
          // Handle success
          console.log('Registration successful!', response);
          this.showSuccessAlert = true;
          this.showErrorAlert = false;

          // Route to login page after 3 seconds
          setTimeout(() => {
            this.router.navigate(['/Login']);
          }, 1000);
        },
        error => {
          // Handle error
          console.error('Registration failed!', error);
          this.showErrorAlert = true;
          this.showSuccessAlert = false;
        }
      );
  }

  dismissAlert() {
    this.showSuccessAlert = false;
    this.showErrorAlert = false;
  }

  ngOnInit(): void {

  }
}