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
    this.getAllAttendance()
  }
 
  getAllAttendance() {
    this.attService.getAttendance().subscribe(
      (res: any) => {
        this.attendance = res.data;
      },
      (error: any) => {
        console.error('Error:', error);
      }
    );
  }

} 