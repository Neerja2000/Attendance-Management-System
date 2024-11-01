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
  employeeId: string = ''; // Ensure this is set to the ID you want to fetch ratings for

  constructor(private ratingService: EmpRatingService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.employeeId = params.get('employeeId') || '';
      if (this.employeeId) {
        // Set default selected month and week
        this.selectedMonth = this.getCurrentMonthForFilter();
        this.selectedWeek = this.getCurrentWeek();
        this.updateWeeks();
        this.loadRatings();
      } else {
        console.error('Employee ID is not provided');
      }
    });
  }

  getCurrentMonth(): string {
    const date = new Date();
    const month = date.toLocaleString('en-US', { month: 'long' });
    const year = date.getFullYear();
    return `${month} ${year}`;
  }

  getCurrentMonthForFilter(): string {
    const date = new Date();
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    return `${year}-${month}`;
  }

  // Calculate the current week based on the start of the month

  getCurrentWeek(): string {
    const date = new Date();
    const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    const dayOfMonth = date.getDate();
    const daysFromStartOfMonth = (date.getTime() - firstDayOfMonth.getTime()) / (1000 * 60 * 60 * 24);

    return `week${Math.ceil((daysFromStartOfMonth + firstDayOfMonth.getDay()) / 7)}`;
  }
  
  updateWeeks() {
    if (!this.selectedMonth) {
      this.selectedMonth = this.getCurrentMonthForFilter();
    }

    const [year, month] = this.selectedMonth.split('-').map(Number);
    const firstDay = new Date(year, month - 1, 1);
    const lastDay = new Date(year, month, 0);
    const totalDays = lastDay.getDate();
    const weeksCount = Math.ceil((totalDays + firstDay.getDay()) / 7);

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

    this.ratingService.getSingleEmployeeRating(this.employeeId).subscribe(
      (response: any) => {
        if (response.success) {
          // Filter ratings based on selected month and week
          const filteredRatings = response.data.filter((rating: any) => {
            const ratingDate = new Date(rating.createdAt);
            const ratingYearMonth = `${ratingDate.getFullYear()}-${(ratingDate.getMonth() + 1).toString().padStart(2, '0')}`;
            const ratingWeek = this.getWeekOfMonth(ratingDate);

            // Filter by selected month and week
            const matchesMonth = this.selectedMonth ? ratingYearMonth === this.selectedMonth : true;
            const matchesWeek = this.selectedWeek ? ratingWeek === this.selectedWeek : true;

            return matchesMonth && matchesWeek;
          });

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

  getWeekOfMonth(date: Date): string {
    const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    const daysSinceFirst = Math.floor((date.getTime() - firstDayOfMonth.getTime()) / (1000 * 60 * 60 * 24));
    return `week${Math.ceil((daysSinceFirst + firstDayOfMonth.getDay() + 1) / 7)}`;
  }

  processRatings(): void {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    const employeeMap = new Map<string, any>();
  
    this.ratings.forEach(rating => {
      if (rating.employeeId && rating.employeeId._id) {
        const date = new Date(rating.createdAt);
        const dayOfWeek = date.getDay();
        const dayName = days[dayOfWeek - 1]; // Adjust the index for correct day names
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
          remarks: rating.remarks,
          date: date.toDateString() // Store the date in a readable format
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
    this.updateWeeks();
    this.loadRatings();
  }


  
}
