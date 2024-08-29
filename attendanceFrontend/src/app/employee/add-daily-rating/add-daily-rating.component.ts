import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EmpRatingService } from 'src/app/shared/empRating/emp-rating.service';
import { AuthService } from 'src/app/shared/auth/auth.service';  // Assuming AuthService is used to get employeeId

@Component({
  selector: 'app-add-daily-rating',
  templateUrl: './add-daily-rating.component.html',
  styleUrls: ['./add-daily-rating.component.css']
})
export class AddDailyRatingComponent implements OnInit {
  employeeId: string | null = null; // Declare employeeId property

  dailyRating = new FormGroup({
    'rating': new FormControl('', Validators.required),
    'remarks': new FormControl('', Validators.required),
    'employeeId': new FormControl('')  // Add employeeId to the form group
  });

  ratings = Array.from({ length: 10 }, (_, i) => i + 1);

  constructor(
    private ratingService: EmpRatingService,
    private snackbar: MatSnackBar,
    private authService: AuthService // Inject AuthService to fetch employeeId
  ) {}

  async ngOnInit(): Promise<void> {
    await this.fetchEmployeeId(); // Ensure employeeId is fetched before form submission
  }

  async fetchEmployeeId(): Promise<void> {
    try {
      this.employeeId = await this.authService.getId();
      console.log(this.employeeId);
      this.dailyRating.get('employeeId')?.setValue(this.employeeId); // Set employeeId in the form
    } catch (error) {
      console.error('Error fetching employee ID:', error);
      this.snackbar.open('Failed to fetch employee ID.', 'Close', {
        duration: 3000,
        panelClass: ['error-snackbar'],
        verticalPosition: 'top',
        horizontalPosition: 'right'
      });
    }
  }
  

  submit() {
    if (this.dailyRating.valid) {
      const RatingData = this.dailyRating.value;  // Get form values, including employeeId
      console.log('Rating submitted:', RatingData);
  
      this.ratingService.addEmpDailyRatingapi(RatingData).subscribe({
        next: (response) => {
          console.log('Rating added successfully:', response);
          this.snackbar.open('Rating Submitted Successfully', 'Close', {
            duration: 3000, // Duration in milliseconds
            panelClass: ['success-snackbar'],
            verticalPosition: 'top',
            horizontalPosition: 'right'
          });
          this.dailyRating.reset();
        },
        error: (error) => {
          console.error('Error occurred while adding rating:', error);

          const errorMessage = error.error?.message || 'An error occurred. Please try again.';
          this.snackbar.open(errorMessage, 'Close', {
            duration: 3000,
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
