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
        this.attendance = res.data.map((group: any) => ({
          employeeId: group._id.employeeId,
          employeeName: group._id.employeeName,
          check_in: group.attendances.length > 0 ? group.attendances[0]?.check_in : null,
          break: group.attendances.length > 0 ? group.attendances[0]?.break : null,
          check_out: group.attendances.length > 0 ? group.attendances[0]?.check_out : null,
          work_done: group.attendances.length > 0 ? group.attendances[0]?.work_done : null,
          status: group.attendances.length > 0 ? group.attendances[0]?.status : 'absent'
        }));
      },
      (error: any) => {
        console.error('Error:', error);
      }
    );
  }
  
  

} 