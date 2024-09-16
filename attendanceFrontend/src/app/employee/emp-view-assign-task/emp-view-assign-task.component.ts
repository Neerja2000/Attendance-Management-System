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
    this.initializeWeekDates();
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

  getNextDayDate(day: string): string {
    const dayIndexMap: Record<string, number> =  {
      'monday': 1,
      'tuesday': 2,
      'wednesday': 3,
      'thursday': 4,
      'friday': 5
    };
    
    const today = new Date();
    const todayDay = today.getDay();
    const targetDay = dayIndexMap[day.toLowerCase()];
  
    let daysUntilNext = (targetDay - todayDay + 7) % 7;
    if (daysUntilNext === 0) { // If the target day is today
      daysUntilNext = 0; // No need to move to the next week
    }
    
    const nextDate = new Date(today);
    nextDate.setDate(today.getDate() + daysUntilNext);
    
    return nextDate.toISOString().split('T')[0];  // Return the date in 'YYYY-MM-DD' format
  }

  updateDates() {
    this.selectedDates = this.currentWeekDates
      .filter(day => this.days[day.day.toLowerCase()])
      .map(day => ({
        day: day.day,
        date: day.date
      }));
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
  
          // Validate structure and type
          console.log('Data Structure:', this.assignTasks.map(task => task.assignedDays));
  
          this.filteredTasks = [...this.assignTasks];
          this.filterTasks();
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
    const today = new Date();
    const currentDate = today.toISOString().split('T')[0]; // Get today's date in 'YYYY-MM-DD' format
  
    // Calculate the start and end of the current week
    const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay() + 1)); // Monday
    const endOfWeek = new Date(today.setDate(today.getDate() - today.getDay() + 7)); // Sunday
  
    const startOfWeekStr = startOfWeek.toISOString().split('T')[0];
    const endOfWeekStr = endOfWeek.toISOString().split('T')[0];
  
    console.log('Current Date:', currentDate);
    console.log('Selected Filter Date:', this.filters.date);
    console.log('Start of Week:', startOfWeekStr);
    console.log('End of Week:', endOfWeekStr);
  
    if (this.filters.date) {
      console.log('Filtering by:', this.filters.date);
  
      // Filter based on the selected date if available
      this.filteredTasks = this.assignTasks.filter((task) => {
        console.log('Task:', task);
        return task.assignedDays.some((day: { date: string }) => {
          console.log('Checking day:', day.date, 'against filter date:', this.filters.date);
          return day.date.trim() === this.filters.date.trim();
        });
      });
    } else {
      console.log('Filtering by current week:', startOfWeekStr, 'to', endOfWeekStr);
  
      // Filter tasks for the current week
      this.filteredTasks = this.assignTasks.filter((task) => {
        console.log('Task:', task);
        return task.assignedDays.some((day: { date: string }) => {
          return day.date >= startOfWeekStr && day.date <= endOfWeekStr;
        });
      });
    }
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
