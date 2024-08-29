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
  weeks: string[] = ['week1', 'week2', 'week3', 'week4'];
  selectedWeek: string = '';
  selectedMonth: string = '';

  constructor(private ratingService: RatingService) { }

  ngOnInit(): void {
    this.currentMonth = this.getCurrentMonth();
    this.selectedMonth = this.getCurrentMonthForFilter(); // Initialize selectedMonth in YYYY-MM format
    this.selectedWeek = this.getCurrentWeek();
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

  loadRatings() {
    console.log('Selected Week:', this.selectedWeek);
    console.log('Selected Month:', this.selectedMonth);
    
    this.ratingService.empRatingapi(this.selectedWeek, this.selectedMonth).subscribe(
      (res: any) => {
        console.log('API Response:', res);
        if (res.success) {
          this.ratings = res.data; 
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
    this.loadRatings();
  }
}
