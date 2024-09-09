import { Component, OnInit } from '@angular/core';
import { ProjectService } from 'src/app/shared/project/project.service';
import { EmployeeService } from 'src/app/shared/employee/employee.service';

@Component({
  selector: 'app-view-project',
  templateUrl: './view-project.component.html',
  styleUrls: ['./view-project.component.css']
})
export class ViewProjectComponent implements OnInit {
  projects: any[] = [];
  employees: { [key: string]: string } = {};
  globalbaseurl: string;

  constructor(
    private projectService: ProjectService,
    private employeeService: EmployeeService
  ) {
    this.globalbaseurl = 'http://your-server-url'; // Initialize with your base URL
  }

  ngOnInit(): void {
    console.log("Fetching projects and employees...");
    this.getProjectApi();
    this.getEmployees();
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
          this.employees = res.data.reduce((acc: any, emp: any) => {
            acc[emp._id] = emp.name;
            return acc;
          }, {});
        } else {
          console.error('Error retrieving employees:', res.message);
        }
      },
      (error: any) => {
        console.error('Error:', error);
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
  

  getEmployeeNames(employeeIds: string[]): string[] {
    return employeeIds.map(id => {
      const name = this.employees[id];
      console.log(`ID: ${id}, Name: ${name}`);
      return name || id;
    });
  }
}
