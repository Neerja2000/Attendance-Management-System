import { Component, OnInit } from '@angular/core';
import { AttendanceService } from 'src/app/shared/attendance/attendance.service';

@Component({
  selector: 'app-view-attendance',
  templateUrl: './view-attendance.component.html',
  styleUrls: ['./view-attendance.component.css']
})
export class ViewAttendanceComponent implements OnInit {
attendance:any[]=[]

  constructor(private attService:AttendanceService){

  }
  ngOnInit(): void {
    this.getTodayAttendance()
  }
 
  getTodayAttendance() {
    this.attService.getTodayAttendance().subscribe(
      (res: any) => {
        console.log('Attendance data:', res.data);  // Log fetched data
        this.attendance = res.data;
      },
      (error: any) => {
        console.error('Error:', error);
      }
    );
  }

} 