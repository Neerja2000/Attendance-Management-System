import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AttendanceService } from 'src/app/shared/attendance/attendance.service';

@Component({
  selector: 'app-view-attendance-details',
  templateUrl: './view-attendance-details.component.html',
  styleUrls: ['./view-attendance-details.component.css']
})
export class ViewAttendanceDetailsComponent {
  attendance: any[] = []; // This will hold all attendance records
  paginatedAttendance: any[] = []; // This will hold the currently displayed page of attendance records
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalPages: number = 0;
  filteredAttendance: any[] = []; // This will hold the filtered attendance records

  constructor(
    private route: ActivatedRoute,
    private attService: AttendanceService
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const attendanceId = params.get('id');
      if (attendanceId) {
        this.getAttendanceDetail(attendanceId);
      }
    });
  }

  getAttendanceDetail(id: string) {
    this.attService.getEmployeeAttendance(id).subscribe(
      (res: any) => {
        this.attendance = res.data; // Assign all attendance data
        this.filteredAttendance = this.attendance; // Initialize filteredAttendance
        this.totalPages = Math.ceil(this.filteredAttendance.length / this.itemsPerPage); // Calculate total pages
        this.updatePagination(); // Update paginatedAttendance based on currentPage
      },
      (error: any) => {
        console.error('Error fetching attendance details:', error);
      }
    );
  }

  updatePagination() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedAttendance = this.filteredAttendance.slice(startIndex, endIndex);
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagination();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagination();
    }
  }

  onMonthChange(event: any) {
    const selectedMonth = event.target.value;
    this.filterByMonth(selectedMonth);
  }

  filterByMonth(month: string) {
    if (month) {
      this.filteredAttendance = this.attendance.filter(detail => {
        const attendanceMonth = new Date(detail.createdAt).toLocaleString('default', { month: 'long' }).toLowerCase();
        return attendanceMonth === month;
      });
    } else {
      this.filteredAttendance = this.attendance;
    }
    this.totalPages = Math.ceil(this.filteredAttendance.length / this.itemsPerPage); // Recalculate total pages
    this.updatePagination(); // Update paginatedAttendance based on currentPage
   }


   
   calculateTotalWorkHours(checkIn: string, checkOut: string, breakStart: string, breakFinish: string): string {
    const checkInTime = new Date(`1970-01-01T${checkIn}:00`);
    const checkOutTime = new Date(`1970-01-01T${checkOut}:00`);
    const breakStartTime = new Date(`1970-01-01T${breakStart}:00`);
    const breakFinishTime = new Date(`1970-01-01T${breakFinish}:00`);

    if (checkInTime && checkOutTime && breakStartTime && breakFinishTime) {
      const breakDuration = (breakFinishTime.getTime() - breakStartTime.getTime()) / 60000; // break duration in minutes
      const workDuration = (checkOutTime.getTime() - checkInTime.getTime()) / 60000 - breakDuration; // work duration in minutes
      const hours = Math.floor(workDuration / 60);
      const minutes = workDuration % 60;
      return `${hours}h ${minutes}m`;
    }
    return 'Null';
  }
}
