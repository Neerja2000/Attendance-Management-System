import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from 'src/app/shared/auth/auth.service';
import { EmpAttendanceService } from 'src/app/shared/empAttendance/emp-attendance.service';

@Component({
  selector: 'app-emp-add-attendance',
  templateUrl: './emp-add-attendance.component.html',
  styleUrls: ['./emp-add-attendance.component.css']
})
export class EmpAddAttendanceComponent implements OnInit {
  attendanceForm: FormGroup;
  employeeId: string | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private attendanceService: EmpAttendanceService,
    private authService: AuthService
  ) {
    this.attendanceForm = this.formBuilder.group({
      check_in: [''],
      break_time: [''],
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
    this.employeeId = await this.authService.getId();
  }

  loadAttendance() {
    if (this.employeeId) {
      this.attendanceService.getTodayAttendance().subscribe(
        (response: any) => {
          const attendance = response.data.find((att: any) => att.employeeId === this.employeeId);
          if (attendance) {
            this.attendanceForm.patchValue({
              check_in: attendance.check_in || '',
              break_time: attendance.break_time || '',
              check_out: attendance.check_out || '',
              work_done: attendance.work_done || ''
            });
          }
        },
        (error: any) => {
          console.error('Error loading attendance', error);
        }
      );
    }
  }

  addAttendanceField(field: string) {
    if (!this.employeeId) {
      console.error('EmployeeId not found.');
      return;
    }

    const formData = {
      employeeId: this.employeeId,
      check_in: this.attendanceForm.get('check_in')?.value,
      break_time: this.attendanceForm.get('break_time')?.value,
      check_out: this.attendanceForm.get('check_out')?.value,
      work_done: this.attendanceForm.get('work_done')?.value
    };

    this.attendanceService.addEmpAttendanceapi(formData).subscribe(
      (response: any) => {
        console.log('Attendance data saved successfully', response);
        this.loadAttendance(); // Refresh the attendance data
      },
      (error: any) => {
        console.error('Error adding attendance', error);
      }
    );
  }
}
