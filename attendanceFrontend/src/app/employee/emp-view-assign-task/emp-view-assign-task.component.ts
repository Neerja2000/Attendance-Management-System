import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/shared/auth/auth.service';
import { ProjectService } from 'src/app/shared/project/project.service';

@Component({
  selector: 'app-emp-view-assign-task',
  templateUrl: './emp-view-assign-task.component.html',
  styleUrls: ['./emp-view-assign-task.component.css']
})
export class EmpViewAssignTaskComponent {
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
  filters = {
    date: ''
  };
  selectedDates: { day: string, date: string }[] = [];
  filteredTasks: any[] = [];
  currentWeekDates: { day: string, date: string }[] = [];
  
  statusOptions = ['pending', 'started', 'waiting for approval', 'completed'];
  currentDate: string = '';

  constructor(
    private projectService: ProjectService,
    private route: ActivatedRoute,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.employeeId = this.authService.getId(); // Assuming you have a method in AuthService to extract the employeeId
    if (this.employeeId) {
      this.getProjectsForEmployee(this.employeeId);
      this.getAssignTask(); // Fetch assigned tasks as soon as employee ID is available
    }
    this.setCurrentDate();
    this.initializeWeekDates();
  }
  isDate(value: any): boolean {
    return !isNaN(Date.parse(value));
  }

  setCurrentDate() {
    const today = new Date();
    this.currentDate = today.toISOString().split('T')[0]; // Format: YYYY-MM-DD
    this.filters.date = this.currentDate; // Set the default filter to today's date
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

  initializeWeekDates() {
    const today = new Date();
    const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay() + 1)); // Monday
    const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

    this.currentWeekDates = weekDays.map((day, index) => {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + index);
      return {
        day: day,
        date: date.toISOString().split('T')[0] // Format: YYYY-MM-DD
      };
    });
  }

  getProjectApi() {
    this.projectService.getAllProjectApi().subscribe(
      (res: any) => {
        if (res.success) {
          this.projects = res.data;
          console.log("project", this.projects);
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
          console.log('Tasks:', res.data); // Debugging line
        } else {
          console.error('Error retrieving tasks:', res.message);
        }
      },
      (error: any) => {
        console.error('Error:', error);
      }
    );
  }

  getAssignTask() {
    if (!this.employeeId) {
      console.error('Employee ID is not available. Cannot fetch assigned tasks.');
      return;
    }
  
    this.projectService.getAssignTaskApi(this.employeeId).subscribe(
      (res: any) => {
        if (res.success) {
          this.assignTasks = res.data;
          console.log('Assign Tasks:', this.assignTasks); // Log the raw data
  
          this.filteredTasks = [...this.assignTasks];
          this.filterTasks(); // Automatically filter for the current date
        } else {
          console.error('Failed to retrieve assigned tasks:', res.message);
        }
      },
      (error: any) => {
        console.error('Error fetching assigned tasks:', error);
      }
    );
  }

  filterTasks() {
    if (this.filters.date) {
      // Filter based on the selected date if available
      this.filteredTasks = this.assignTasks.filter((task) => {
        return task.assignedDays.some((day: { date: string }) => {
          return day.date.trim() === this.filters.date.trim();
        });
      });
    } else {
      // Filter based on the current date
      this.filteredTasks = this.assignTasks.filter((task) => {
        return task.assignedDays.some((day: { date: string }) => {
          return day.date === this.currentDate;
        });
      });
    }

    console.log('Filtered Tasks:', this.filteredTasks);
  }

  changeStatus(task: any) {
    const currentStatus = task.status;
    const currentIndex = this.statusOptions.indexOf(currentStatus);
    const nextIndex = (currentIndex + 1) % this.statusOptions.length;
    const newStatus = this.statusOptions[nextIndex];
    
    this.projectService.updateTaskStatus(task._id, newStatus).subscribe(
      res => {
        if (res.success) {
          console.log('Status updated successfully:', res.data);
          this.getAssignTask(); // Refresh the tasks list to show updated status
        } else {
          console.error('Error updating status:', res.message);
        }
      },
      error => console.error('Error:', error)
    );
  }
}
