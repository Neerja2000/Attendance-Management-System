import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms'; // Import FormBuilder
import { ActivatedRoute } from '@angular/router';
import { ProjectService } from 'src/app/shared/project/project.service';

@Component({
  selector: 'app-add-project-task',
  templateUrl: './add-project-task.component.html',
  styleUrls: ['./add-project-task.component.css']
})
export class AddProjectTaskComponent implements OnInit {
  taskForm!: FormGroup;// Use FormGroup
  _id!: string;
  uploadedFiles: File[] = []; // Property to store uploaded files
  tasks: any[] = [];
  expectedTime: string = '';
  projectBudget!: number; // To store the project budget
  totalEmployeeCost!: number; // To store the total employee cost
  remainingBudget!: number; // To store the remaining budget
  status!: string; // To store the budget status ('positive' or 'negative')

  daysArray: number[] = Array.from({ length: 30 }, (_, i) => i); // 0 to 29 days
  hoursArray: number[] = Array.from({ length: 24 }, (_, i) => i); // 0 to 23 hours
  minutesArray: number[] = [0, 10, 20, 30, 40, 50]; // Minutes options
  

  // Reference to the file input element
  @ViewChild('fileInput') fileInput!: ElementRef;

  constructor(
    private fb: FormBuilder,  // Inject FormBuilder here
    private taskService: ProjectService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this._id = this.route.snapshot.paramMap.get('id')!;
    this.getAllTasks();

    // Initialize the form using FormBuilder
    this.taskForm = this.fb.group({
      taskName: [''],
      description: [''],
      days:[''],
      hours: [''],      // Add form controls for hours and minutes
      minutes: [''],
      expectedTime: ['']
    });
  
    // Watch for changes in the time selection
    this.taskForm.valueChanges.subscribe(() => {
      this.onTimeChange();
    });
    this.getProjectBudget()
  }
  getProjectBudget() {
    this.taskService.getProjectBudgets(this._id).subscribe((res: any) => {
      if (res.success) {
        console.log("result",res)
        this.projectBudget = res.projectBudget;
        this.totalEmployeeCost = res.totalEmployeeCost;
        this.remainingBudget = res.remainingBudget;
        this.status = res.status; // 'positive' or 'negative'
      }
    }, (error) => {
      console.error('Error fetching project budget:', error);
    });
  }
  // Handle time changes to show formatted time like '4 hours 20 min'
  onTimeChange() {
    const days = this.taskForm.get('days')?.value;
    const hours = this.taskForm.get('hours')?.value;
    const minutes = this.taskForm.get('minutes')?.value;
  
    this.expectedTime = `${days ? days + ' days ' : ''}${hours ? hours + ' hours ' : ''}${minutes ? minutes + ' min' : ''}`;
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
    formData.append('expectedTime', this.expectedTime); // Use formatted expected time
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
    if (confirm('Are you sure you want to delete this task?')) {
      this.taskService.deleteTask(taskId).subscribe(
        (response) => {
          alert('Task deleted successfully');
          this.tasks = this.tasks.filter(task => task._id !== taskId); // Update the tasks list after deletion
        },
        (error) => {
          console.error('Error deleting task', error);
          alert('Failed to delete task');
        }
      );
    }
  }
}
