import { Component, OnInit } from '@angular/core';
import { AttendanceService } from 'src/app/shared/attendance/attendance.service';
import { EmployeeService } from 'src/app/shared/employee/employee.service';
import { ProjectService } from 'src/app/shared/project/project.service';

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
  taskCountToday:number=0
  pendingCount:number=0
  completedCount:number=0
  ngOnInit(): void {
   this.loadTotalEmployees()
   const today = new Date().toISOString().split('T')[0]; 
   this.loadAttendance(today);
   this.loadTasksCountByDate(today)
  }
 

  constructor(private employeeService:EmployeeService,private attendanceService:AttendanceService,private taskService:ProjectService){}
  loadTotalEmployees(): void {
    this.employeeService.viewEmployeeapi().subscribe(response => {
      if (response.success) {
        this.totalEmployees = response.totalEmployees;
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
    this.selectedDate = inputDate; // Store the selected date
    this.loadAttendance(inputDate); // Load attendance for the selected date
    this.loadTasksCountByDate(inputDate); // Load task count for the selected date
  }

  loadTasksCountByDate(date: string): void {
    console.log('Loading tasks for date:', date); // Log the date being passed
    this.taskService.getTasksCountByDate(date).subscribe(response => {
      console.log('API Response:', response); // Log the response to inspect its structure
      if (response.success) {
        this.taskCountToday = response.count.total;
        this.pendingCount=response.count.pending;
        this.completedCount=response.count.completed;
        console.log("tasks", this.taskCountToday);
      } else {
        console.error('Failed to fetch task count');
      }
    }, error => {
      console.error('Error fetching task count:', error);
    });
  }
  
  
}
