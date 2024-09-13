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

  tasks: any[] = [];
  selectedProjectId: string = '';
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
    const assignedDays = Object.keys(this.days)
      .filter(day => this.days[day])
      .map(day => day.charAt(0).toUpperCase() + day.slice(1).toLowerCase()); // Ensure correct format
  
    const taskAssignment = {
      employeeId: this.employeeId,  
      projectId: this.selectedProjectId,
      taskId: (<HTMLSelectElement>document.getElementById('task')).value,
      assignedDays: assignedDays
    };
  
    // Call the service method to assign the task
    this.projectService.assignTask(taskAssignment).subscribe(
      (res: any) => {
        if (res.success) {
          alert('Task assigned successfully');
          console.log(res.data)
        } else {
          alert('Failed to assign task');
        }
      },
      (error: any) => {
        console.error('Error:', error);
      }
    );
  }
  
  
}
