// login.component.ts
import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { LoginService } from '../shared/empLogin/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username: string = '';
  password: string = '';

  constructor(private loginService:LoginService, private router: Router) { }

  employeeLogin() {
    this.loginService.loginapi(this.username, this.password).subscribe(
      (response) => {
        if (response.success) {
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
}
