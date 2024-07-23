// login.component.ts
import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { LoginService } from '../shared/empLogin/login.service';
import { AuthService } from '../shared/auth/auth.service';
import { AdminLoginService } from '../shared/adminLogin/admin-login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username: string = '';
  password: string = '';

  constructor(private loginService:LoginService, private router: Router, private authService:AuthService,private adminService:AdminLoginService) { }

  employeeLogin() {
    this.loginService.loginapi(this.username, this.password).subscribe(
      (response) => {
        if (response.success) {
          this.authService.storedata(response)
        
          this.router.navigate(['/employee/layout/emp-dashboard']);
        } else {
          alert(response.message);
        }
      },
      (error) => {
        console.error('Login failed', error);
        alert('Login failed. Please try again.');
      }
    );
  }
  adminLogin() {
    this.adminService.adminapi(this.username, this.password).subscribe(
      (response) => {
        console.log('Admin login response:', response); // Debugging response
        if (response.token) { // Check if token exists in response
          this.authService.storedata(response); // Store token and ID
          console.log('Stored data:', {
            _id: this.authService.getId(),
            token: this.authService.getToken()
          });
          this.router.navigate(['/admin/layout/dashboard']).then((navigated) => {
            if (navigated) {
              console.log('Navigation to dashboard successful');
            } else {
              console.error('Navigation to dashboard failed');
            }
          });
        } else {
          alert(response.message); // Alert error message if no token
        }
      },
      (error) => {
        console.error('Login failed', error);
        alert('Login failed. Please try again.');
      }
    );
  }
  
  
}
