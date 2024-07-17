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
export class AddRatingComponent implements OnInit {
  employeeId: string = '';
  rating: number = 0; // Initialize with default value
  adminRating: number = 0; // Initialize with default value

  constructor(private route: ActivatedRoute, private ratingService: RatingService) {
    const id = this.route.snapshot.paramMap.get('id');
    this.employeeId = id ? id : '';
  }

  ngOnInit(): void {
    // Any initialization logic can go here
  }

  addRating() {
    this.ratingService.updateAdminRating(this.employeeId, this.adminRating).subscribe(
      
      (res: any) => {
        console.log(res)
        if (res.success) {
          console.log('Admin rating updated successfully:', res.data);
          // Optionally, navigate back to the ratings list or another page
        } else {
          console.error('Error updating admin rating:', res.message);
        }
      },
      (error) => {
        console.error('Error:', error);
      }
    );
  }
}
  