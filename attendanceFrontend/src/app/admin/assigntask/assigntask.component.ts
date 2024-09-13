import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProjectService } from 'src/app/shared/project/project.service';

@Component({
  selector: 'app-assigntask',
  templateUrl: './assigntask.component.html',
  styleUrls: ['./assigntask.component.css']
})
export class AssigntaskComponent implements OnInit {
  projects: any[] = [];
  employeeId: string | null = null;
  assignTasks: any[] = [];
  tasks: any[] = [];
  selectedProjectId: string = '';
  selectedTaskId: string = ''; 
  days: Record<string, boolean> = {
    monday: false,
    tuesday: false,
    wednesday: false,
    thursday: false,
    friday: false
  };

  constructor(
    private projectService: ProjectService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.employeeId = params['employeeId']; // Retrieving employeeId from query parameters
      console.log("employeeID", this.employeeId);
      if (this.employeeId) {
        this.getProjectsForEmployee(this.employeeId); // Fetch projects for the given employeeId
      }
    });
    this.getAssignTask()
  }

  getProjectsForEmployee(employeeId: string) {
    this.projectService.getProjectsByEmployee(employeeId).subscribe(
      (res: any) => {
        if (res.success) {
          this.projects = res.data;
          console.log("projects", this.projects);
        } else {
          console.error('Error retrieving projects:', res.message);
        }
      },
      (error: any) => {
        console.error('Error:', error);
      }
    );
  }

  getProjectApi() {
    this.projectService.getAllProjectApi().subscribe(
      (res: any) => {
        if (res.success) {
          this.projects = res.data;
          console.log("project", this.projects)
        } else {
          console.error('Error retrieving projects:', res.message);
        }
      },
      (error: any) => {
        console.error('Error:', error);
      }
    );
  }

  onProjectChange(event: Event) {
    const projectId = (event.target as HTMLSelectElement).value;
    this.selectedProjectId = projectId;
    this.getTasksByProject(projectId);
  }

  getTasksByProject(projectId: string) {
    this.projectService.getAllTaskProjectId(projectId).subscribe(
      (res: any) => {
        if (res.success) {
          this.tasks = res.data;
          console.log("task", this.tasks)
        } else {
          console.error('Error retrieving tasks:', res.message);
        }
      },
      (error: any) => {
        console.error('Error:', error);
      }
    );
  }

  assignTask() {
    // Collect selected days
    const assignedDays = Object.keys(this.days)
    .filter(day => this.days[day])  // Only include selected days
    .map(day => ({
      day: day.charAt(0).toUpperCase() + day.slice(1).toLowerCase(), // Capitalize day name
      date: this.getNextDayDate(day)  // Get the next closest date for the selected day
    }));
  
    // Construct the task assignment object
    const taskAssignment = {
      employeeId: this.employeeId,
      projectId: this.selectedProjectId,
      taskId: (<HTMLSelectElement>document.getElementById('task')).value,  // Using Angular's two-way binding
      assignedDays: assignedDays  // Include day name and next closest date
    };
  
    console.log("Assigning task:", taskAssignment);
  
    // Call the service method to assign the task
    this.projectService.assignTask(taskAssignment).subscribe(
      (res: any) => {
        if (res.success) {
          this.resetForm();
          this.getAssignTask()
          console.log('Task assigned successfully:', res.data);
        } else {
          console.warn('Failed to assign task:', res.message);
          alert('Failed to assign task');
        }
      },
      (error: any) => {
        console.error('Error occurred while assigning task:', error);
      }
    );
  }

  resetForm() {
    // Clear selected project and task
    this.selectedProjectId = '';
    (<HTMLSelectElement>document.getElementById('task')).value = '';
    
    // Reset days
    this.days = {
      'monday': false,
      'tuesday': false,
      'wednesday': false,
      'thursday': false,
      'friday': false
    };
  }

  // Helper function to calculate the next occurrence of a specific day
  getNextDayDate(day: string): string {
    const dayIndexMap: Record<string, number> = {
      'monday': 1,
      'tuesday': 2,
      'wednesday': 3,
      'thursday': 4,
      'friday': 5
    };
    
    const today = new Date();
    const todayDay = today.getDay();
    const targetDay = dayIndexMap[day.toLowerCase()];
    
    // Calculate the number of days until the next occurrence
    const daysUntilNext = (targetDay + 7 - todayDay) % 7 || 7;
    const nextDate = new Date(today);
    nextDate.setDate(today.getDate() + daysUntilNext);
    
    return nextDate.toISOString().split('T')[0];  // Return the date in 'YYYY-MM-DD' format
  }

  getAssignTask() {
    if (!this.employeeId) {  // Check if employeeId is null or undefined
      console.error('Employee ID is not available. Cannot fetch assigned tasks.');
      // Optionally, you could show an error message to the user or handle this case in some other way
      return;  // Exit the function if employeeId is not available
    }
  
    // Proceed with the API call if employeeId is valid
    this.projectService.getAssignTaskApi(this.employeeId).subscribe(
      (res: any) => {
        if (res.success) {
          this.assignTasks = res.data;  // Store the fetched tasks in `assignTasks`
          console.log('Assigned Tasks:', this.assignTasks);
        } else {
          console.error('Failed to retrieve assigned tasks:', res.message);
        }
      },
      (error: any) => {
        console.error('Error fetching assigned tasks:', error);
      }
    );
  }
}  
