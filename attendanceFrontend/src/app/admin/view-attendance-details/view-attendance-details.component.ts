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
  itemsPerPage: number = 15;
  totalPages: number = 0;

  constructor(
    private route: ActivatedRoute,
    private attService: AttendanceService
  ) {}

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
        this.totalPages = Math.ceil(this.attendance.length / this.itemsPerPage); // Calculate total pages
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
    this.paginatedAttendance = this.attendance.slice(startIndex, endIndex);
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

  filterByMonth(month: string) {
    // Implement filtering logic based on selected month if needed
    console.log('Filter by month:', month);
  }
}

