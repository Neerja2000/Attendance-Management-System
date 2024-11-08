import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EmpRatingService } from 'src/app/shared/empRating/emp-rating.service';
import { AuthService } from 'src/app/shared/auth/auth.service';  

@Component({
  selector: 'app-add-daily-rating',
  templateUrl: './add-daily-rating.component.html',
  styleUrls: ['./add-daily-rating.component.css']
})
export class AddDailyRatingComponent implements OnInit {
  employeeId: string | null = null;
  
  // Initialize FormGroup
  dailyRating = new FormGroup({
    rating: new FormControl('', Validators.required),
    remarks: new FormControl('', Validators.required),
    employeeId: new FormControl(''),
    selectedDate: new FormControl('today'), // The date selection (today or yesterday)
    date: new FormControl(''),  // To hold the actual date
  });

  ratings = Array.from({ length: 10 }, (_, i) => i + 1);

  constructor(
    private ratingService: EmpRatingService,
    private snackbar: MatSnackBar,
    private authService: AuthService
  ) {}

  async ngOnInit(): Promise<void> {
    await this.fetchEmployeeId();
  }

  async fetchEmployeeId(): Promise<void> {
    try {
      this.employeeId = await this.authService.getId();
      this.dailyRating.get('employeeId')?.setValue(this.employeeId);
    } catch (error) {
      this.snackbar.open('Failed to fetch employee ID.', 'Close', { duration: 3000 });
    }
  }

  submit() {
    if (this.dailyRating.valid) {
      const selectedDate = this.dailyRating.get('selectedDate')?.value;

      // Set the date for yesterday or today
      let dateToSend: string;
      const currentDate = new Date();
      
      if (selectedDate === 'yesterday') {
        const yesterday = new Date(currentDate);
        yesterday.setDate(currentDate.getDate() - 1);
        dateToSend = yesterday.toISOString().split('T')[0]; // Format date as YYYY-MM-DD
      } else {
        dateToSend = currentDate.toISOString().split('T')[0]; // Format today as YYYY-MM-DD
      }

      // Set the actual date on the form
      this.dailyRating.get('date')?.setValue(dateToSend);

      const ratingData = this.dailyRating.value;

      this.ratingService.addEmpDailyRatingapi(ratingData).subscribe({
        next: (response) => {
          this.snackbar.open('Rating Submitted Successfully', 'Close', { duration: 3000 });
          this.dailyRating.reset();
        },
        error: (error) => {
          this.snackbar.open(error.error?.message || 'An error occurred. Please try again.', 'Close', { duration: 3000 });
        }
      });
    }
  }
}


