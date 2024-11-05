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
  selectedWeek: string = '';
  weeks: { week: string; isDisabled: boolean; isUpcoming: boolean }[] = [];
  currentWeek: string = '';

  constructor(private ratingService: RatingService) {}

  ngOnInit(): void {
    this.updateWeeks();
    this.loadRatings();
  }

  updateWeeks(): void {
    this.weeks = [];
    const firstDayOfYear = new Date(new Date().getFullYear(), 0, 1);
    const lastDayOfYear = new Date(new Date().getFullYear(), 11, 31);
    const totalDays = Math.ceil((lastDayOfYear.getTime() - firstDayOfYear.getTime()) / (1000 * 3600 * 24));

    for (let i = 0; i < totalDays; i += 7) {
      const weekNumber = Math.ceil((i + 1) / 7);
      const weekLabel = `Week ${weekNumber}`;

      // Disable only upcoming weeks (greater than the current week)
      const isDisabled = weekNumber > this.getCurrentWeekNumber();
      const isUpcoming = weekNumber > this.getCurrentWeekNumber(); // Mark upcoming weeks
      this.weeks.push({ week: weekLabel, isDisabled, isUpcoming });
    }

    // Set the current week
    this.currentWeek = this.getCurrentWeekLabel(); // Get the current week label
    this.selectedWeek = this.currentWeek; // Default to current week
  }

  getCurrentWeekNumber(): number {
    const today = new Date();
    return this.getWeekNumber(today); // Return the current week number
  }

  getCurrentWeekLabel(): string {
    const weekNumber = this.getCurrentWeekNumber();
    return `Week ${weekNumber}`;
  }

  loadRatings(): void {
    this.ratingService.getDailyRating().subscribe(
      (response: any) => {
        if (response.success) {
          const filteredRatings = response.data.filter((rating: any) => {
            const ratingDate = new Date(rating.createdAt);
            const ratingWeek = this.getWeekNumber(ratingDate);

            const matchesWeek = `Week ${ratingWeek}` === this.selectedWeek;

            return matchesWeek && ratingDate.getDay() !== 0 && ratingDate.getDay() !== 6; // Exclude Saturday and Sunday
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

  getWeekNumber(date: Date): number {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / (1000 * 3600 * 24);
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
  }

  processRatings(): void {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    const employeeMap = new Map<string, any>();

    this.ratings.forEach((rating) => {
      if (rating.employeeId && rating.employeeId._id) {
        const date = new Date(rating.createdAt);
        const dayOfWeek = date.getDay(); // 0 (Sunday) to 6 (Saturday)
        const adjustedDayIndex = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Adjust to make Monday = 0, ..., Friday = 4
        const dayName = days[adjustedDayIndex];

        if (!dayName) {
          return; // Skip if the day is Saturday or Sunday
        }

        const employeeId = rating.employeeId._id;

        if (!employeeMap.has(employeeId)) {
          employeeMap.set(employeeId, {
            name: rating.employeeId.name,
            ratings: {},
            totalRating: 0,
            ratingCount: 0,
          });
        }

        const employeeData = employeeMap.get(employeeId);
        employeeData.ratings[dayName] = {
          rating: rating.rating,
          remarks: rating.remarks,
        };

        employeeData.totalRating += rating.rating;
        employeeData.ratingCount++;
      } else {
        console.warn('Missing employeeId in rating:', rating);
      }
    });

    this.employees = Array.from(employeeMap.values()).map((employee) => {
      const averageRating =
        employee.ratingCount > 0
          ? (employee.totalRating / employee.ratingCount).toFixed(2)
          : '0.00';

      return {
        ...employee,
        averageRating,
      };
    });
  }
}