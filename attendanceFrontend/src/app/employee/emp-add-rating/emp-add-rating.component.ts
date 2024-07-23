import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/auth/auth.service';
import { EmpRatingService } from 'src/app/shared/empRating/emp-rating.service';
import { RatingService } from 'src/app/shared/rating/rating.service';

@Component({
  selector: 'app-emp-add-rating',
  templateUrl: './emp-add-rating.component.html',
  styleUrls: ['./emp-add-rating.component.css']
})
export class EmpAddRatingComponent implements OnInit {
  ratingForm: FormGroup;
  employeeId: string | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private ratingService: EmpRatingService,
    private authService: AuthService,
    private router:Router,
    private snackBar:MatSnackBar
  ) {
    this.ratingForm = this.formBuilder.group({
      rating: ['', Validators.required],
      remarks: ['', Validators.required]
    });
  }

  async ngOnInit(): Promise<void> {
    await this.fetchEmployeeId(); // Ensure employeeId is fetched before form submission
  }

  async fetchEmployeeId(): Promise<void> {
    try {
      this.employeeId = await this.authService.getId();
      console.log(this.employeeId)
    } catch (error) {
      console.error('Error fetching employee ID:', error);
    }
  }

  addRating() {
    if (this.ratingForm.valid && this.employeeId) {
      const ratingData = {
        ...this.ratingForm.value,
        employeeId: this.employeeId
      };

      console.log('Sending Rating Data:', ratingData); // Log the data being sent

      this.ratingService.addEmpAttendanceapi(ratingData).subscribe(
        (response: any) => {
          console.log('Rating added successfully', response);
          if (response.success) {
            this.snackBar.open('Rating added successfully!', 'Close', {
              duration: 3000, // Duration in milliseconds
              panelClass: ['success-snackbar'],
              verticalPosition: 'top',
              horizontalPosition: 'right'
            });
            this.router.navigate(['/employee/layout/emp-view-rating', this.employeeId]);
          } else {
            this.snackBar.open(response.message, 'Close', {
              duration: 3000, // Duration in milliseconds
              panelClass: ['error-snackbar'],
              verticalPosition: 'top',
              horizontalPosition: 'right'
            });
          }
        },
        (error: any) => {
          console.error('Error adding rating', error);
          this.snackBar.open('Error adding rating. Please try again.', 'Close', {
            duration: 3000, // Duration in milliseconds
            panelClass: ['error-snackbar'],
            verticalPosition: 'top',
            horizontalPosition: 'right'
          });
        }
      );
    } else if (!this.employeeId) {
      console.error('Employee ID is not available.');
      this.snackBar.open('Employee ID is not available.', 'Close', {
        duration: 3000, // Duration in milliseconds
        panelClass: ['error-snackbar'],
        verticalPosition: 'top',
        horizontalPosition: 'right'
      });
    }
  }
}





