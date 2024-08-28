import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EmpRatingService } from 'src/app/shared/empRating/emp-rating.service';

@Component({
  selector: 'app-add-daily-rating',
  templateUrl: './add-daily-rating.component.html',
  styleUrls: ['./add-daily-rating.component.css']
})
export class AddDailyRatingComponent implements OnInit {

  dailyAttendance = new FormGroup({
    'rating': new FormControl('', Validators.required),
    'remarks': new FormControl('', Validators.required)
  });

  ratings = Array.from({ length: 10 }, (_, i) => i + 1);

  constructor(private ratingService: EmpRatingService,private snackbar:MatSnackBar) {}

  ngOnInit(): void {}

  submit() {
    if (this.dailyAttendance.valid) {
      const RatingData = this.dailyAttendance.value;  // Get form values
      console.log('Rating submitted:', RatingData);
  
      this.ratingService.addEmpDailyRatingapi(RatingData).subscribe({
        next: (response) => {
          console.log('Rating added successfully:', response);
          this.snackbar.open('Rating Submitted Successfully', 'Close', {
            duration: 3000, // Duration in milliseconds,
            
            panelClass: ['success-snackbar'],
            verticalPosition: 'top',
            horizontalPosition: 'right'
          });
          this.dailyAttendance.reset();
        },
        error: (error) => {
          console.error('Error occurred while adding rating:', error);

          // Check if the backend response contains a message and display it
          const errorMessage = error.error?.message || 'An error occurred. Please try again.';
          
          this.snackbar.open(errorMessage, 'Close', {
            duration: 3000, // Duration in milliseconds
            panelClass: ['error-snackbar'],
            verticalPosition: 'top',
            horizontalPosition: 'right'
          });
        }
      });
    } else {
      console.log('Form is invalid');
    }
  }
}
