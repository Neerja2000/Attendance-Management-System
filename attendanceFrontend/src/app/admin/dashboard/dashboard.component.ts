import { Component, OnInit } from '@angular/core';
import { AttendanceService } from 'src/app/shared/attendance/attendance.service';
import { EmployeeService } from 'src/app/shared/employee/employee.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  totalEmployees: number = 0;
  presentCount: number = 0;
  absentCount: number = 0;
  attendanceRecords: any[] = [];
  selectedDate: string = '';
  ngOnInit(): void {
   this.loadTotalEmployees()
   const today = new Date().toISOString().split('T')[0]; 
   this.loadAttendance(today);
  }
 

  constructor(private employeeService:EmployeeService,private attendanceService:AttendanceService){}
  loadTotalEmployees(): void {
    this.employeeService.viewEmployeeapi().subscribe(response => {
      if (response.success) {
        this.totalEmployees = response.data.totalEmployees;
      } else {
        console.error('Failed to fetch total employees');
      }
    }, error => {
      console.error('Error fetching total employees:', error);
    });
  }


  loadAttendance(date?: string): void {
    this.attendanceService.getAttendanceByDate(date || '').subscribe(response => {
      if (response.success) {
        this.presentCount = response.presentCount;
        this.absentCount = response.absentCount; // This should now work correctly
        this.attendanceRecords = response.data;
      } else {
        console.error('Failed to fetch attendance');
      }
    }, error => {
      console.error('Error fetching attendance:', error);
    });
  }
  

  onDateChange(event: Event): void {
    const inputDate = (event.target as HTMLInputElement).value;
    this.loadAttendance(inputDate);
  }
}
