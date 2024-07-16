import { Component, OnInit } from '@angular/core';
import { RatingService } from 'src/app/shared/rating/rating.service';

@Component({
  selector: 'app-view-rating',
  templateUrl: './view-rating.component.html',
  styleUrls: ['./view-rating.component.css']
})
export class ViewRatingComponent implements OnInit {
  ratings: any[] = []; // Array to hold the ratings data

  constructor(private ratingService: RatingService) { }

  ngOnInit(): void {
    this.loadRatings(); // Load ratings when the component initializes
  }


  loadRatings() {
    this.ratingService.empRatingapi().subscribe(
      (res: any) => {
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
}
