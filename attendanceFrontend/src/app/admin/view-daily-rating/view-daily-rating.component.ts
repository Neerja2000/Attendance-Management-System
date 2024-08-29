// src/app/view-daily-rating/view-daily-rating.component.ts
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
employeeId:any
  constructor(private ratingService: RatingService) {}

  ngOnInit(): void {
    this.loadRatings();
  }

  loadRatings(): void {

    
    this.ratingService.getDailyRating().subscribe(
      (response: any) => {
        if (response.success) {
          this.ratings = response.data;
         
          this.processRatings();
          console.log(response.data)
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

    // Assuming `ratings` array contains objects with fields: `employeeId`, `rating`, `remarks`, and `createdAt`.
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

    this.employees = this.ratings.reduce((acc: any[], rating: any) => {
      const date = new Date(rating.createdAt);
      const dayOfWeek = date.getDay();
      const dayName = days[dayOfWeek - 1]; // Convert 1-5 (Mon-Fri) to "Monday"-"Friday"

      if (dayName) {
        let employee = acc.find((e) => e.employeeId === rating.employeeId);
        if (!employee) {
          employee = {
            employeeId: rating.employeeId,
            name: rating.employeeName, // Assuming `employeeName` exists, or fetch it from a separate API
            ratings: {}
          };
          acc.push(employee);
        }
        employee.ratings[dayName] = rating;
      }
      return acc;
    }, []);
  }
}
