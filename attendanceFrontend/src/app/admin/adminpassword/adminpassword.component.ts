import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
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

  constructor(private adminService: AdminLoginService, private router: Router,private snackBar:MatSnackBar) {}


  ngOnInit(): void {}
  submit() {
    const oldPassword = this.ChangePassword.get('oldPassword')?.value || '';
    const newPassword = this.ChangePassword.get('newPassword')?.value || '';
    
    const body = {
      oldPassword,
      newPassword
    };

    console.log(body)
  
    this.adminService.passwordChange(body).subscribe(
      (response: any) => {
        console.log('Password changed successfully:', response);



        this.router.navigate(['/admin/layout/dashboard']);
        this.snackBar.open('Password changed successfully', 'Close', {
          duration: 3000, // Duration in milliseconds
          panelClass: ['success-snackbar'],
          verticalPosition: 'top',
          horizontalPosition: 'right'
        });
      },
      (error) => {
        console.error('Error changing password:', error);
        this.snackBar.open('Incorrect Password', 'Close', {
          duration: 3000, // Duration in milliseconds
          panelClass: ['error-snackbar'],
          verticalPosition: 'top',
          horizontalPosition: 'right'
        });
      }
    );
  }
  
  
}
