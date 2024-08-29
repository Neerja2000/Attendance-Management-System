import { Component, OnInit } from '@angular/core';
import { RatingService } from 'src/app/shared/rating/rating.service';

@Component({
  selector: 'app-view-daily-rating',
  templateUrl: './view-daily-rating.component.html',
  styleUrls: ['./view-daily-rating.component.css']
})
export class ViewDailyRatingComponent implements OnInit {
  ratings: any[] = [];
  employees: any[] = [];
  selectedMonth: string='';
  selectedWeek: string='';
  weeks: string[] = [];

  constructor(private ratingService: RatingService) {}

  ngOnInit(): void {
    this.loadRatings();
    this.updateWeeks();
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
    this.ratingService.getDailyRating().subscribe(
      (response: any) => {
        if (response.success) {
          // Filter ratings based on selected month and week
          const filteredRatings = response.data.filter((rating: any) => {
            const ratingDate = new Date(rating.createdAt);
            const ratingYearMonth = `${ratingDate.getFullYear()}-${(ratingDate.getMonth() + 1).toString().padStart(2, '0')}`;
            const ratingWeek = `week${Math.ceil(ratingDate.getDate() / 7)}`;
  
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
    this.updateWeeks();
    this.loadRatings();
  }
}
