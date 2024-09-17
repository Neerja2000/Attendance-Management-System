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
  selectedMonth: string = '';
  selectedWeek: string = '';
  weeks: string[] = [];

  constructor(private ratingService: RatingService) {}

  ngOnInit(): void {
    // Set default month and week on load
    this.selectedMonth = this.getCurrentMonthForFilter();
    this.updateWeeks();
    this.loadRatings();
  }

  /**
   * Returns the current month in 'YYYY-MM' format.
   */
  getCurrentMonthForFilter(): string {
    const date = new Date();
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    return `${year}-${month}`;
  }

  /**
   * Updates the weeks array based on the selected month.
   */
  updateWeeks() {
    if (this.selectedMonth) {
      const [year, month] = this.selectedMonth.split('-').map(Number);
      const firstDay = new Date(year, month - 1, 1);
      const lastDay = new Date(year, month, 0);
      const totalDays = lastDay.getDate();
      const weeksCount = Math.ceil(totalDays / 7);

      this.weeks = [];
      for (let i = 1; i <= weeksCount; i++) {
        this.weeks.push(`week${i}`);
      }

      // Set default week if not already selected
      if (this.weeks.length > 0 && !this.selectedWeek) {
        this.selectedWeek = this.getCurrentWeek(weeksCount);
      }
    }
  }

  /**
   * Determines the current week based on the current date.
   * @param weeksCount Total number of weeks in the month.
   */
  getCurrentWeek(weeksCount: number): string {
    const date = new Date();
    const day = date.getDate();
    const weekNumber = Math.ceil(day / 7);
    // Ensure the week number does not exceed the total weeks in the month
    return `week${weekNumber > weeksCount ? weeksCount : weekNumber}`;
  }

  /**
   * Loads ratings based on the selected month and week.
   */
  loadRatings(): void {
    this.ratingService.getDailyRating().subscribe(
      (response: any) => {
        if (response.success) {
          // Log the entire data response from the API
          console.log('All empDailyRating Data:', response.data);
  
          // Now filter the data based on selected month and week
          const filteredRatings = response.data.filter((rating: any) => {
            const ratingDate = new Date(rating.createdAt);
  
            // Get the year and month for comparison with the selectedMonth
            const ratingYearMonth = `${ratingDate.getFullYear()}-${(ratingDate.getMonth() + 1).toString().padStart(2, '0')}`;
            
            // Calculate the week of the month for the rating's date
            const ratingWeek = `week${Math.ceil(ratingDate.getDate() / 7)}`;
  
            // Ensure both month and week filters are applied
            const matchesMonth = this.selectedMonth ? ratingYearMonth === this.selectedMonth : true;
            const matchesWeek = this.selectedWeek ? ratingWeek === this.selectedWeek : true;
  
            return matchesMonth && matchesWeek;
          });
  
          // Log filtered ratings
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
  

  /**
   * Processes the filtered ratings to structure data for the table.
   */
  processRatings(): void {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    const employeeMap = new Map<string, any>();

    this.ratings.forEach(rating => {
      if (rating.employeeId && rating.employeeId._id) {
        const date = new Date(rating.createdAt);
        const dayOfWeek = date.getDay(); // 0 (Sunday) to 6 (Saturday)
        // Adjust to make Monday = 0, ..., Friday = 4
        const adjustedDayIndex = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
        const dayName = days[adjustedDayIndex];

        if (!dayName) {
          // Skip if the day is Saturday or Sunday
          return;
        }

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

  /**
   * Handler for when either the month or week filter changes.
   */
  onFilterChange() {
    // Update week options and reload ratings
    this.updateWeeks();
    this.loadRatings();
  }
}

