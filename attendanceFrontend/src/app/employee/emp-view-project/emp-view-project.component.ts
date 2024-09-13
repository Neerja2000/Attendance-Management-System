import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/auth/auth.service';
import { EmployeeService } from 'src/app/shared/employee/employee.service';
import { ProjectService } from 'src/app/shared/project/project.service';

@Component({
  selector: 'app-emp-view-project',
  templateUrl: './emp-view-project.component.html',
  styleUrls: ['./emp-view-project.component.css']
})
export class EmpViewProjectComponent implements OnInit {
  projects: any[] = [];
  employees: { [key: string]: string } = {};
  employeeId: string | null = null;
  constructor(private projectService: ProjectService, private authService: AuthService,private employeeService:EmployeeService) {}

  ngOnInit(): void {
    this.employeeId = this.authService.getId(); 
    this.getProjectByEmployee();
    this.getEmployees()
  }

  getProjectByEmployee() {
    const employeeId: string | null = this.authService.getId();
    
    if (employeeId) {
      this.projectService.getProjectsByEmployee(employeeId).subscribe(
        (response: any) => {
          if (response.success) {
            this.projects = response.data;
            console.log("helloe",this.projects)
          } else {
            console.error('Failed to load projects:', response.message);
          }
        },
        (error) => {
          console.error('Error fetching projects:', error);
        }
      );
    } else {
      console.error('Employee ID is null. Cannot fetch projects.');
    }
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
