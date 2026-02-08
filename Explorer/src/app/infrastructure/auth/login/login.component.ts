import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { Login } from '../model/login.model';

@Component({
  selector: 'xp-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  errorMessage: string = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  loginForm = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
  });

  login(): void {
    const login: Login = {
      username: this.loginForm.value.username || "",
      password: this.loginForm.value.password || "",
    };

    if (this.loginForm.valid) {
      this.authService.login(login).subscribe({
        next: () => {
          this.errorMessage = '';
          this.router.navigate(['/']);
        },
        error: (error) => {
          console.error('Login error:', error);
          
          // Handle different error statuses
          if (error.status === 403) {
            // User is blocked
            this.errorMessage = 'Your account has been temporarily blocked due to multiple failed login attempts. Please contact an administrator.';
          } else if (error.status === 404) {
            // Invalid credentials (could be wrong username or password)
            this.errorMessage = 'Invalid username or password. Please try again.';
          } else {
            // Generic error
            this.errorMessage = 'An error occurred during login. Please try again later.';
          }
        }
      });
    }
  }
}