import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ProjectService } from 'src/app/shared/project/project.service';

@Component({
  selector: 'app-add-project-task',
  templateUrl: './add-project-task.component.html',
  styleUrls: ['./add-project-task.component.css']
})
export class AddProjectTaskComponent implements OnInit {
  taskForm = new FormGroup({
    'taskName': new FormControl(''),
    'description': new FormControl(''),
    'expectedTime': new FormControl('')
  });

  _id!: string;
  uploadedFiles: File[] = []; // Property to store uploaded files
  tasks: any[] = [];

  // Reference to the file input element
  @ViewChild('fileInput') fileInput!: ElementRef;

  constructor(
    private taskService: ProjectService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this._id = this.route.snapshot.paramMap.get('id')!;
    this.getAllTasks();
  }

  getAllTasks() {
    this.taskService.getAllTaskProjectId(this._id).subscribe(
      (response: any) => {
        this.tasks = response.data; // Assuming your API returns tasks in `data`
      },
      error => {
        console.error('Error fetching tasks', error);
      }
    );
  }

  uploadFiles(event: any) {
    const files = event.target.files;
    this.uploadedFiles = Array.from(files); // Convert FileList to array
  }
  
  addTask() {
    const formData = new FormData();
    formData.append('taskName', this.taskForm.get('taskName')?.value || '');
    formData.append('description', this.taskForm.get('description')?.value || '');
    formData.append('expectedTime', this.taskForm.get('expectedTime')?.value || '');
    formData.append('projectId', this._id);

    // Append files to the formData with the field name 'files'
    this.uploadedFiles.forEach((file: File) => {
      formData.append('files', file, file.name); // Use 'files' to match Multer field name
    });
  
    this.taskService.addTaskApi(formData).subscribe(
      response => {
        console.log('Task added successfully', response);
        this.getAllTasks(); 
        this.taskForm.reset(); // Reset form fields
        this.uploadedFiles = []; // Clear uploaded files array

        // Reset the file input element
        if (this.fileInput) {
          this.fileInput.nativeElement.value = '';
        }
      },
      error => {
        console.error('Error adding task', error);
        // Optionally, display user-friendly error message
      }
    );
  }

  getFileType(file: string): string {
    const extension = file.split('.').pop() || '';  // Provide a default empty string if undefined

    if (['png', 'jpg', 'jpeg', 'gif'].includes(extension.toLowerCase())) {
      return 'image';
    } else if (['pdf'].includes(extension.toLowerCase())) {
      return 'pdf';
    } else {
      return 'unknown';
    }
  }
  getFileName(fileUrl: string): string {
    return fileUrl.split('/').pop() || 'Unknown file';
  }




  deleteTask(taskId: string) {
    this.taskService.deleteTask(taskId).subscribe(
      response => {
        console.log('Task deleted successfully', response);
        this.getAllTasks(); // Refresh the task list
      },
      error => {
        console.error('Error deleting task', error);
      }
    );
  }
}


