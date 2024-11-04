import { Component, OnInit } from '@angular/core';
import { EmployeeService } from 'src/app/shared/employee/employee.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  totalEmployees: number = 0;

  ngOnInit(): void {
   this.loadTotalEmployees()
  }
 

  constructor(private employeeService:EmployeeService){}
  loadTotalEmployees(): void {
    this.employeeService.viewEmployeeapi().subscribe(response => {
      if (response.success) {
        this.totalEmployees = response.data.totalEmployees;
      } else {
        console.error('Failed to fetch total employees');
      }
    }, error => {
      console.error('Error fetching total employees:', error);
    });
  }
}
