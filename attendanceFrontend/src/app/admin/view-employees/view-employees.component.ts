import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EmployeeService } from 'src/app/shared/employee/employee.service';

@Component({
  selector: 'app-view-employees',
  templateUrl: './view-employees.component.html',
  styleUrls: ['./view-employees.component.css']
})
export class ViewEmployeesComponent implements OnInit {
  employees: any[] = [];

  constructor(private employeeService: EmployeeService,private router:Router) {}

  ngOnInit(): void {
    this.getEmployees();
  }

  getEmployees() {
    this.employeeService.viewEmployeeapi().subscribe(
      (res: any) => {
        this.employees = res.data;
      },
      (error: any) => {
        console.error('Error:', error);
      }
    );
  }
   
  delete(_id: string) {
    if (confirm('Are you sure you want to delete this employee?')) {
      this.employeeService.deleteEmployeeapi(_id).subscribe(
        (res: any) => {
          // Remove the deleted employee from the employees array
          this.employees = this.employees.filter(employee => employee._id !== _id);
        },
        (error: any) => {
          console.error('Error:', error);
        }
      );
    }
  }

}
