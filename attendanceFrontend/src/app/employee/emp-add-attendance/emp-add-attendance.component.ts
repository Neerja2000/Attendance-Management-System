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
  isWorkDoneAdded: boolean = false;
  workDoneContent: string = '';
  today: string;
  previousDay: string;

  constructor(
    private formBuilder: FormBuilder,
    private attendanceService: EmpAttendanceService,
    private authService: AuthService,
    private snackbar: MatSnackBar
  ) {
    // Initialize form with today’s date as default
    this.attendanceForm = this.formBuilder.group({
      date: [new Date().toISOString().substring(0, 10)], // Default to today’s date in 'YYYY-MM-DD' format
      check_in: [''],
      break_time_start: [''],
      break_time_finish: [''],
      check_out: [''],
      work_done: ['']
    });

    const currentDate = new Date();
    this.today = this.formatDate(currentDate);
    const yesterday = new Date(currentDate);
    yesterday.setDate(yesterday.getDate() - 1);
    this.previousDay = this.formatDate(yesterday);
  }

  ngOnInit(): void {
    this.fetchEmployeeId().then(() => {
      this.loadAttendance(this.today); // Load attendance for today by default
    });
  }

  formatDate(date: Date): string {
    return date.toISOString().substring(0, 10); // Returns 'YYYY-MM-DD' format
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

  onDateChange() {
    
    const selectedDate = this.attendanceForm.get('date')?.value;
    
    console.log('Selected date:', selectedDate);
    this.loadAttendance(selectedDate); // Load attendance data for the selected date
  }

  loadAttendance(date: string) {
    if (this.employeeId && date) {
      console.log('Loading attendance for date:', date);
      
      // Clear form values initially to avoid previous data persisting
      this.attendanceForm.patchValue({
        date: date,
        check_in: '',
        break_time_start: '',
        break_time_finish: '',
        check_out: '',
        work_done: ''
      });
      this.isWorkDoneAdded = false;
      this.workDoneContent = '';
  
      this.attendanceService.getAttendanceByDateAndEmployeeId(this.employeeId, date).subscribe(
        (response: any) => {
          console.log('Attendance data response:', response);
  
          // Check if data exists for the selected date
          const attendance = response.data.find((att: any) => att.date.startsWith(date));
  
          if (attendance) {
            // Populate the form fields with data for the selected date
            this.attendanceForm.patchValue({
              date: this.formatDate(new Date(attendance.date)),
              check_in: attendance.check_in || '',  // Empty if no check-in time
              break_time_start: attendance.break_time_start || '',
              break_time_finish: attendance.break_time_finish || '',
              check_out: attendance.check_out || '',
              work_done: attendance.work_done || ''
            });
            this.isWorkDoneAdded = !!attendance.work_done;
            this.workDoneContent = attendance.work_done || '';
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
    this.workDoneContent = this.attendanceForm.get('work_done')?.value || '';
    const modal = new bootstrap.Modal(document.getElementById('workDoneModal'));
    modal.show();
  }

  saveWorkDone() {
    this.attendanceForm.patchValue({ work_done: this.workDoneContent });
    const modal = bootstrap.Modal.getInstance(document.getElementById('workDoneModal'));
    modal.hide();
    this.submitAttendance(); 
  }

  submitAttendance() {
    if (!this.employeeId) {
      console.error('EmployeeId not found.');
      return;
    }

    const formData = {
      employeeId: this.employeeId,
      date: this.attendanceForm.get('date')?.value,
      check_in: this.attendanceForm.get('check_in')?.value,
      break_time_start: this.attendanceForm.get('break_time_start')?.value,
      break_time_finish: this.attendanceForm.get('break_time_finish')?.value,
      check_out: this.attendanceForm.get('check_out')?.value,
      work_done: this.attendanceForm.get('work_done')?.value
    };

    this.attendanceService.addEmpAttendanceapi(formData).subscribe(
      (response: any) => {
        this.snackbar.open('Changes Saved', 'Close', {
          duration: 3000,
          panelClass: ['success-snackbar'],
          verticalPosition: 'top',
        });
        this.loadAttendance(formData.date);
      },
      (error: any) => {
        console.error('Error adding attendance', error);
      }
    );
  }
}