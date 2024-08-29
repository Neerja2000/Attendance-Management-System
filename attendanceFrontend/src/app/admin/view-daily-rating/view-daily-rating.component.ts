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
          console.log(response.data)
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
  
    // Debugging
    console.log('Employee Map after Processing:', employeeMap);
  
    this.employees = Array.from(employeeMap.values()).map(employee => {
      const averageRating = employee.ratingCount > 0 
        ? (employee.totalRating / employee.ratingCount).toFixed(2) 
        : '0.00'; // Use '0.00' instead of 'N/A'
  

  
      return {
        ...employee,
        averageRating
      };
    });
  }
  
  
  
}
