import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Route, Router } from '@angular/router';
import { EmployeeService } from 'src/app/shared/employee/employee.service';

@Component({
  selector: 'app-add-employee',
  templateUrl: './add-employee.component.html',
  styleUrls: ['./add-employee.component.css']
})
export class AddEmployeeComponent implements OnInit{
  addEmployee=new FormGroup({
    "name":new FormControl(''),
    "gender":new FormControl(''),
    "email":new FormControl(''),
    "phone":new FormControl(''),
    'address':new FormControl(''),
    "joining_date":new FormControl(''),
    "experience":new FormControl(''),
    "salary":new FormControl(''),
    "userId":new FormControl(''),
    'password':new FormControl("")
  })
  ngOnInit(): void {
    
  }

 constructor(private router:Router, private employeeService:EmployeeService,private snackBar:MatSnackBar){}

 submit() {

  
  console.log(this.addEmployee.value);

  this.employeeService.addEmployeeapi(this.addEmployee.value).subscribe(
    (res: any) => {
      console.log(res);
      if (res.success) {
        this.router.navigateByUrl("/admin/layout/view-employee");
      } else {
        this.snackBar.open(res.message, 'Close', {
          duration: 3000, // Duration in milliseconds
          panelClass: ['error-snackbar'],
          verticalPosition: 'top',
          horizontalPosition: 'right'
        });
      }
    },
    (error: any) => {
      console.error('Error:', error);

      // Displaying error message from the backend
      this.snackBar.open(error.error?.message || 'Error submitting the form', 'Close', {
        duration: 3000,
        panelClass: ['error-snackbar'],
        verticalPosition: 'top',
        horizontalPosition: 'right'
      });
    }
  );
}

}

