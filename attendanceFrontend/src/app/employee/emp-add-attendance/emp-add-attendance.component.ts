import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { AuthService } from 'src/app/shared/auth/auth.service';
import { EmpAttendanceService } from 'src/app/shared/empAttendance/emp-attendance.service';
declare var bootstrap: any;
@Component({
  selector: 'app-emp-add-attendance',
  templateUrl: './emp-add-attendance.component.html',
  styleUrls: ['./emp-add-attendance.component.css']
})
export class EmpAddAttendanceComponent implements OnInit {
  public Editor = ClassicEditor;

  attendanceForm: FormGroup;
  employeeId: string | null = null;
  isWorkDoneAdded: boolean = false; // Flag to check if work has been added
  workDoneContent: string = ''; // Store work done content for modal

  constructor(
    private formBuilder: FormBuilder,
    private attendanceService: EmpAttendanceService,
    private authService: AuthService,
    private snackbar: MatSnackBar
  ) {
    this.attendanceForm = this.formBuilder.group({
      check_in: [''],
      break_time_start: [''],
      break_time_finish: [''],
      check_out: [''],
      work_done: ['']
    });
  }

  ngOnInit(): void {
    this.fetchEmployeeId().then(() => {
      this.loadAttendance();
    });
  }

  async fetchEmployeeId() {
    try {
      this.employeeId = await this.authService.getId();
      if (!this.employeeId) {
        console.error('EmployeeId not found in session storage.');
      } else {
        console.log('Fetched EmployeeId:', this.employeeId);
      }
    } catch (error) {
      console.error('Error fetching employee ID:', error);
    }
  }

  loadAttendance() {
    if (this.employeeId) {
      this.attendanceService.getTodayAttendanceByEmployeeId(this.employeeId).subscribe(
        (response: any) => {
          console.log('Attendance Response:', response);
          const attendance = response.data.find((att: any) => att.employeeId === this.employeeId);
          if (attendance) {
            this.attendanceForm.patchValue({
              check_in: attendance.check_in || '',
              break_time_start: attendance.break_time_start || '',
              break_time_finish: attendance.break_time_finish || '',
              check_out: attendance.check_out || '',
              work_done: attendance.work_done || ''
            });
  
            if (attendance.work_done) {
              this.isWorkDoneAdded = true;
              this.workDoneContent = attendance.work_done;
            }
          }
        },
        (error: any) => {
          console.error('Error loading attendance', error);
          this.snackbar.open('Failed to load attendance data', 'Close', {
            duration: 3000,
            panelClass: ['error-snackbar'],
            verticalPosition: 'top',
          });
        }
      );
    }
  }
  

  openWorkDoneModal() {
    // Set the modal textarea with existing work content (if available)
    this.workDoneContent = this.attendanceForm.get('work_done')?.value || '';
    
    const modal = new bootstrap.Modal(document.getElementById('workDoneModal'));
    modal.show();
  }

  saveWorkDone() {
    // Update the form control with the new work done data
    this.attendanceForm.patchValue({ work_done: this.workDoneContent });

    // Close the modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('workDoneModal'));
    modal.hide();

    // Optionally, you can call the backend API to save the work done data
    this.submitAttendance(); // Call this method if you want to save the changes immediately
  }

  submitAttendance() {
    if (!this.employeeId) {
      console.error('EmployeeId not found.');
      return;
    }

    const formData = {
      employeeId: this.employeeId,
      check_in: this.attendanceForm.get('check_in')?.value,
      break_time_start: this.attendanceForm.get('break_time_start')?.value,
      break_time_finish: this.attendanceForm.get('break_time_finish')?.value,
      check_out: this.attendanceForm.get('check_out')?.value,
      work_done: this.attendanceForm.get('work_done')?.value
    };

    this.attendanceService.addEmpAttendanceapi(formData).subscribe(
      (response: any) => {
        this.snackbar.open('Changes Saved', 'Close', {
          duration: 3000, // Duration in milliseconds
          panelClass: ['success-snackbar'],
          verticalPosition: 'top',
        });
        this.loadAttendance(); // Refresh the attendance data
      },
      (error: any) => {
        console.error('Error adding attendance', error);
      }
    );
  }
}
