import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'; // Import necessary form modules
import { AuthService } from 'src/app/shared/auth/auth.service';
import { EmpAttendanceService } from 'src/app/shared/empAttendance/emp-attendance.service';

@Component({
  selector: 'app-emp-add-attendance',
  templateUrl: './emp-add-attendance.component.html',
  styleUrls: ['./emp-add-attendance.component.css']
})
export class EmpAddAttendanceComponent {
  attendanceForm: FormGroup; // Declare a FormGroup

  constructor(
    private formBuilder: FormBuilder,
    private attendanceService: EmpAttendanceService,
    private authService:AuthService
  ) {
    // Initialize the form group and form controls
    this.attendanceForm = this.formBuilder.group({
      employeeId: [''],
     
      check_in: ['', Validators.required],
      break: ['', Validators.required],
      check_out: ['', Validators.required],
      work_done: ['', Validators.required],
    
    });
    
  }

  addAttendance() {
    const employeeId = this.authService.getId(); // Fetch _id using AuthService
    if (!employeeId) {
      console.error('EmployeeId not found.');
      return;
    }

    this.attendanceForm.patchValue({ employeeId });

    this.attendanceService.addEmpAttendanceapi(this.attendanceForm.value).subscribe(
      (response: any) => {
        console.log('Attendance added successfully', response);
        // Optionally handle success response here
      },
      (error: any) => {
        console.error('Error adding attendance', error);
        // Optionally handle error response here
      }
    );
  }
}
