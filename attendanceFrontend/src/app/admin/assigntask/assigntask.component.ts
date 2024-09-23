import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProjectService } from 'src/app/shared/project/project.service';
import Swal from 'sweetalert2';

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
  filters = {
    date: ''
  };
  selectedDates: { day: string, date: string }[] = [];
  filteredTasks: any[] = [];
  currentWeekDates: { day: string, date: string }[] = [];
  currentDate: string = '';

  constructor(
    private projectService: ProjectService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.employeeId = params['employeeId'];
      console.log("employeeID", this.employeeId);
      if (this.employeeId) {
        this.getProjectsForEmployee(this.employeeId);
      }
    });
    this.getAssignTask();
    this.initializeWeekDates();
    this.setCurrentDate();
  }
  isDate(value: any): boolean {
    return !isNaN(Date.parse(value));
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
        date: date.toISOString().split('T')[0]
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
          this.tasks = res.data.filter((task: any) => task.status === true);
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
          this.getAssignTask();
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
    this.selectedProjectId = '';
    (<HTMLSelectElement>document.getElementById('task')).value = '';
    this.days = {
      'monday': false,
      'tuesday': false,
      'wednesday': false,
      'thursday': false,
      'friday': false
    };
    this.filters.date = '';
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
    const todayDay = today.getDay() === 0 ? 7 : today.getDay();
    const targetDay = dayIndexMap[day.toLowerCase()];

    let daysUntilNext = targetDay - todayDay;

    if (daysUntilNext < 0) {
      daysUntilNext += 7;
    }

    today.setDate(today.getDate() + daysUntilNext);
    return today.toISOString().split('T')[0];
  }

  updateDates() {
    const today = new Date();
    const todayDayIndex = today.getDay() === 0 ? 7 : today.getDay(); // 1 for Monday, 2 for Tuesday, etc.
    const dayIndexMap: Record<string, number> = {
      'monday': 1,
      'tuesday': 2,
      'wednesday': 3,
      'thursday': 4,
      'friday': 5
    };
  
    this.selectedDates = this.currentWeekDates
      .filter(day => this.days[day.day.toLowerCase()])
      .map(day => {
        const targetDayIndex = dayIndexMap[day.day.toLowerCase()];
        let targetDate = new Date(day.date);
  
        // Move earlier days to the next week, but not today
        if (targetDayIndex < todayDayIndex) {
          targetDate.setDate(targetDate.getDate() + 7); // Move earlier days to the next week
        }
  
        // Keep today as today's date
        if (targetDayIndex === todayDayIndex) {
          targetDate = today; // Ensure today's date remains as today
        }
  
        return {
          day: day.day,
          date: targetDate.toISOString().split('T')[0]
        };
      });
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
  approveTask(taskId: string, task_id: string) {
    Swal.fire({
      title: 'Confirm Task Status',
      text: "Do you want to complete the task or request some changes?",
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Complete',
      cancelButtonText: 'Request Changes'
    }).then((result) => {
      if (result.isConfirmed) {
        this.completeTask(taskId, task_id);
      } else if (result.isDismissed) {
        this.requestChanges(taskId);
      }
    });
  }
  completeTask(taskId: string, task_id: string) {
    Swal.fire({
      title: 'Rate the Task (0 to 10)',
      html: `
        <div>
          <input type="range" id="ratingSlider" min="0" max="10" step="1" value="0" style="width: 100%;" oninput="this.nextElementSibling.value = this.value">
          <output style="font-weight: bold; display: block; text-align: center;">0</output>
        </div>
        <textarea id="reviewText" placeholder="Enter your review..." style="width: 100%; margin-top: 10px; padding:5%"></textarea>
      `,
      showCancelButton: true,
      confirmButtonText: 'Submit Rating & Review',
      preConfirm: () => {
        const rating = (document.getElementById('ratingSlider') as HTMLInputElement).value;
        const review = (document.getElementById('reviewText') as HTMLTextAreaElement).value;
        return { rating, review };
      }
    }).then((result) => {
      if (result.isConfirmed) {
        const rating = parseInt(result.value.rating, 10); // Convert rating to a number
        const review = result.value.review; // Capture the review input
  
        this.projectService.completeTaskApi(taskId, rating, review).subscribe(
          (response: any) => {
            console.log('Task completed:', response);
            this.assignTasks = this.assignTasks.map(task => {
              if (task._id === taskId) {
                return { ...task, status: 'completed' };
              }
              return task;
            });
            this.filteredTasks = [...this.assignTasks];
            this.getAssignTask();
  
            this.projectService.changeTaskStatus(task_id, false).subscribe(
              (res: any) => {
                console.log('Task status changed successfully:', res);
                this.assignTasks = this.assignTasks.map(task => {
                  if (task._id === task_id) {
                    return { ...task, status: 'completed' };
                  }
                  return task;
                });
              },
              (error: any) => {
                console.error('Error changing task status:', error);
              }
            );
          },
          (error: any) => {
            console.error('Error completing task:', error);
          }
        );
      }
    });
  }
  
  
  
requestChanges(taskId: string) {
  Swal.fire({
      title: 'Request Changes',
      input: 'textarea',
      inputLabel: 'Provide feedback for the required changes',
      inputPlaceholder: 'Enter your feedback...',
      showCancelButton: true,
      confirmButtonText: 'Submit Feedback'
  }).then((result) => {
      if (result.isConfirmed && result.value) {
          const feedback = result.value as string;

          // Split the feedback by new lines into an array
          const feedbackArray = feedback.split('\n').filter(f => f.trim() !== '');
          console.log('Received feedback:', feedbackArray);

          // Send feedback as an array
          this.projectService.requestChangesApi(taskId, feedbackArray).subscribe(
              (response: any) => {
                  console.log('Changes requested:', response);
                  this.tasks = this.tasks.map(task => 
                      task._id === response.data._id ? response.data : task
                  );
                  Swal.fire('Success', response.message, 'success');
                  this.getAssignTask();
              },
              (error: any) => {
                  console.error('Error requesting changes:', error);
                  Swal.fire('Error', 'Failed to request changes.', 'error');
              }
          );
      }
  });
}








updateTaskStatus(task: { id: string; status: string; revisionCount?: number }) {
  // Increment the revision count if the current status is "under revision"
  if (task.status === 'under revision') {
    task.revisionCount = (task.revisionCount || 0) + 1; // Increment count for "under revision"
  }

  // Update the task status
  this.projectService.updateTaskStatus(task.id, task.status).subscribe((updatedTask) => {
    // Update the revision count if the new status is "Under Revision: Approval Pending"
    if (updatedTask.status === 'Under Revision: Approval Pending') {
      updatedTask.revisionCount = (updatedTask.revisionCount || 0) + 1; // Increment count for "Under Revision: Approval Pending"
    }
    
    console.log('Task updated:', updatedTask);
    this.getAssignTask(); // Refresh tasks list to show updated status
  });
}





}
