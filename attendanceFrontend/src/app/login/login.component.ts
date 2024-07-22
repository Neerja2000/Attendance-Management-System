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
  adminLogin(){
    this.adminService.adminapi(this.username,this.password).subscribe(
      (response) => {
        if (response.success) {
          this.authService.storedata(response)
        
          this.router.navigate(['/admin/layout/dashboard']);
        } else {
          alert(response.message);
        }
      },
      (error) => {
        console.error('Login failed', error);
        alert('Login failed. Please try again.');
      } 
    )
  }
}
