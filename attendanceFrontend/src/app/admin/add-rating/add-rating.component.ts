import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RatingService } from 'src/app/shared/rating/rating.service';

@Component({
  selector: 'app-add-rating',
  templateUrl: './add-rating.component.html',
  styleUrls: ['./add-rating.component.css']
})
export class AddRatingComponent implements OnInit {
  employeeId!: string;  // definite assignment assertion
  rating: number = 0;
  ratingForm = new FormGroup({
    remarks: new FormControl('')
  });

  constructor(private route: ActivatedRoute, private ratingService:RatingService) {}

  ngOnInit(): void {
    this.employeeId = this.route.snapshot.paramMap.get('id')!;
  }

  setRating(rating: number): void {
    this.rating = rating;
  }

  addRating(): void {
    const formValue = this.ratingForm.value;
    const ratingData = {
      employeeId: this.employeeId,
      rating: this.rating,
      remarks: formValue.remarks
    };

    this.ratingService.addRatingapi(ratingData).subscribe(
      (res:any) => {
        console.log('Rating added successfully', res);
        // You can add more logic here to handle success response
      },
      (err: any)=> {
        console.error('Error adding rating', err);
        // Handle the error response here
      }
    );
  }
}
