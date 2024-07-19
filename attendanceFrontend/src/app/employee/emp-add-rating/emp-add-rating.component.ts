import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
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
    private authService: AuthService
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
          // Optionally handle success response here
        },
        (error: any) => {
          console.error('Error adding rating', error);
          // Optionally handle error response here
        }
      );
    } else if (!this.employeeId) {
      console.error('Employee ID is not available.');
    }
  }
}





