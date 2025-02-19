import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AttendanceService } from 'src/app/shared/attendance/attendance.service';

@Component({
  selector: 'app-add-emp-work',
  templateUrl: './add-emp-work.component.html',
  styleUrls: ['./add-emp-work.component.css']
})
export class AddEmpWorkComponent implements OnInit {
  workStatusForm!: FormGroup;
  workStatusList: any[] = [];
  employeeId: string = '';

  constructor(private fb: FormBuilder,private route:ActivatedRoute, private attendanceService:AttendanceService) {}

  ngOnInit(): void {
    this.initializeForm();
    // this.loadWorkStatus();

   this.route.paramMap.subscribe((params: any): void => { 
    this.employeeId = params.get('employeeId') || '';
  });
  this.fetchWorkStatus();
  }

  initializeForm() {
    this.workStatusForm = this.fb.group({
      workStatus: ['', Validators.required],
      startTime: ['', Validators.required],
      endTime: ['', Validators.required],
      workTitle: ['', Validators.required],
      workDescription: ['', Validators.required],
      difficultyLevel: ['', Validators.required]
    });
  }

  addWorkStatus() {
    console.log("submitted");
    if (this.workStatusForm.valid) {
      const workData = this.workStatusForm.value;
      this.attendanceService.addWorkStatus(workData, this.employeeId).subscribe(
        (response) => {
          alert('Work Status Added Successfully');
          console.log(response);
          this.workStatusForm.reset();
          this.fetchWorkStatus();
        },
        (error) => {
          console.error('Error adding work status', error);
          alert('Failed to add work status');
        }
      );
    }
  }
  

  fetchWorkStatus(): void {
    this.attendanceService.getWorkStatusByEmployee(this.employeeId).subscribe(
      (response) => {
        console.log('Work status data:', response);
        this.workStatusList = response.data;
      },
      (error) => {
        console.error('Error fetching work status', error);
      }
    );
  }
}
