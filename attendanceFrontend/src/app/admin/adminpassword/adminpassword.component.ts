import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminLoginService } from 'src/app/shared/adminLogin/admin-login.service';

@Component({
  selector: 'app-adminpassword',
  templateUrl: './adminpassword.component.html',
  styleUrls: ['./adminpassword.component.css']
})
export class AdminpasswordComponent implements OnInit {
  ChangePassword = new FormGroup({
    oldPassword: new FormControl(''),
    newPassword: new FormControl(''),
  });

  constructor(private adminService: AdminLoginService, private router: Router) {}

  ngOnInit(): void {}
  submit() {
    const formData = new FormData();
  
    const oldPassword = this.ChangePassword.get('oldPassword')?.value || '';
    const newPassword = this.ChangePassword.get('newPassword')?.value || '';
  
    formData.append('oldPassword', oldPassword);
    formData.append('newPassword', newPassword);
  
    const email = localStorage.getItem('adminEmail') || ''; // Retrieve email from localStorage
    const adminToken = localStorage.getItem('adminToken') || ''; // Retrieve token from localStorage
  
    formData.append('email', email);
  
    this.adminService.passwordChange(formData).subscribe(
      (response: any) => {
        console.log('Password changed successfully:', response);
        this.router.navigate(['/some-other-route']); // Navigate to another route after success
      },
      (error) => {
        console.error('Error changing password:', error);
      }
    );
  }
  
}
