import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EmpRatingService } from 'src/app/shared/empRating/emp-rating.service';

@Component({
  selector: 'app-emp-view-rating',
  templateUrl: './emp-view-rating.component.html',
  styleUrls: ['./emp-view-rating.component.css']
})
export class EmpViewRatingComponent implements OnInit {
  ratings: any[] = [];
  errorMessage: string | null = null;

  constructor(private ratingService: EmpRatingService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.loadRatings();
  }

  // Method to load ratings based on the employee ID from the route
  loadRatings(): void {
    this.route.paramMap.subscribe(params => {
      const employeeId = params.get('employeeId');
      if (employeeId) {
        this.fetchRatings(employeeId);
      } else {
        this.errorMessage = 'Employee ID is required.';
      }
    });
  }

  // Method to fetch ratings from the service
  private fetchRatings(employeeId: string): void {
    this.ratingService.getSingleRating(employeeId).subscribe(
      response => {
        if (response.success) {
          this.ratings = Array.isArray(response.data) ? response.data : [response.data];
          console.log(response.data);
        } else {
          this.errorMessage = response.message;
        }
      },
      error => {
        this.errorMessage = 'An error occurred while fetching the rating.';
      }
    );
  }
}
