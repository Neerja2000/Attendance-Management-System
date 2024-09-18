import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectService } from 'src/app/shared/project/project.service';

@Component({
  selector: 'app-emp-assign-task',
  templateUrl: './emp-assign-task.component.html',
  styleUrls: ['./emp-assign-task.component.css']
})
export class EmpAssignTaskComponent {
  projects: any[] = [];
  employeeId: string | null = null;
  tasks: any[] = [];
  selectedProjectId: string = '';
  days: Record<string, boolean> = {
    monday: false,
    tuesday: false,
    wednesday: false,
    thursday: false,
    friday: false
  };
  selectedDates: { day: string, date: string }[] = [];
  currentWeekDates: { day: string, date: string }[] = [];
  currentDate: string = '';

  constructor(
    private projectService: ProjectService,
    private route: ActivatedRoute,private router:Router
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.employeeId = params.get('employeeId');
      if (this.employeeId) {
        this.getProjectsForEmployee(this.employeeId);
        this.initializeWeekDates();
        this.setCurrentDate();
      } else {
        console.error('Employee ID is not available.');
      }
    });
  }

  setCurrentDate() {
    const today = new Date();
    this.currentDate = today.toISOString().split('T')[0];
  }

  getProjectsForEmployee(employeeId: string) {
    this.projectService.getProjectsByEmployee(employeeId).subscribe(
      (res: any) => {
        if (res.success) {
          this.projects = res.data;
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
    const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay() + 1));
    const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  
    this.currentWeekDates = weekDays.map((day, index) => {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + index);
      return {
        day: day,
        date: date.toISOString().split('T')[0]
      };
    });
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
    const assignedDays = Object.keys(this.days)
      .filter(day => this.days[day])
      .map(day => ({
        day: day.charAt(0).toUpperCase() + day.slice(1).toLowerCase(),
        date: this.getNextDayDate(day)
      }));
  
    const taskAssignment = {
      employeeId: this.employeeId,
      projectId: this.selectedProjectId,
      taskId: (<HTMLSelectElement>document.getElementById('task')).value,
      assignedDays: assignedDays
    };
  
    this.projectService.assignTask(taskAssignment).subscribe(
      (res: any) => {
        if (res.success) {
          this.resetForm();
          console.log('Task assigned successfully:', res.data);
          this.router.navigate(['employee/layout/emp-view-assign-task']);
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
    this.selectedProjectId = '';
    (<HTMLSelectElement>document.getElementById('task')).value = '';
    
    this.days = {
      'monday': false,
      'tuesday': false,
      'wednesday': false,
      'thursday': false,
      'friday': false
    };
    
    this.selectedDates = [];
  }
  getNextDayDate(day: string): string {
    const dayIndexMap: Record<string, number> = {
      'monday': 1,
      'tuesday': 2,
      'wednesday': 3,
      'thursday': 4,
      'friday': 5
    };
  
    const today = new Date();
    const todayDay = today.getDay() === 0 ? 7 : today.getDay(); // Adjust for Sunday
    const targetDay = dayIndexMap[day.toLowerCase()];
  
    // Calculate the number of days until the target day
    let daysUntilNext = targetDay - todayDay;
  
    // If the target day is today or in the future this week
    if (daysUntilNext < 0) {
      daysUntilNext += 7; // Move to next week
    }
  
    today.setDate(today.getDate() + daysUntilNext);
    return today.toISOString().split('T')[0];
  }
  

  updateDates() {
    this.selectedDates = this.currentWeekDates.filter(day => this.days[day.day.toLowerCase()]);
  }
}
