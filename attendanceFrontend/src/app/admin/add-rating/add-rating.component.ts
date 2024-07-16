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
  employees: Employee[] = [];

    ngOnInit(): void {
      throw new Error('Method not implemented.');
    }

    
  
    addEmployee() {
      this.employees.push({ name: '', rating: 0, remarks: '' });
    }
  
    removeEmployee(index: number) {
      this.employees.splice(index, 1);
    }}
  