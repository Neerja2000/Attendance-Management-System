import { Component, OnInit } from '@angular/core';
import { ProjectService } from 'src/app/shared/project/project.service';
import { EmployeeService } from 'src/app/shared/employee/employee.service'; // Import employee service

@Component({
  selector: 'app-view-project',
  templateUrl: './view-project.component.html',
  styleUrls: ['./view-project.component.css']
})
export class ViewProjectComponent implements OnInit {
  projects: any[] = [];
  employees: { [key: string]: string } = {}; // Object to map employee IDs to names
  globalbaseurl: string;

  constructor(
    private projectService: ProjectService,
    private employeeService: EmployeeService // Inject employee service
  ) {
    this.globalbaseurl = ''; // Initialize with your base URL
  }

  ngOnInit(): void {
    console.log("Fetching projects and employees...");
    this.getProjectApi();
    this.getEmployees(); // Fetch employee data
  }

  getProjectApi() {
    this.projectService.getAllProjectApi().subscribe(
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
  
  getEmployees() {
    this.employeeService.viewEmployeeapi().subscribe(
      (res: any) => {
        if (res.success) {
          // Map _id to names
          this.employees = res.data.reduce((acc: any, emp: any) => {
            acc[emp._id] = emp.name; // Use _id as key
            return acc;
          }, {});
          // Debug log
        } else {
          console.error('Error retrieving employees:', res.message);
        }
      },
      (error: any) => {
        console.error('Error:', error);
      }
    );
  }
  
  

  fileUrl(fileName: string): string {
    return `${this.globalbaseurl}/path/to/files/${fileName}`;
  }

  getEmployeeNames(employeeIds: string[]): string[] {
    return employeeIds.map(id => {
      const name = this.employees[id];
      console.log(`ID: ${id}, Name: ${name}`); // Debug log
      return name || id; // Fallback to ID if name is not found
    });
  }
  
}
