import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeeService } from 'src/app/shared/employee/employee.service';

@Component({
  selector: 'app-update-employee',
  templateUrl: './update-employee.component.html',
  styleUrls: ['./update-employee.component.css']
})
export class UpdateEmployeeComponent implements OnInit {
  updateEmployee = new FormGroup({
    id: new FormControl('', [Validators.required]),
    name: new FormControl('', [Validators.required]),
    gender:new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    userId : new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
    phone: new FormControl('', [Validators.required]),
    address: new FormControl('', [Validators.required]),
    joining_date: new FormControl('', [Validators.required]),
    experience: new FormControl('', [Validators.required]),
    salary: new FormControl('', [Validators.required]),

  });

  errorMessage: string | null = null;

  constructor(
    private employeeService: EmployeeService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    console.log('Employee ID from route:', id); // Debug log
    if (id) {
      this.updateEmployee.patchValue({ id });
      this.getSingleDetails(id);
    } else {
      console.error('No ID found in route parameters');
      this.errorMessage = 'Invalid Employee ID.';
    }
  }

  getSingleDetails(id: string) {
    this.employeeService.getSingleEmployee({ id }).subscribe(
      (res: any) => {
        console.log('Response from API:', res); // Debug log
        if (res && res.data) {
          const result = res.data;
          this.updateEmployee.patchValue({
            name: result.name || '',
            gender:result.gender||'',
            email: result.email || '',
            userId: result.userId || '',
            password: result.password || '',
            phone: result.phone || '',
            address: result.address || '',
            joining_date: result.joining_date || '',
            experience:result.experience||'',
            salary: result.salary || '',
          });
        } else {
          console.error('Invalid response data:', res);
          this.errorMessage = 'Employee not found or invalid data received.';
          // Optionally, redirect the user or show a message on the UI
          // this.router.navigate(['/admin/layout/view-employee']);
        }
      },
      (error: any) => {
        console.error('Error fetching employee details:', error);
        this.errorMessage = 'Error fetching employee details. Please try again later.';
      }
    );
  }
  

  submit() {
    if (this.updateEmployee.valid) {
      this.employeeService.updateEmployeeapi(this.updateEmployee.value).subscribe(
        (res: any) => {
          this.router.navigate(['/admin/layout/view-employee']);
        },
        (error: any) => {
          console.error('Error updating employee:', error);
          this.errorMessage = 'Error updating employee. Please try again later.';
        }
      );
    } else {
      console.log("error")
    }
  }
}
