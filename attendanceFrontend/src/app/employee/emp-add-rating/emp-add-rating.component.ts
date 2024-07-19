import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { EmpRatingService } from 'src/app/shared/empRating/emp-rating.service';
import { RatingService } from 'src/app/shared/rating/rating.service';

@Component({
  selector: 'app-emp-add-rating',
  templateUrl: './emp-add-rating.component.html',
  styleUrls: ['./emp-add-rating.component.css']
})
export class EmpAddRatingComponent implements OnInit {
  ratingForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private ratingService: EmpRatingService
  ) {
    this.ratingForm = this.formBuilder.group({
      rating: ['', Validators.required],
      remarks: ['', Validators.required]
    });
  }

  ngOnInit(): void {}

  addRating() {
    if (this.ratingForm.valid) {
      const ratingData = this.ratingForm.value;
      console.log(ratingData);
      this.ratingService.addEmpAttendanceapi(ratingData).subscribe(
        (response: any) => {
          console.log(response);
          console.log('Rating added successfully', response);
          // Optionally handle success response here
        },
        (error: any) => {
          console.error('Error adding rating', error);
          // Optionally handle error response here
        }
      );
    }
  }
}