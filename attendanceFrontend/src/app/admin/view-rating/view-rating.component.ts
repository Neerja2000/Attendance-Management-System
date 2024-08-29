import { Component, OnInit } from '@angular/core';
import { RatingService } from 'src/app/shared/rating/rating.service';

@Component({
  selector: 'app-view-rating',
  templateUrl: './view-rating.component.html',
  styleUrls: ['./view-rating.component.css']
})
export class ViewRatingComponent implements OnInit {
  ratings: any[] = [];
  currentMonth!: string;
  weeks: string[] = [];
  selectedWeek: string = '';
  selectedMonth: string = '';

  constructor(private ratingService: RatingService) { }

  ngOnInit(): void {
    this.currentMonth = this.getCurrentMonth();
    this.selectedMonth = this.getCurrentMonthForFilter(); // Initialize selectedMonth in YYYY-MM format
    this.updateWeeks(); // Initialize weeks based on the current month
    this.setCurrentWeek(); // Set the current week as selected
    this.loadRatings(); 
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
    // Optionally set default selected week if weeks are available
    if (this.weeks.length > 0 && !this.selectedWeek) {
      this.selectedWeek = this.weeks[0];
    }
  }

  setCurrentWeek() {
    const currentWeek = this.getCurrentWeek();
    if (this.weeks.includes(currentWeek)) {
      this.selectedWeek = currentWeek;
    }
  }

  loadRatings() {
    console.log('Selected Week:', this.selectedWeek);
    console.log('Selected Month:', this.selectedMonth);
    
    this.ratingService.empRatingapi(this.selectedWeek, this.selectedMonth).subscribe(
      (res: any) => {
        console.log('API Response:', res);
        if (res.success) {
          this.ratings = res.data; 
          console.log('Ratings Data:', this.ratings);
        } else {
          console.error('Error fetching ratings:', res.message);
        }
      },
      (error) => {
        console.error('Error:', error);
      }
    );
  }

  onFilterChange() {
    this.updateWeeks(); // Update weeks when the month changes
    this.setCurrentWeek(); // Reset selected week if needed
    this.loadRatings();
  }
}
