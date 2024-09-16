import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EmpRatingService } from 'src/app/shared/empRating/emp-rating.service';

@Component({
  selector: 'app-daily-rating-view',
  templateUrl: './daily-rating-view.component.html',
  styleUrls: ['./daily-rating-view.component.css']
})
export class DailyRatingViewComponent implements OnInit {
  ratings: any[] = [];
  employees: any[] = [];
  selectedMonth: string = '';
  selectedWeek: string = '';
  weeks: string[] = [];
  employeeId: string = '';

  constructor(private ratingService: EmpRatingService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    // Get employee ID from route params
    this.route.paramMap.subscribe(params => {
      this.employeeId = params.get('employeeId') || '';
      if (this.employeeId) {
        // Set default month and week filters
        this.selectedMonth = this.getCurrentMonthForFilter();
        this.selectedWeek = this.getCurrentWeek();
        
        this.loadRatings();
      } else {
        console.error('Employee ID is not provided');
      }
    });
  }

  getCurrentMonthForFilter(): string {
    const date = new Date();
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    return `${year}-${month}`;
  }

  getCurrentWeek(): string {
    const date = new Date();
    const day = date.getDate();
    return `week${Math.ceil(day / 7)}`;
  }

  updateWeeks() {
    const [year, month] = this.selectedMonth.split('-').map(Number);
    const firstDay = new Date(year, month - 1, 1);
    const lastDay = new Date(year, month, 0);
    const totalDays = lastDay.getDate();
    const weeksCount = Math.ceil(totalDays / 7);

    this.weeks = [];
    for (let i = 1; i <= weeksCount; i++) {
      this.weeks.push(`week${i}`);
    }
    if (this.weeks.length > 0 && !this.selectedWeek) {
      this.selectedWeek = this.weeks[0];
    }
  }

  loadRatings(): void {
    if (!this.employeeId) {
      console.error('Employee ID is not set');
      return;
    }

    console.log('Selected Month:', this.selectedMonth);
    console.log('Selected Week:', this.selectedWeek);

    this.ratingService.getSingleEmployeeRating(this.employeeId).subscribe(
      (response: any) => {
        if (response.success) {
          // Debug to check response data
          console.log('Response Data:', response.data);

          // Filter ratings based on selected month and week
          const filteredRatings = response.data.filter((rating: any) => {
            const ratingDate = new Date(rating.createdAt);
            const ratingYearMonth = `${ratingDate.getFullYear()}-${(ratingDate.getMonth() + 1).toString().padStart(2, '0')}`;
            const ratingWeek = `week${Math.ceil(ratingDate.getDate() / 7)}`;

            // Debug to check each rating's date
            console.log('Rating Date:', ratingDate, 'Month:', ratingYearMonth, 'Week:', ratingWeek);

            // Filter by selected month and week
            const matchesMonth = this.selectedMonth ? ratingYearMonth === this.selectedMonth : true;
            const matchesWeek = this.selectedWeek ? ratingWeek === this.selectedWeek : true;

            return matchesMonth && matchesWeek;
          });

          console.log('Filtered Ratings:', filteredRatings);

          this.ratings = filteredRatings;
          this.processRatings();
        } else {
          console.error('Failed to load ratings:', response.message);
        }
      },
      (error) => {
        console.error('Error fetching ratings:', error);
      }
    );
  }

  processRatings(): void {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    const employeeMap = new Map<string, any>();

    this.ratings.forEach(rating => {
      if (rating.employeeId && rating.employeeId._id) {
        const date = new Date(rating.createdAt);
        const dayOfWeek = date.getDay();
        const dayName = days[dayOfWeek - 1];
        const employeeId = rating.employeeId._id;

        if (!employeeMap.has(employeeId)) {
          employeeMap.set(employeeId, {
            name: rating.employeeId.name,
            ratings: {},
            totalRating: 0,
            ratingCount: 0
          });
        }

        const employeeData = employeeMap.get(employeeId);
        employeeData.ratings[dayName] = {
          rating: rating.rating,
          remarks: rating.remarks
        };

        employeeData.totalRating += rating.rating;
        employeeData.ratingCount++;
      } else {
        console.warn('Missing employeeId in rating:', rating);
      }
    });

    this.employees = Array.from(employeeMap.values()).map(employee => {
      const averageRating = employee.ratingCount > 0 
        ? (employee.totalRating / employee.ratingCount).toFixed(2) 
        : '0.00'; 

      return {
        ...employee,
        averageRating
      };
    });
  }

  onFilterChange() {
    console.log('Filter changed. Updating weeks and reloading ratings.');
    this.updateWeeks();
    this.loadRatings();
   }
}
