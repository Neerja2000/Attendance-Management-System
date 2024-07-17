import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
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

  constructor(private route: ActivatedRoute, private ratingService: RatingService,private router:Router) {
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
          this.router.navigateByUrl('/admin/layout/view-rating');
          console.log('Admin rating updated successfully:', res.data);
          
          
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
  