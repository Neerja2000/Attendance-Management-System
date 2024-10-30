import { Component, OnInit } from '@angular/core';
import { AttendanceService } from 'src/app/shared/attendance/attendance.service';
import { AuthService } from 'src/app/shared/auth/auth.service';
import { ProjectService } from 'src/app/shared/project/project.service';

@Component({
  selector: 'app-emp-dashboard',
  templateUrl: './emp-dashboard.component.html',
  styleUrls: ['./emp-dashboard.component.css']
})
export class EmpDashboardComponent implements OnInit {
  totalWorkingDays: number = 0;
  totalHolidays: number = 0;
  todayStatus: string = '';
  totalAttendance: number = 0;
  employeeId: string = '';
  pendingTasksCount: number = 0;
  selectedMonth: string = '';
  UrgentlyNeededCount: number = 0;
  lateArrivalsCount: number = 0; // New variable to store late arrivals count
  assignTasks: any[] = [];

  constructor(
    private attendanceService: AttendanceService, 
    private authService: AuthService, 
    private taskService: ProjectService
  ) {}

  ngOnInit(): void {
    this.employeeId = this.authService.getId() || '';
    this.selectedMonth = new Date().toISOString().slice(0, 7);
    this.getMonthlyHolidays();
    this.loadPendingTasksCount();
    this.getAssignTask();
    this.loadLateArrivalsCount();
  }

  filterByMonth() {
    this.getMonthlyHolidays();
    this.loadPendingTasksCount();
    this.loadLateArrivalsCount(); // Reload late arrivals based on selected month
  }

  getMonthlyHolidays() {
    this.attendanceService.getHolidays(this.employeeId, this.selectedMonth).subscribe(data => {
      if (data && data.data) {
        this.totalWorkingDays = data.data.totalWorkingDays;
        this.totalHolidays = data.data.totalHolidays;
      } else {
        console.error("Unexpected API response:", data);
      }
    }, error => {
      console.error("Error fetching holidays:", error);
    });
  }

  loadPendingTasksCount() {
    if (!this.selectedMonth) return;
    this.taskService.getPendingTasksCount(this.employeeId, this.selectedMonth).subscribe(
      response => {
        this.pendingTasksCount = response.data.pendingTasksCount;
      },
      error => {
        console.error('Error fetching pending tasks count:', error);
      }
    );
  }

  loadLateArrivalsCount() {
    this.attendanceService.getLateArrivalsCount(this.employeeId, this.selectedMonth).subscribe(
      data => {
        this.lateArrivalsCount = data.data ? data.data.length : 0; // Assume data contains the array of late arrivals
      },
      error => {
        console.error('Error fetching late arrivals count:', error);
      }
    );
  }

  getAssignTask() {
    if (!this.employeeId) return;
    this.taskService.getAssignTaskApi(this.employeeId).subscribe(
      (res: any) => {
        if (res.success) {
          this.assignTasks = res.data;
          this.UrgentlyNeededCount = this.assignTasks.filter((task: any) => task.urgent).length;
        } else {
          console.error('Failed to retrieve assigned tasks:', res.message);
        }
      },
      (error: any) => {
        console.error('Error fetching assigned tasks:', error);
      }
    );
  }
}
