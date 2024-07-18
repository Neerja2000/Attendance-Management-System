import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'; // Import necessary form modules
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
    private attendanceService: EmpAttendanceService
  ) {
    // Initialize the form group and form controls
    this.attendanceForm = this.formBuilder.group({
      name: ['', Validators.required],
      checkIn: ['', Validators.required],
      break: ['', Validators.required],
      checkOut: ['', Validators.required],
      workDone: ['', Validators.required],
      present: [false] // Initialize present/absent toggle with false
    });
  }

  addAttendance() {
    // Validate form before submission
    if (this.attendanceForm.invalid) {
      return;
    }

    // Call service to add attendance
    this.attendanceService.addEmpAttendanceapi(this.attendanceForm.value).subscribe(
      (response: any) => {
        console.log('Attendance added successfully', response);
        // Optionally, you can handle success response here
      },
      (error: any) => {
        console.error('Error adding attendance', error);
        // Optionally, you can handle error response here
      }
    );
  }
}
