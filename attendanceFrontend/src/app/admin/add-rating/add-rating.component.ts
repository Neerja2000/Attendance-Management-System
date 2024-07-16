import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RatingService } from 'src/app/shared/rating/rating.service';

interface Employee {
  name: string;
  rating: number;
  remarks: string;
}
@Component({
  selector: 'app-add-rating',
  templateUrl: './add-rating.component.html',
  styleUrls: ['./add-rating.component.css']
})
export class AddRatingComponent {
  employeeId: string;
  rating: string = ''; // Initialize with an empty string
  remarks: string = ''; // Initialize with an empty string

  constructor(private route: ActivatedRoute, private ratingService: RatingService) {
    this.employeeId = ''; // Initialize with an empty string or handle null checks
    const id = this.route.snapshot.paramMap.get('id');
    this.employeeId = id ? id : '';
  }

  addRating() {
    const form = {
      employeeId: this.employeeId,
      rating: this.rating,
      remarks: this.remarks
    };

    this.ratingService.addRatingapi(form).subscribe(
      (response) => {
        console.log('Rating added successfully', response);
        // Optionally, navigate back to employee list or perform other actions
      },
      (error) => {
        console.error('Error adding rating', error);
        // Handle error
      }
    );
  }
}
  