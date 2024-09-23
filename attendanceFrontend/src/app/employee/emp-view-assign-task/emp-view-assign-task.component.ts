import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/shared/auth/auth.service';
import { ProjectService } from 'src/app/shared/project/project.service';
import Swal from 'sweetalert2';

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

  isModalOpen = false;
  feedbackList: string[] = [];
  selectedTask: any = null;  // For modal task handling

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
    // Create a set of valid statuses to check against
    const validStatuses = ['pending', 'started', 'under revision'];
  
    // Filter tasks that either match the current date or have a valid status
    this.filteredTasks = this.assignTasks.filter((task) => {
      // Check if the task has assigned days
      const hasAssignedDays = task.assignedDays && task.assignedDays.length > 0;
  
      // Check if the task is for the current day or has a valid status
      const isCurrentDateTask = hasAssignedDays && task.assignedDays.some((day: { date: string }) => {
        return day.date === this.currentDate;
      });
  
      const hasValidStatus = validStatuses.includes(task.status);
  
      // Return tasks that match either condition
      return isCurrentDateTask || hasValidStatus;
    });
  
    console.log('Filtered Tasks:', this.filteredTasks);
  }
  
  
  // Helper method to validate task status
  isValidStatus(status: string): boolean {
    const validStatuses = ['pending', 'started', 'under revision'];
    return validStatuses.includes(status);
  }
  
  changeStatus(task: any) {
    // List of statuses that should not be changeable
    const restrictedStatuses = ['waiting for approval', 'under revision: approval pending', 'completed'];
  
    // Check if the task's current status is one of the restricted statuses
    if (restrictedStatuses.includes(task.status.toLowerCase())) {
      Swal.fire({
        icon: 'error',
        title: 'Status Change Not Allowed',
        text: `You can't change the status of tasks that are ${task.status}.`,
        confirmButtonText: 'OK'
      });
      return; // Stop further execution
    }
  
    // If not restricted, proceed with the status change
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to change the status?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, change it!',
      cancelButtonText: 'No, keep it',
    }).then((result) => {
      if (result.isConfirmed) {
        const currentStatus = task.status;
  
        if (currentStatus === 'under revision') {
          this.feedbackList = task.feedback || []; // Load feedback list if available
          this.selectedTask = task;
          this.isModalOpen = true;  // Open the modal
        } else {
          const currentIndex = this.statusOptions.indexOf(currentStatus);
          const nextIndex = (currentIndex + 1) % this.statusOptions.length;
          this.updateTaskStatus(task, this.statusOptions[nextIndex]);
        }
      }
    });
  }
  
  closeModal() {
    this.isModalOpen = false;
  }

  done() {
    if (this.selectedTask) {
      this.selectedTask.status = 'Under Revision: Approval Pending';
      this.selectedTask.revisionCount = (this.selectedTask.revisionCount || 0) + 1;
      this.updateTaskStatus(this.selectedTask, 'Under Revision: Approval Pending');
    }
    this.closeModal();
  }

  updateTaskStatus(task: any, newStatus: string) {
    console.log('Updating Status:', {
      taskId: task._id,
      currentStatus: task.status,
      newStatus: newStatus,
      revisionCount: task.revisionCount
    });

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
