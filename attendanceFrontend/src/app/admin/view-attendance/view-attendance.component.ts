import { Component, OnInit } from '@angular/core';
import { AttendanceService } from 'src/app/shared/attendance/attendance.service';

@Component({
  selector: 'app-view-attendance',
  templateUrl: './view-attendance.component.html',
  styleUrls: ['./view-attendance.component.css']
})
export class ViewAttendanceComponent implements OnInit {
  attendance: any[] = [];
  date: string = '';
  maxDate: string = '';

  constructor(private attService: AttendanceService) {}

  ngOnInit(): void {
    const today = new Date();
    this.maxDate = this.formatDate(today); // Set the max date to today
    this.date = today.toLocaleDateString();
    this.date = new Date().toISOString().split('T')[0]; // Format the date for the date picker
    this.getTodayAttendance();
  }

  getTodayAttendance() {
    this.attService.getTodayAttendance().subscribe(
      (res: any) => {
        this.updateAttendanceList(res);
      },
      (error: any) => {
        console.error('Error:', error);
      }
    );
  }

  getAttendanceByDate() {
    this.attService.getAttendanceByDate(this.date).subscribe(
     
      (res: any) => {
        console.log("dds",res)
        this.updateAttendanceList(res);
      },
      (error: any) => {
        console.error('Error:', error);
      }
    );
  }

  updateAttendanceList(res: any) {
    console.log('API Response:', res); // Log the entire response
    this.attendance = res.data.map((detail: any) => {
      console.log('Attendance Detail:', detail); // Log each detail
      return {
        employeeId: detail.employeeId,
        employeeName: detail.employeeName,
        check_in: detail.check_in || null,
        break_time_start: detail.break_time_start || null,
        break_time_finish: detail.break_time_finish || null,
        check_out: detail.check_out || null,
        work_done: detail.work_done || null,
        status: detail.status || 'absent'
      };
    });
  }

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}
