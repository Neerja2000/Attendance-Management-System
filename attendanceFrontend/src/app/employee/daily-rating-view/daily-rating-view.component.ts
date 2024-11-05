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
  selectedWeek: string = '';
  weeks: { value: string; label: string; disabled: boolean }[] = [];
  employeeId: string = '';

  constructor(private ratingService: EmpRatingService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.employeeId = params.get('employeeId') || '';
      if (this.employeeId) {
        this.updateWeeks();
        this.loadRatings();
      } else {
        console.error('Employee ID is not provided');
      }
    });
  }

  updateWeeks() {
    const currentWeekOfYear = this.getCurrentWeekOfYear();
    this.weeks = [];

    for (let i = 1; i <= 54; i++) {
      this.weeks.push({
        value: `week${i}`,
        label: `Week ${i}`,
        disabled: i > currentWeekOfYear
      });
    }

    if (!this.selectedWeek) {
      this.selectedWeek = `week${currentWeekOfYear}`;
    }
  }

  getCurrentWeekOfYear(): number {
    const today = new Date();
    const startOfYear = new Date(today.getFullYear(), 0, 1);
    const daysElapsed = Math.floor((today.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24));
    return Math.ceil((daysElapsed + startOfYear.getDay()) / 7);
  }

  loadRatings(): void {
    if (!this.employeeId) {
      console.error('Employee ID is not set');
      return;
    }

    this.ratingService.getSingleEmployeeRating(this.employeeId).subscribe(
      (response: any) => {
        if (response.success) {
          const filteredRatings = response.data.filter((rating: any) => {
            const ratingDate = new Date(rating.createdAt);
            const ratingWeek = this.getWeekOfYear(ratingDate);
            return this.selectedWeek ? ratingWeek === this.selectedWeek : true;
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

  getWeekOfYear(date: Date): string {
    const startOfYear = new Date(date.getFullYear(), 0, 1);
    const daysSinceStart = Math.floor((date.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24));
    return `week${Math.ceil((daysSinceStart + startOfYear.getDay()) / 7)}`;
  }

  processRatings(): void {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const employeeMap = new Map<string, any>();
  
    this.ratings.forEach(rating => {
      if (rating.employeeId && rating.employeeId._id) {
        const date = new Date(rating.createdAt);
        const dayOfWeek = date.getDay();
        const dayName = days[dayOfWeek - 1] || 'Sunday'; // Ensure Sunday is handled correctly
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
    this.loadRatings();
  }
}