import { Component } from '@angular/core';
import { AttendanceService } from 'src/app/shared/attendance/attendance.service';

@Component({
  selector: 'app-view-attendance-details',
  templateUrl: './view-attendance-details.component.html',
  styleUrls: ['./view-attendance-details.component.css']
})
export class ViewAttendanceDetailsComponent {
  attendance: any[] = [];
  paginatedAttendance: any[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 15;
  totalPages: number = 0;

  constructor(private attService: AttendanceService) { }

  ngOnInit(): void {
    this.getAllAttendance();
  }

  getAllAttendance() {
    this.attService.getAttendance().subscribe({
      next: (res: any) => {
        this.attendance = res.data;
        this.totalPages = Math.ceil(this.attendance.length / this.itemsPerPage);
        this.updatePagination();
      },
      error: (error: any) => {
        console.error('Error fetching attendance data', error);
      }
    });
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
    // Implement filtering logic based on selected month
    console.log('Filter by month:', month);
    // Example logic: Filter attendance data based on selected month
    // Replace with actual filtering logic based on your data structure
    // this.paginatedAttendance = this.attendance.filter(item => item.date.getMonth() === selectedMonthIndex);
  }
}
