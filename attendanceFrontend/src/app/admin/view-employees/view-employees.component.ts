import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EmployeeService } from 'src/app/shared/employee/employee.service';
import Swal from 'sweetalert2';

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
    // Use SweetAlert2 for confirmation
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you really want to delete this employee? This action cannot be undone!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!'
    }).then((result) => {
      if (result.isConfirmed) {
        // Call the delete API if the user confirms
        this.employeeService.deleteEmployeeapi(_id).subscribe(
          (res: any) => {
            // Remove the deleted employee from the employees array
            this.employees = this.employees.filter(employee => employee._id !== _id);
  
            // Show success alert
            Swal.fire(
              'Deleted!',
              'Employee has been deleted.',
              'success'
            );
          },
          (error: any) => {
            console.error('Error:', error);
  
            // Show error alert if something goes wrong
            Swal.fire(
              'Error!',
              'There was a problem deleting the employee.',
              'error'
            );
          }
        );
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        // Show cancel alert if the user cancels
        Swal.fire(
          'Cancelled',
          'Employee deletion was cancelled.',
          'info'
        );
      }
    });
  }
  

}
