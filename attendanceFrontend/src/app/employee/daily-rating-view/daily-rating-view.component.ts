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
  weeks: string[] = Array.from({ length: 54 }, (_, i) => `week${i + 1}`);
  employeeId: string = ''; // Ensure this is set to the ID you want to fetch ratings for

  constructor(private ratingService: EmpRatingService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.employeeId = params.get('employeeId') || '';
      if (this.employeeId) {
        this.selectedWeek = this.getCurrentWeek();
        this.loadRatings();
      } else {
        console.error('Employee ID is not provided');
      }
    });
  }

  // Calculate the current week of the year
  getCurrentWeek(): string {
    const date = new Date();
    const start = new Date(date.getFullYear(), 0, 1);
    const diff = (date.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);
    return `week${Math.ceil((diff + start.getDay() + 1) / 7)}`;
  }

  loadRatings(): void {
    if (!this.employeeId) {
      console.error('Employee ID is not set');
      return;
    }

    this.ratingService.getSingleEmployeeRating(this.employeeId).subscribe(
      (response: any) => {
        if (response.success) {
          // Filter ratings based on the selected week of the year
          const filteredRatings = response.data.filter((rating: any) => {
            const ratingDate = new Date(rating.createdAt);
            const ratingWeek = this.getWeekOfYear(ratingDate);

            // Filter by selected week
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

  // Calculate the week number for a specific date within the year
  getWeekOfYear(date: Date): string {
    const start = new Date(date.getFullYear(), 0, 1);
    const diff = (date.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);
    return `week${Math.ceil((diff + start.getDay() + 1) / 7)}`;
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
          remarks: rating.remarks,
          date: date.toDateString()
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
