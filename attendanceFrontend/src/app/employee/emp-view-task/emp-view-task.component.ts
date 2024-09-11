import { Component, OnInit } from '@angular/core';

import { ProjectService } from 'src/app/shared/project/project.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-emp-view-task',
  templateUrl: './emp-view-task.component.html',
  styleUrls: ['./emp-view-task.component.css']
})
export class EmpViewTaskComponent implements OnInit {

  tasks: any[] = [];
  _id!: string;

  constructor(private taskService: ProjectService ,private route:ActivatedRoute) {}

  ngOnInit(): void {
    this._id = this.route.snapshot.paramMap.get('id')!;
    console.log('Project ID:', this._id); // Check the ID being used
    this.getAllTasks();
  }


  getAllTasks() {
    this.taskService.getAllTaskProjectId(this._id).subscribe(
      (response: any) => {
        if (response.data && response.data.length > 0) {
          this.tasks = response.data;
        } else {
          this.tasks = []; // Empty tasks array when no tasks are found
          console.log('No tasks found for this project.');
        }
      },
      error => {
        console.error('Error fetching tasks', error);
      }
    );
  }
  


  // Helper to determine file type for icons
  getFileType(file: string): string {
    const extension = file.split('.').pop()?.toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif'].includes(extension!)) {
      return 'image';
    } else if (extension === 'pdf') {
      return 'pdf';
    } else {
      return 'other';
    }
  }

  // Helper to extract file name from URL
  getFileName(file: string): string {
    return file.split('/').pop()!;
  }
}
