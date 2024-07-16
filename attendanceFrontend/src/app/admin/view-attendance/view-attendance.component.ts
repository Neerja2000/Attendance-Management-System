import { Component, OnInit } from '@angular/core';
import { AttendanceService } from 'src/app/shared/attendance/attendance.service';

@Component({
  selector: 'app-view-attendance',
  templateUrl: './view-attendance.component.html',
  styleUrls: ['./view-attendance.component.css']
})
export class ViewAttendanceComponent implements OnInit {
attendance:any[]=[]
date: string = '';
  constructor(private attService:AttendanceService){

  }
  ngOnInit(): void {
    this.getTodayAttendance()
  }
  getTodayAttendance() {
    this.attService.getTodayAttendance().subscribe(
      (res: any) => {
        console.log('Attendance data:', res.data); // Log fetched data
        this.attendance = res.data.map((detail: any) => ({
          employeeId: detail.employeeId,
          employeeName: detail.employeeName,
          check_in: detail.check_in || null,
          break: detail.break || null,
          check_out: detail.check_out || null,
          work_done: detail.work_done || null,
          status: detail.status || 'absent'
        }));
      },
      (error: any) => {
        console.error('Error:', error);
      }
    );
  }
  
  
  
  

} 