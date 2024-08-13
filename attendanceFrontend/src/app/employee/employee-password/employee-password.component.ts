import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { EmployeeService } from 'src/app/shared/employee/employee.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-employee-password',
  templateUrl: './employee-password.component.html',
  styleUrls: ['./employee-password.component.css']
})
export class EmployeePasswordComponent implements OnInit {
  ChangePassword = new FormGroup({
    oldPassword: new FormControl(''),
    newPassword: new FormControl(''),
  });

  constructor(private employeeService: EmployeeService, private router: Router,private snackBar:MatSnackBar) {}

  ngOnInit(): void {}
  submit() {
    const oldPassword = this.ChangePassword.get('oldPassword')?.value || '';
    const newPassword = this.ChangePassword.get('newPassword')?.value || '';
    
    const body = {
      oldPassword,
      newPassword
    };
    
   
  
    this.employeeService.passwordChange(body).subscribe(
      (response: any) => {
        console.log('Password changed successfully:', response);
        this.snackBar.open('Password Changed successfully!', 'Close', {
          duration: 3000, // Duration in milliseconds
          panelClass: ['success-snackbar'],
          verticalPosition: 'top',
          horizontalPosition: 'right'
        });
        this.router.navigate(['/employee/layout/emp-dashboard']);
      },
      (error) => {
        console.error('Error changing password:', error);
      }
    );
  }
}
